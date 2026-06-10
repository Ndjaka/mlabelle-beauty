import { getBookingsByDateRange, getBookingStats } from '@/features/booking/queries'
import { createServerClient } from '@/lib/supabase/server'
import type { BookingWithService } from '@/types/booking'
import type { DashboardBookingWithCreatedAt, DashboardData } from '@/types/dashboard'
import {
  buildDashboardAgendaDays,
  buildDashboardMetrics,
  formatDashboardDateLabel,
  getCurrentWeekSalonStart,
  getTodaySalonRange,
  mapBookingsToAgendaItems,
  mapBookingsToRecentBookings,
} from '@/features/dashboard/utils'

const RECENT_BOOKINGS_LIMIT = 3

export async function getDashboardData(
  referenceDate = new Date()
): Promise<DashboardData> {
  const todayRange = getTodaySalonRange(referenceDate)
  const weekStart = getCurrentWeekSalonStart(referenceDate)

  const [stats, todayBookings, recentBookings] = await Promise.all([
    getBookingStats(),
    getBookingsByDateRange(todayRange.start, todayRange.end),
    getRecentDashboardBookings(weekStart),
  ])

  return {
    dateLabel: formatDashboardDateLabel(referenceDate),
    metrics: buildDashboardMetrics(stats, todayBookings.length),
    agendaDays: buildDashboardAgendaDays(referenceDate),
    agendaItems: mapBookingsToAgendaItems(todayBookings),
    recentBookings: mapBookingsToRecentBookings(recentBookings, referenceDate),
  }
}

async function getRecentDashboardBookings(
  createdSince: Date
): Promise<DashboardBookingWithCreatedAt[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_email, client_phone, starts_at, ends_at, status, cancel_token, created_at, service:services(name, duration_minutes, price_cents)')
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
