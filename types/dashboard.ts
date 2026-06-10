import type { BookingWithService } from '@/types/booking'

export type DashboardBookingStatus = 'À confirmer' | 'Confirmé' | 'Annulé'

export type DashboardNavItem = {
  label: string
  href: string
  icon: string
  active?: boolean
}

export type DashboardMetric = {
  label: string
  value: string
  detail: string
  tone: 'neutral' | 'gold' | 'dark'
}

export type DashboardAgendaItem =
  | {
      kind: 'booking'
      id: string
      time: string
      endTime: string
      service: string
      client: string
      duration: string
      status: DashboardBookingStatus
      price: string
      email: string
      phone: string | null
      date: string
    }
  | {
      kind: 'free'
      time: string
      endTime: string
      label: string
    }

export type DashboardAgendaDay = {
  dateKey: string
  weekdayLabel: string
  dayNumber: string
  active: boolean
}

export type DashboardAgendaMonthDay = {
  dateKey: string
  dayNumber: string
  isCurrentMonth: boolean
  active: boolean
}

export type DashboardAgendaMonth = {
  label: string
  days: DashboardAgendaMonthDay[]
}

export type DashboardAgendaHourRow = {
  hour: string
  items: DashboardAgendaItem[]
}

export type DashboardAgendaSummary = {
  bookingCount: number
  nextBookingLabel: string
  nextBookingTime: string | null
  pendingCount: number
  totalEstimate: string
}

export type DashboardRecentBooking = {
  id: string
  client: string
  service: string
  date: string
  time: string
  duration: string
  price: string
  status: DashboardBookingStatus
  email: string
  phone: string | null
  note: string
}

export type DashboardQuickAction = {
  label: string
  description: string
  href: string
  icon: string
}

export type DashboardBookingWithCreatedAt = BookingWithService & {
  created_at: string
}

export type DashboardAgendaWeekColumn = {
  dateKey: string
  dayLabel: string
  items: DashboardAgendaItem[]
}

export type AgendaViewMode = 'day' | 'week'

export type DashboardData = {
  dateLabel: string
  selectedDateKey: string
  view: AgendaViewMode
  agendaMonth: DashboardAgendaMonth
  agendaSummary: DashboardAgendaSummary
  metrics: DashboardMetric[]
  agendaDays: DashboardAgendaDay[]
  agendaItems: DashboardAgendaItem[]
  agendaWeekColumns: DashboardAgendaWeekColumn[]
  recentBookings: DashboardRecentBooking[]
}
