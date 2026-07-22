// Server Actions for booking — orchestrate queries, mutations, and notifications
'use server';

import type { CreateBookingInput, BookingResult, BookingWithService } from '@/types/booking';
import type { ActionResult } from '@/types/action';
import { getCurrentAuthUser } from '@/features/auth/queries';
import { isAdminUser } from '@/features/auth/utils';
import { validateAdminBookingInput } from '@/features/booking/admin-booking';
import { getActiveServices, getActiveServiceById, getBookingById } from '@/features/booking/queries';
import { getScheduleRule, getBookingsForDate, getDaysOff } from '@/features/booking/queries';
import { revalidatePath } from 'next/cache';
import {
  createAdminBooking,
  createBooking,
  updateBookingStatus,
  cancelBookingByToken as cancelBookingByTokenMutation,
} from '@/features/booking/mutations';
import {
  sendAdminCreatedBookingConfirmation,
  sendBookingCancellation,
  sendBookingConfirmation,
  sendBookingRequestReceived,
  sendHairdresserBookingRequestReceived,
} from '@/features/notifications/email';
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit';
import {
  formatSalonDateLong,
  formatSalonTime,
  getSalonDayOfWeek,
  parseSalonDateKey,
} from '@/features/booking/salon-time';
import {
  BOOKING_SLOT_UNAVAILABLE_ERROR,
  getAvailableSlots,
  groupSlotsByPeriod,
  formatDuration,
  formatPriceRange,
  hasRequiredBookingPhone,
} from '@/features/booking/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Books an appointment after server-side validation and availability check.
 * Never trust client-side slot availability — always revalidate server-side.
 */
export async function bookAppointment(data: CreateBookingInput): Promise<BookingResult> {
  // 1. Validate inputs
  if (!data.client_name.trim()) {
    return { success: false, error: 'Le nom est requis.' };
  }

  if (!EMAIL_REGEX.test(data.client_email)) {
    return { success: false, error: 'Adresse email invalide.' };
  }

  if (!hasRequiredBookingPhone(data.client_phone)) {
    return { success: false, error: 'Le numéro de téléphone est requis.' };
  }

  if (!data.service_id) {
    return { success: false, error: 'Le service est requis.' };
  }

  if (data.starts_at <= new Date()) {
    return { success: false, error: 'Le créneau doit être dans le futur.' };
  }

  // 2. Fetch service to get duration
  const services = await getActiveServices();
  const service = services.find((s) => s.id === data.service_id);

  if (!service) {
    return { success: false, error: 'Service introuvable ou inactif.' };
  }

  // 3. Re-verify availability server-side (race condition protection)
  const dayOfWeek = getSalonDayOfWeek(data.starts_at);
  const [scheduleRule, existingBookings, daysOff] = await Promise.all([
    getScheduleRule(dayOfWeek),
    getBookingsForDate(data.starts_at),
    getDaysOff(),
  ]);

  const availableSlots = getAvailableSlots(
    data.starts_at,
    scheduleRule,
    existingBookings,
    service.duration_minutes,
    daysOff
  );

  // Check that the requested slot is available
  const requestedTime = formatSalonTime(data.starts_at);

  if (!availableSlots.includes(requestedTime)) {
    return { success: false, error: BOOKING_SLOT_UNAVAILABLE_ERROR };
  }

  // 4. Create booking
  try {
    const result = await createBooking(data, service.duration_minutes);
    const formattedDate = formatSalonDateLong(data.starts_at);
    const duration = formatDuration(service.duration_minutes);
    const price = formatPriceRange(service.price_cents, service.price_max_cents);

    try {
      await sendBookingRequestReceived({
        clientName: data.client_name,
        clientEmail: data.client_email,
        clientPhone: data.client_phone.trim(),
        serviceName: service.name,
        date: formattedDate,
        slot: requestedTime,
        duration,
        price,
        cancelToken: result.cancel_token,
      });
    } catch (emailError) {
      console.error('Failed to send booking request email', emailError);
    }

    try {
      await sendHairdresserBookingRequestReceived({
        clientName: data.client_name,
        clientEmail: data.client_email,
        clientPhone: data.client_phone.trim(),
        serviceName: service.name,
        date: formattedDate,
        slot: requestedTime,
        duration,
        price,
        deposit: BOOKING_DEPOSIT_LABEL,
      });
    } catch (emailError) {
      console.error('Failed to send hairdresser booking notification', emailError);
    }

    return {
      success: true,
      bookingId: result.id,
      cancelToken: result.cancel_token,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    if (message === BOOKING_SLOT_UNAVAILABLE_ERROR) {
      return { success: false, error: message };
    }

    return { success: false, error: `Erreur lors de la réservation : ${message}` };
  }
}

/**
 * Confirms a booking after the deposit has been validated by the admin.
 * Sends the final confirmation email to the client.
 */
export async function confirmBookingByAdmin(bookingId: string): Promise<ActionResult> {
  try {
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return { success: false, error: 'Réservation introuvable.' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'Impossible de confirmer une réservation annulée.' };
    }

    if (booking.status === 'confirmed') {
      return { success: false, error: 'Cette réservation est déjà confirmée.' };
    }

    await updateBookingStatus(bookingId, 'confirmed');

    try {
      const startsAt = new Date(booking.starts_at);
      await sendBookingConfirmation({
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        serviceName: booking.service.name,
        date: formatSalonDateLong(startsAt),
        slot: formatSalonTime(startsAt),
        duration: formatDuration(booking.service.duration_minutes),
        price: formatPriceRange(booking.service.price_cents, booking.service.price_max_cents),
        cancelToken: booking.cancel_token,
      });
    } catch (emailError) {
      console.error('Failed to send admin confirmation email', emailError);
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible de confirmer : ${message}` };
  }
}

/**
 * Cancels a booking (admin action).
 * Fetches the booking first to validate its state, then cancels it
 * and notifies the client by email (non-blocking).
 */
export async function cancelBookingByAdmin(bookingId: string): Promise<ActionResult> {
  try {
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return { success: false, error: 'Réservation introuvable.' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'Cette réservation est déjà annulée.' };
    }

    await updateBookingStatus(bookingId, 'cancelled');

    try {
      const startsAt = new Date(booking.starts_at);
      await sendBookingCancellation({
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        serviceName: booking.service.name,
        date: formatSalonDateLong(startsAt),
        slot: formatSalonTime(startsAt),
        duration: formatDuration(booking.service.duration_minutes),
        price: formatPriceRange(booking.service.price_cents, booking.service.price_max_cents),
        cancelToken: booking.cancel_token,
      });
    } catch (emailError) {
      console.error('Failed to send admin cancellation email', emailError);
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible d'annuler : ${message}` };
  }
}

