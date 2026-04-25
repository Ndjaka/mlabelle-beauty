// Write operations for booking data (create, update, cancel)
import { createServerClient } from '@/lib/supabase/server';
import type { CreateBookingInput } from '@/types/booking';

/**
 * Creates a new booking with status 'pending'.
 * Computes ends_at from starts_at + serviceDurationMinutes.
 * Returns the booking id and cancel_token.
 */
export async function createBooking(
  data: CreateBookingInput,
  serviceDurationMinutes: number
): Promise<{ id: string; cancel_token: string }> {
  const supabase = await createServerClient();

  const endsAt = new Date(data.starts_at.getTime() + serviceDurationMinutes * 60 * 1000);

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      service_id: data.service_id,
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone ?? null,
      starts_at: data.starts_at.toISOString(),
      ends_at: endsAt.toISOString(),
      status: 'pending',
    })
    .select('id, cancel_token')
    .single();

  if (error) throw new Error(error.message);
  if (!booking) throw new Error('Booking creation failed: no data returned');

  return { id: booking.id, cancel_token: booking.cancel_token };
}

/**
 * Updates booking status (confirm or cancel).
 * Requires authenticated user (uses server client).
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'cancelled'
): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
}
