import type {
  AgendaViewMode,
  DashboardAgendaItem,
  DashboardAgendaWeekColumn,
  DashboardRecentBooking,
} from '@/types/dashboard'
import { formatSalonDateKey } from '@/features/dashboard/utils'

export function countDashboardAgendaBookings(items: DashboardAgendaItem[]): number {
  return items.filter((item) => item.kind === 'booking').length
}

export function countDashboardAgendaViewBookings(
  view: AgendaViewMode,
  dayItems: DashboardAgendaItem[],
  weekColumns: DashboardAgendaWeekColumn[]
): number {
  const visibleItems =
    view === 'week' ? weekColumns.flatMap((column) => column.items) : dayItems

  return countDashboardAgendaBookings(visibleItems)
}

export function shiftDashboardAgendaDateKey(dateKey: string, dayOffset: number): string {
  const date = new Date(`${dateKey}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + dayOffset)
  return date.toISOString().slice(0, 10)
}

export function shiftDashboardAgendaMonthDateKey(dateKey: string, monthOffset: number): string {
  const date = new Date(`${dateKey}T12:00:00Z`)
  date.setUTCDate(1)
  date.setUTCMonth(date.getUTCMonth() + monthOffset)
  return date.toISOString().slice(0, 10)
}

export function getTodayDashboardAgendaDateKey(referenceDate = new Date()): string {
  return formatSalonDateKey(referenceDate)
}

export function buildDashboardAgendaUrl(dateKey: string, view: AgendaViewMode): string {
  const params = new URLSearchParams()
  params.set('date', dateKey)
  if (view === 'week') params.set('view', 'week')
  return `/agenda?${params.toString()}`
}

export function mapAgendaItemToRecentBooking(
  item: DashboardAgendaItem
): DashboardRecentBooking | null {
  if (item.kind === 'free') return null

  return {
    id: item.id,
    client: item.client,
    service: item.service,
    date: item.date,
    time: item.time,
    duration: item.duration,
    price: item.price,
    status: item.status,
    email: item.email,
    phone: item.phone,
    note: '',
  }
}
