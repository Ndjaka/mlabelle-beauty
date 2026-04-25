// Server Actions for booking — orchestrate queries, mutations, and notifications
'use server';

import type { CreateBookingInput, BookingResult } from '@/types/booking';
import type { ActionResult } from '@/types/action';
import { getActiveServices } from '@/features/booking/queries';
import { getScheduleRule, getBookingsForDate, getDaysOff } from '@/features/booking/queries';
import { createBooking, updateBookingStatus } from '@/features/booking/mutations';
import { getAvailableSlots } from '@/features/booking/utils';

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

    return {
      success: true,
      bookingId: result.id,
      cancelToken: result.cancel_token,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Erreur lors de la réservation : ${message}` };
  }
}

/**
 * Confirms a pending booking (admin action).
 */
export async function confirmBooking(bookingId: string): Promise<ActionResult> {
  try {
    await updateBookingStatus(bookingId, 'confirmed');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible de confirmer : ${message}` };
  }
}

/**
 * Cancels a booking (admin action).
 */
export async function cancelBookingByAdmin(bookingId: string): Promise<ActionResult> {
  try {
    await updateBookingStatus(bookingId, 'cancelled');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible d'annuler : ${message}` };
  }
}
