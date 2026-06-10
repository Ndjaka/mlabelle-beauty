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
      time: string
      endTime: string
      service: string
      client: string
      duration: string
      status: DashboardBookingStatus
      price: string
    }
  | {
      kind: 'free'
      time: string
      endTime: string
      label: string
    }

export type DashboardAgendaDay = {
  weekdayLabel: string
  dayNumber: string
  active: boolean
}

export type DashboardAgendaHourRow = {
  hour: string
  items: DashboardAgendaItem[]
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

export type DashboardData = {
  dateLabel: string
  metrics: DashboardMetric[]
  agendaDays: DashboardAgendaDay[]
  agendaItems: DashboardAgendaItem[]
  recentBookings: DashboardRecentBooking[]
}
