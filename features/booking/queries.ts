// Read-only Supabase queries for booking data
import { createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { Service } from '@/types/service';
import type { ScheduleRule, DayOff } from '@/types/schedule';
import type {
  BookingStats,
  BookingWithService,
  ClientReminderKind,
  TimeRange,
} from '@/types/booking';
import {
  BOOKING_STATUS_COUNTED_AS_REVENUE,
  BOOKING_STATUSES_BLOCKING_AVAILABILITY,
} from '@/features/booking/status';
import {
  formatSalonDateKey,
  getSalonDayRange,
} from '@/features/booking/salon-time';
import { getClientReminderSentColumn } from '@/features/booking/utils';

/**
 * Fetches all active services, ordered by name.
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, image_url, duration_minutes, price_cents, is_active')
    .eq('is_active', true)
    .order('name');

  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Fetches a single active service by id.
 */
export async function getActiveServiceById(id: string): Promise<Service | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, image_url, duration_minutes, price_cents, is_active')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data;
}

/**
 * Fetches the schedule rule for a given day of the week.
 * Returns null if no rule exists.
 */
export async function getScheduleRule(dayOfWeek: number): Promise<ScheduleRule | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('schedule_rules')
    .select('id, day_of_week, open_time, close_time, is_active')
    .eq('day_of_week', dayOfWeek)
    .limit(1)
    .single();

  if (error && error.code === 'PGRST116') return null; // No rows found
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetches all bookings that block availability for a given date.
 * Returns an array of TimeRange for overlap checking.
 */
export async function getBookingsForDate(date: Date): Promise<TimeRange[]> {
  const supabase = createServiceRoleClient();
  const { start, end } = getSalonDayRange(date);

  const { data, error } = await supabase
    .from('bookings')
    .select('starts_at, ends_at')
    .gte('starts_at', start.toISOString())
    .lt('starts_at', end.toISOString())
    .in('status', BOOKING_STATUSES_BLOCKING_AVAILABILITY);

  if (error) throw new Error(error.message);

  return (data ?? []).map((booking) => ({
    start: new Date(booking.starts_at),
    end: new Date(booking.ends_at),
  }));
}

/**
 * Fetches all future days off.
 */
export async function getDaysOff(): Promise<DayOff[]> {
  const supabase = await createServerClient();

  const today = formatDateISO(new Date());

  const { data, error } = await supabase
    .from('days_off')
    .select('id, date, reason')
    .gte('date', today)
    .order('date');

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    reason: row.reason ?? undefined,
  }));
}

// --- Internal helper ---

function formatDateISO(date: Date): string {
  return formatSalonDateKey(date);
}

/**
 * Fetches bookings with joined service data for a date range.
 * Used by the dashboard agenda view.
 */
export async function getBookingsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<BookingWithService[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, image_url, duration_minutes, price_cents)')
    .gte('starts_at', startDate.toISOString())
    .lte('starts_at', endDate.toISOString())
    .neq('status', 'cancelled')
    .order('starts_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    client_name: row.client_name,
    client_email: row.client_email,
    client_phone: row.client_phone ?? undefined,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    status: row.status as BookingWithService['status'],
    cancel_token: row.cancel_token,
    service: Array.isArray(row.service) ? row.service[0] : row.service as BookingWithService['service'],
  }));
}

/**
 * Fetches dashboard stats: monthly revenue, booking count, recent booking count, weekly fill rate.
 */
