// Write operations for booking data (create, update, cancel)
import { createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { Database } from '@/lib/supabase/types';
import type { BookingWithService, ClientReminderKind, CreateBookingInput } from '@/types/booking';
import {
  ADMIN_CREATED_BOOKING_STATUS,
  CLIENT_CREATED_BOOKING_STATUS,
} from '@/features/booking/status';
import {
  BOOKING_SLOT_UNAVAILABLE_ERROR,
  getClientReminderSentColumn,
} from '@/features/booking/utils';

type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

/**
 * Creates a new client booking waiting for admin confirmation after deposit.
 * Computes ends_at from starts_at + serviceDurationMinutes.
 * Returns the booking id and cancel_token.
 */
export async function createBooking(
  data: CreateBookingInput,
  serviceDurationMinutes: number
): Promise<{ id: string; cancel_token: string }> {
  const supabase = createServiceRoleClient();

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
      status: CLIENT_CREATED_BOOKING_STATUS,
    })
    .select('id, cancel_token')
    .single();

  if (error) {
    if (error.code === '23P01') {
      throw new Error(BOOKING_SLOT_UNAVAILABLE_ERROR);
    }

    throw new Error(error.message);
  }
  if (!booking) throw new Error('Booking creation failed: no data returned');

  return { id: booking.id, cancel_token: booking.cancel_token };
}

/**
 * Creates a confirmed booking from the trusted admin dashboard.
 * Computes ends_at from starts_at + serviceDurationMinutes.
 */
export async function createAdminBooking(
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
      status: ADMIN_CREATED_BOOKING_STATUS,
    })
    .select('id, cancel_token')
    .single();

  if (error) {
    if (error.code === '23P01') {
      throw new Error(BOOKING_SLOT_UNAVAILABLE_ERROR);
    }

    throw new Error(error.message);
  }
  if (!booking) throw new Error('Booking creation failed: no data returned');

  return { id: booking.id, cancel_token: booking.cancel_token };
}

/**
 * Updates booking status for trusted admin flows.
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

/**
 * Cancels a booking by its cancel_token (public client action).
 * Returns the cancelled booking with service data on success.
 * Throws a descriptive error if the token is invalid, already cancelled,
 * or the appointment is in the past.
 */
export async function cancelBookingByToken(
  token: string
): Promise<BookingWithService> {
  const supabase = createServiceRoleClient();

  // 1. Find the booking by token
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select(
      'id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, image_url, duration_minutes, price_cents)'
    )
    .eq('cancel_token', token)
    .single();

  if (fetchError || !booking) {
    throw new Error('Ce lien d\'annulation est invalide ou expiré.');
  }

  // 2. Already cancelled
  if (booking.status === 'cancelled') {
    throw new Error('Cette réservation a déjà été annulée.');
  }

  // 3. Appointment must be in the future
  if (new Date(booking.starts_at) <= new Date()) {
    throw new Error('Impossible d\'annuler un rendez-vous passé.');
  }

  // 4. Cancel it
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', booking.id);

  if (updateError) throw new Error(updateError.message);

  const service = Array.isArray(booking.service)
    ? booking.service[0]
    : booking.service;

  return {
    id: booking.id,
    client_name: booking.client_name,
    client_email: booking.client_email,
    client_phone: booking.client_phone ?? undefined,
    starts_at: booking.starts_at,
    ends_at: booking.ends_at,
    status: 'cancelled',
    cancel_token: booking.cancel_token,
    service: service as BookingWithService['service'],
  };
}

export async function markClientReminderSent(
  bookingId: string,
  kind: ClientReminderKind,
  sentAt: Date
): Promise<void> {
  const supabase = createServiceRoleClient();
  const reminderSentColumn = getClientReminderSentColumn(kind);
  const updates: BookingUpdate = {
    [reminderSentColumn]: sentAt.toISOString(),
  };

  const { error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .is(reminderSentColumn, null);

  if (error) throw new Error(error.message);
}
