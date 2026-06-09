// Read-only Supabase queries for booking data
import { createServerClient } from '@/lib/supabase/server';
import type { Service } from '@/types/service';
import type { ScheduleRule, DayOff } from '@/types/schedule';
import type { TimeRange, BookingWithService, BookingStats } from '@/types/booking';

/**
 * Fetches all active services, ordered by name.
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('id, name, duration_minutes, price_cents, is_active')
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
    .select('id, name, duration_minutes, price_cents, is_active, description')
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
 * Fetches all pending/confirmed bookings for a given date.
 * Returns an array of TimeRange for overlap checking.
 */
export async function getBookingsForDate(date: Date): Promise<TimeRange[]> {
  const supabase = await createServerClient();

  // Format date as ISO string for Supabase filtering
  const dateStr = formatDateISO(date);
  const nextDateStr = formatDateISO(new Date(date.getTime() + 24 * 60 * 60 * 1000));

  const { data, error } = await supabase
    .from('bookings')
    .select('starts_at, ends_at')
    .gte('starts_at', `${dateStr}T00:00:00`)
    .lt('starts_at', `${nextDateStr}T00:00:00`)
    .in('status', ['pending', 'confirmed']);

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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, duration_minutes, price_cents)')
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
 * Fetches dashboard stats: monthly revenue, booking count, pending count, weekly fill rate.
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
    .eq('status', 'confirmed')
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

  // Pending bookings count
  const { count: pendingCount, error: pendingError } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (pendingError) throw new Error(pendingError.message);

  // Weekly fill rate: bookings this week / available slots this week
  const weekStart = getStartOfWeek(now);
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
    pending_bookings_count: pendingCount ?? 0,
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
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, service:services(name, duration_minutes, price_cents)')
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