/**
 * Creates a confirmed booking from the protected admin dashboard.
 * Admin bookings still re-check availability server-side before insertion.
 */
export async function createBookingByAdmin(data: CreateBookingInput): Promise<BookingResult> {
  const user = await getCurrentAuthUser();
  if (!isAdminUser(user)) {
    return { success: false, error: 'Accès non autorisé.' };
  }

  const validation = validateAdminBookingInput(data);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const service = await getActiveServiceById(data.service_id);
  if (!service) {
    return { success: false, error: 'Prestation introuvable ou inactive.' };
  }

  const dayOfWeek = getSalonDayOfWeek(data.starts_at);
  const [scheduleRule, existingBookings, daysOff] = await Promise.all([
    getScheduleRule(dayOfWeek),
    getBookingsForDate(data.starts_at),
    getDaysOff(),
  ]);
  const availableSlots = getAvailableSlots(
    data.starts_at,
    scheduleRule,
    existingBookings,
    service.duration_minutes,
    daysOff
  );
  const requestedTime = formatBookingTime(data.starts_at);

  if (!availableSlots.includes(requestedTime)) {
    return { success: false, error: BOOKING_SLOT_UNAVAILABLE_ERROR };
  }

  try {
    const result = await createAdminBooking(data, service.duration_minutes);
    const formattedDate = formatSalonDateLong(data.starts_at);
    const duration = formatDuration(service.duration_minutes);
    const price = formatPriceRange(service.price_cents, service.price_max_cents);

    try {
      await sendAdminCreatedBookingConfirmation({
        clientName: data.client_name,
        clientEmail: data.client_email,
        clientPhone: data.client_phone.trim(),
        serviceName: service.name,
        date: formattedDate,
        slot: requestedTime,
        duration,
        price,
        cancelToken: result.cancel_token,
      });
    } catch (emailError) {
      console.error('Failed to send admin-created booking confirmation email', emailError);
    }

    revalidatePath('/dashboard');
    revalidatePath('/agenda');
    revalidatePath('/reservations');

    return {
      success: true,
      bookingId: result.id,
      cancelToken: result.cancel_token,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    if (message === BOOKING_SLOT_UNAVAILABLE_ERROR) {
      return { success: false, error: message };
    }

    return { success: false, error: `Impossible de créer la réservation : ${message}` };
  }
}

/**
 * Recovers available slots for a given date, structured into morning and afternoon.
 */
export async function getSlotsForDate(
  dateStr: string,
  serviceId: string
): Promise<{ morning: string[], afternoon: string[] }> {
  const date = parseSalonDateKey(dateStr);
  if (!date) {
    return { morning: [], afternoon: [] };
  }

  const service = await getActiveServiceById(serviceId);
  if (!service) {
    return { morning: [], afternoon: [] };
  }

  const dayOfWeek = getSalonDayOfWeek(date);
  const [scheduleRule, existingBookings, daysOff] = await Promise.all([
    getScheduleRule(dayOfWeek),
    getBookingsForDate(date),
    getDaysOff(),
  ]);

  const available = getAvailableSlots(
    date,
    scheduleRule,
    existingBookings,
    service.duration_minutes,
    daysOff
  );

  return groupSlotsByPeriod(available);
}

/**
 * Cancels a booking via its public cancel_token (client-facing action).
 * Delegates all validation and DB mutation to the mutations layer.
 */
export async function cancelBookingByToken(
  token: string
): Promise<ActionResult & { booking?: BookingWithService }> {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return { success: false, error: 'Token d\'annulation manquant.' };
  }

  try {
    const booking = await cancelBookingByTokenMutation(token.trim());

    try {
      const startsAt = new Date(booking.starts_at);
      await sendBookingCancellation({
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        serviceName: booking.service.name,
        date: formatSalonDateLong(startsAt),
        slot: formatSalonTime(startsAt),
        duration: formatDuration(booking.service.duration_minutes),
        price: formatPriceRange(booking.service.price_cents, booking.service.price_max_cents),
        cancelToken: booking.cancel_token,
      });
    } catch (emailError) {
      console.error('Failed to send booking cancellation email', emailError);
    }

    return { success: true, booking };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: message };
  }
}

function formatBookingTime(date: Date): string {
  return formatSalonTime(date);
}
