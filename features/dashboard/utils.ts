import type { BookingStats, BookingWithService } from '@/types/booking'
import type {
  DashboardAgendaItem,
  DashboardBookingStatus,
  DashboardBookingWithCreatedAt,
  DashboardMetric,
  DashboardRecentBooking,
} from '@/types/dashboard'

const SALON_TIME_ZONE = 'Europe/Paris'
const CURRENCY_FORMATTER = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

export function buildDashboardMetrics(
  stats: BookingStats,
  todayBookingsCount: number
): DashboardMetric[] {
  return [
    {
      label: 'Aujourd’hui',
      value: String(todayBookingsCount),
      detail: 'rendez-vous prévus',
      tone: 'neutral',
    },
    {
      label: 'Nouvelles',
      value: String(stats.recent_bookings_count),
      detail: 'réservations cette semaine',
      tone: 'gold',
    },
    {
      label: 'Mois en cours',
      value: formatDashboardPrice(stats.monthly_revenue_cents),
      detail: 'chiffre estimé',
      tone: 'dark',
    },
    {
      label: 'Remplissage',
      value: `${stats.weekly_fill_rate}%`,
      detail: 'sur les créneaux ouverts',
      tone: 'neutral',
    },
  ]
}

export function mapBookingsToAgendaItems(
  bookings: BookingWithService[]
): DashboardAgendaItem[] {
  return bookings.map((booking) => ({
    kind: 'booking',
    time: formatDashboardTime(new Date(booking.starts_at)),
    endTime: formatDashboardTime(new Date(booking.ends_at)),
    service: booking.service.name,
    client: booking.client_name,
    duration: formatDashboardDuration(booking.service.duration_minutes),
    status: mapDashboardStatus(booking.status),
    price: formatDashboardPrice(booking.service.price_cents),
  }))
}

export function mapBookingsToRecentBookings(
  bookings: DashboardBookingWithCreatedAt[],
  referenceDate: Date
): DashboardRecentBooking[] {
  return bookings.map((booking) => ({
    id: booking.id,
    client: booking.client_name,
    service: booking.service.name,
    date: formatRelativeBookingDate(new Date(booking.starts_at), referenceDate),
    time: formatDashboardTime(new Date(booking.starts_at)),
    price: formatDashboardPrice(booking.service.price_cents),
    note: formatCreatedAtNote(new Date(booking.created_at), referenceDate),
  }))
}

export function getTodaySalonRange(referenceDate: Date): {
  start: Date
  end: Date
} {
  const parts = getSalonDateParts(referenceDate)
  const start = zonedDateTimeToUtc(parts.year, parts.month, parts.day, 0, 0, 0)
  const end = zonedDateTimeToUtc(parts.year, parts.month, parts.day + 1, 0, 0, 0)

  return { start, end }
}

export function getCurrentWeekSalonStart(referenceDate: Date): Date {
  const parts = getSalonDateParts(referenceDate)
  const mondayDay = parts.day - ((parts.weekday + 6) % 7)

  return zonedDateTimeToUtc(parts.year, parts.month, mondayDay, 0, 0, 0)
}

export function formatDashboardDateLabel(date: Date): string {
  const label = new Intl.DateTimeFormat('fr-FR', {
    timeZone: SALON_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatDashboardPrice(priceCents: number): string {
  return CURRENCY_FORMATTER.format(priceCents / 100).replace(/[\u00A0\u202F]/g, ' ')
}

function formatDashboardTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: SALON_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date)
}

function formatDashboardDuration(durationMinutes: number): string {
  if (durationMinutes < 60) return `${durationMinutes} min`

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return minutes === 0 ? `${hours}h` : `${hours}h${minutes}`
}

function mapDashboardStatus(status: BookingWithService['status']): DashboardBookingStatus {
  return status === 'cancelled' ? 'Annulé' : 'Confirmé'
}

function formatRelativeBookingDate(date: Date, referenceDate: Date): string {
  const bookingDay = startOfSalonDay(date).getTime()
  const referenceDay = startOfSalonDay(referenceDate).getTime()
  const dayDiff = Math.round((bookingDay - referenceDay) / 86_400_000)

  if (dayDiff === 0) return 'Aujourd’hui'
  if (dayDiff === 1) return 'Demain'
  if (dayDiff === -1) return 'Hier'

  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: SALON_TIME_ZONE,
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function formatCreatedAtNote(createdAt: Date, referenceDate: Date): string {
  const diffMinutes = Math.max(
    0,
    Math.round((referenceDate.getTime() - createdAt.getTime()) / 60_000)
  )

  if (diffMinutes < 60) return 'créée il y a moins d’1h'

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `créée il y a ${diffHours}h`

  const diffDays = Math.round(diffHours / 24)
  return diffDays === 1 ? 'créée hier' : `créée il y a ${diffDays}j`
}

function startOfSalonDay(date: Date): Date {
  const parts = getSalonDateParts(date)
  return zonedDateTimeToUtc(parts.year, parts.month, parts.day, 0, 0, 0)
}

function getSalonDateParts(date: Date): {
  year: number
  month: number
  day: number
  weekday: number
} {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SALON_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
    values.weekday ?? ''
  )

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    weekday,
  }
}

function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number
): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  const offset = getTimeZoneOffsetMs(utcGuess)
  const firstPass = new Date(utcGuess.getTime() - offset)
  const correctedOffset = getTimeZoneOffsetMs(firstPass)

  return new Date(utcGuess.getTime() - correctedOffset)
}

function getTimeZoneOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SALON_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const zonedTimeAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  )

  return zonedTimeAsUtc - date.getTime()
}
