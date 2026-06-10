import type { BookingWithService } from '@/types/booking'

export type DashboardBookingStatus = 'Confirmé' | 'Annulé'

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

export type DashboardRecentBooking = {
  client: string
  service: string
  date: string
  time: string
  price: string
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
  agendaItems: DashboardAgendaItem[]
  recentBookings: DashboardRecentBooking[]
}
