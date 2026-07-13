// Server Actions for booking — orchestrate queries, mutations, and notifications
'use server';

import type { CreateBookingInput, BookingResult, BookingWithService } from '@/types/booking';
import type { ActionResult } from '@/types/action';
import { getActiveServices, getActiveServiceById, getBookingById } from '@/features/booking/queries';
import { getScheduleRule, getBookingsForDate, getDaysOff } from '@/features/booking/queries';
import { revalidatePath } from 'next/cache';
import { createBooking, updateBookingStatus, cancelBookingByToken as cancelBookingByTokenMutation } from '@/features/booking/mutations';
import {
  sendBookingCancellation,
  sendBookingConfirmation,
  sendBookingRequestReceived,
  sendHairdresserBookingRequestReceived,
} from '@/features/notifications/email';
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit';
import { getAvailableSlots, groupSlotsByPeriod, formatDuration, formatPrice } from '@/features/booking/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const dayOfWeek = data.starts_at.getDay();
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
  const requestedTime = `${String(data.starts_at.getHours()).padStart(2, '0')}:${String(data.starts_at.getMinutes()).padStart(2, '0')}`;

  if (!availableSlots.includes(requestedTime)) {
    return { success: false, error: 'Ce créneau n\'est plus disponible.' };
  }

  // 4. Create booking
  try {
    const result = await createBooking(data, service.duration_minutes);
    const formattedDate = format(data.starts_at, 'EEEE d MMMM yyyy', { locale: fr });
    const duration = formatDuration(service.duration_minutes);
    const price = formatPrice(service.price_cents);

    try {
      await sendBookingRequestReceived({
        clientName: data.client_name,
        clientEmail: data.client_email,
        clientPhone: data.client_phone,
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
        clientPhone: data.client_phone,
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
    if (message === 'Ce créneau n\'est plus disponible.') {
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
        date: format(startsAt, 'EEEE d MMMM yyyy', { locale: fr }),
        slot: `${String(startsAt.getHours()).padStart(2, '0')}:${String(startsAt.getMinutes()).padStart(2, '0')}`,
        duration: formatDuration(booking.service.duration_minutes),
        price: formatPrice(booking.service.price_cents),
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
        date: format(startsAt, 'EEEE d MMMM yyyy', { locale: fr }),
        slot: `${String(startsAt.getHours()).padStart(2, '0')}:${String(startsAt.getMinutes()).padStart(2, '0')}`,
        duration: formatDuration(booking.service.duration_minutes),
        price: formatPrice(booking.service.price_cents),
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
 * Recovers available slots for a given date, structured into morning and afternoon.
 */
export async function getSlotsForDate(
  dateStr: string,
  serviceId: string
): Promise<{ morning: string[], afternoon: string[] }> {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { morning: [], afternoon: [] };
  }

  const service = await getActiveServiceById(serviceId);
  if (!service) {
    return { morning: [], afternoon: [] };
  }

  const dayOfWeek = date.getDay();
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
        date: format(startsAt, 'EEEE d MMMM yyyy', { locale: fr }),
        slot: `${String(startsAt.getHours()).padStart(2, '0')}:${String(startsAt.getMinutes()).padStart(2, '0')}`,
        duration: formatDuration(booking.service.duration_minutes),
        price: formatPrice(booking.service.price_cents),
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