export async function getBookingStats(): Promise<BookingStats> {
  const supabase = await createServerClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Monthly confirmed bookings
  const { data: confirmedBookings, error: confirmedError } = await supabase
    .from('bookings')
    .select('id, service:services(price_cents)')
    .eq('status', BOOKING_STATUS_COUNTED_AS_REVENUE)
    .gte('starts_at', monthStart.toISOString())
    .lte('starts_at', monthEnd.toISOString());

  if (confirmedError) throw new Error(confirmedError.message);

  const monthlyRevenue = (confirmedBookings ?? []).reduce((sum, b) => {
    const svc = Array.isArray(b.service) ? b.service[0] : b.service;
    return sum + (svc?.price_cents ?? 0);
  }, 0);

  // Monthly total bookings (non-cancelled)
  const { count: monthlyCount, error: countError } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'cancelled')
    .gte('starts_at', monthStart.toISOString())
    .lte('starts_at', monthEnd.toISOString());

  if (countError) throw new Error(countError.message);

  // Recent bookings created this week
  const weekStart = getStartOfWeek(now);
  const { count: recentCount, error: recentError } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'cancelled')
    .gte('created_at', weekStart.toISOString());

  if (recentError) throw new Error(recentError.message);

  // Weekly fill rate: bookings this week / available slots this week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59);

  const { count: weeklyBookings, error: weeklyError } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'cancelled')
    .gte('starts_at', weekStart.toISOString())
    .lte('starts_at', weekEnd.toISOString());

  if (weeklyError) throw new Error(weeklyError.message);

  // Approximate fill rate: assume ~8 slots per active day, 6 active days
  const estimatedWeeklySlots = 48;
  const fillRate = estimatedWeeklySlots > 0
    ? Math.min(100, Math.round(((weeklyBookings ?? 0) / estimatedWeeklySlots) * 100))
    : 0;

  return {
    monthly_revenue_cents: monthlyRevenue,
    monthly_bookings_count: monthlyCount ?? 0,
    recent_bookings_count: recentCount ?? 0,
    weekly_fill_rate: fillRate,
  };
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Fetches a single booking with its joined service data.
 */
export async function getBookingById(
  id: string
): Promise<BookingWithService | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, image_url, duration_minutes, price_cents)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return {
    id: data.id,
    client_name: data.client_name,
    client_email: data.client_email,
    client_phone: data.client_phone ?? undefined,
    starts_at: data.starts_at,
    ends_at: data.ends_at,
    status: data.status as BookingWithService['status'],
    cancel_token: data.cancel_token,
    service: Array.isArray(data.service) ? data.service[0] : data.service as BookingWithService['service'],
  };
}

export async function getBookingByIdAndCancelToken(
  id: string,
  cancelToken: string
): Promise<BookingWithService | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, image_url, duration_minutes, price_cents)')
    .eq('id', id)
    .eq('cancel_token', cancelToken)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return {
    id: data.id,
    client_name: data.client_name,
    client_email: data.client_email,
    client_phone: data.client_phone ?? undefined,
    starts_at: data.starts_at,
    ends_at: data.ends_at,
    status: data.status as BookingWithService['status'],
    cancel_token: data.cancel_token,
    service: Array.isArray(data.service) ? data.service[0] : data.service as BookingWithService['service'],
  };
}

export async function getBookingByCancelToken(
  cancelToken: string
): Promise<BookingWithService | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, image_url, duration_minutes, price_cents)')
    .eq('cancel_token', cancelToken)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return {
    id: data.id,
    client_name: data.client_name,
    client_email: data.client_email,
    client_phone: data.client_phone ?? undefined,
    starts_at: data.starts_at,
    ends_at: data.ends_at,
    status: data.status as BookingWithService['status'],
    cancel_token: data.cancel_token,
    service: Array.isArray(data.service) ? data.service[0] : data.service as BookingWithService['service'],
  };
}

export async function getConfirmedBookingsDueForClientReminder(
  kind: ClientReminderKind,
  startDate: Date,
  endDate: Date
): Promise<BookingWithService[]> {
  const supabase = createServiceRoleClient();
  const reminderSentColumn = getClientReminderSentColumn(kind);

  const { data, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, image_url, duration_minutes, price_cents)')
    .eq('status', 'confirmed')
    .gte('starts_at', startDate.toISOString())
    .lt('starts_at', endDate.toISOString())
    .is(reminderSentColumn, null)
    .order('starts_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    client_name: row.client_name,
    client_email: row.client_email,
    client_phone: row.client_phone ?? undefined,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    status: row.status as BookingWithService['status'],
    cancel_token: row.cancel_token,
    service: Array.isArray(row.service) ? row.service[0] : row.service as BookingWithService['service'],
  }));
}
