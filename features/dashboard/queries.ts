import { getBookingsByDateRange, getBookingStats } from '@/features/booking/queries'
import { createServerClient } from '@/lib/supabase/server'
import type { BookingWithService } from '@/types/booking'
import type { AgendaViewMode, DashboardBookingWithCreatedAt, DashboardData } from '@/types/dashboard'
import {
  buildDashboardAgendaDays,
  buildDashboardAgendaMobileWeekColumns,
  buildDashboardAgendaMonth,
  buildDashboardAgendaSummary,
  buildDashboardAgendaWeekColumns,
  buildDashboardMetrics,
  formatDashboardDateLabel,
  formatSalonDateKey,
  getCurrentWeekSalonStart,
  getMobileAgendaWeekSalonRange,
  getTodaySalonRange,
  mapBookingsToAgendaItems,
  mapBookingsToRecentBookings,
} from '@/features/dashboard/utils'

const RECENT_BOOKINGS_LIMIT = 3

/**
 * Builds the full dashboard data payload.
 * @param dateKey — optional YYYY-MM-DD string to select a specific date (from URL search params).
 * @param view — 'day' (default) or 'week'.
 */
export async function getDashboardData(
  dateKey?: string,
  view: AgendaViewMode = 'day'
): Promise<DashboardData> {
  const referenceDate = dateKey ? parseDateKey(dateKey) : new Date()
  const todayRange = getTodaySalonRange(referenceDate)
  const weekStart = getCurrentWeekSalonStart(referenceDate)
  const mobileWeekRange = getMobileAgendaWeekSalonRange(referenceDate)

  const [stats, todayBookings, weekBookings, recentBookings] = await Promise.all([
    getBookingStats(),
    getBookingsByDateRange(todayRange.start, todayRange.end),
    view === 'week'
      ? getBookingsByDateRange(mobileWeekRange.start, mobileWeekRange.end)
      : Promise.resolve([]),
    getRecentDashboardBookings(weekStart),
  ])

  return {
    dateLabel: formatDashboardDateLabel(referenceDate),
    selectedDateKey: formatSalonDateKey(referenceDate),
    view,
    agendaMonth: buildDashboardAgendaMonth(referenceDate),
    agendaSummary: buildDashboardAgendaSummary(todayBookings),
    metrics: buildDashboardMetrics(stats, todayBookings.length),
    agendaDays: buildDashboardAgendaDays(referenceDate),
    agendaItems: mapBookingsToAgendaItems(todayBookings),
    agendaWeekColumns: buildDashboardAgendaWeekColumns(weekBookings, referenceDate),
    agendaMobileWeekColumns: buildDashboardAgendaMobileWeekColumns(weekBookings, referenceDate),
    recentBookings: mapBookingsToRecentBookings(recentBookings, referenceDate),
  }
}

function parseDateKey(dateKey: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey)
  if (!match) return new Date()

  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0))
}

async function getRecentDashboardBookings(
  createdSince: Date
): Promise<DashboardBookingWithCreatedAt[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, created_at, service:services(name, image_url, duration_minutes, price_cents)')
    .neq('status', 'cancelled')
    .gte('created_at', createdSince.toISOString())
    .order('created_at', { ascending: false })
    .limit(RECENT_BOOKINGS_LIMIT)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: row.id,
    client_name: row.client_name,
    client_email: row.client_email,
    client_phone: row.client_phone ?? undefined,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    status: row.status as BookingWithService['status'],
    cancel_token: row.cancel_token,
    created_at: row.created_at,
    service: Array.isArray(row.service)
      ? row.service[0]
      : (row.service as BookingWithService['service']),
  }))
}
