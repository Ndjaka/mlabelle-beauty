import type { BookingStats, BookingWithService } from '@/types/booking'
import type {
  DashboardAgendaDay,
  DashboardAgendaHourRow,
  DashboardAgendaItem,
  DashboardAgendaMonth,
  DashboardAgendaSummary,
  DashboardAgendaWeekColumn,
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
const DASHBOARD_AGENDA_HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
]
const MOBILE_AGENDA_DAY_OFFSET_CLASSES: Record<number, string> = {
  0: 'top-0',
  15: 'top-6',
  30: 'top-12',
  45: 'top-[72px]',
}
const MOBILE_AGENDA_WEEK_OFFSET_CLASSES: Record<number, string> = {
  0: 'top-0',
  15: 'top-5',
  30: 'top-10',
  45: 'top-[60px]',
}
const MOBILE_AGENDA_DAY_DURATION_CLASSES = [
  { maxMinutes: 30, className: 'min-h-12' },
  { maxMinutes: 45, className: 'min-h-[72px]' },
  { maxMinutes: 60, className: 'min-h-24' },
  { maxMinutes: 90, className: 'min-h-36' },
  { maxMinutes: 120, className: 'min-h-48' },
  { maxMinutes: 150, className: 'min-h-[240px]' },
]
const MOBILE_AGENDA_WEEK_DURATION_CLASSES = [
  { maxMinutes: 30, className: 'min-h-10' },
  { maxMinutes: 45, className: 'min-h-[60px]' },
  { maxMinutes: 60, className: 'min-h-20' },
  { maxMinutes: 90, className: 'min-h-[120px]' },
  { maxMinutes: 120, className: 'min-h-40' },
  { maxMinutes: 150, className: 'min-h-[200px]' },
]
const MOBILE_AGENDA_WEEK_DAY_COLUMN_WIDTH = 120

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
    id: booking.id,
    time: formatDashboardTime(new Date(booking.starts_at)),
    endTime: formatDashboardTime(new Date(booking.ends_at)),
    service: booking.service.name,
    client: booking.client_name,
    duration: formatDashboardDuration(booking.service.duration_minutes),
    status: mapDashboardStatus(booking.status),
    price: formatDashboardPrice(booking.service.price_cents),
    email: booking.client_email,
    phone: booking.client_phone ?? null,
    date: formatDashboardDateLabel(new Date(booking.starts_at)),
  }))
}

export function buildDashboardAgendaDays(referenceDate: Date): DashboardAgendaDay[] {
  const parts = getSalonDateParts(referenceDate)
  const activeDayIndex = (parts.weekday + 6) % 7
  const mondayDay = parts.day - activeDayIndex

  return Array.from({ length: 7 }, (_, index) => {
    const date = zonedDateTimeToUtc(parts.year, parts.month, mondayDay + index, 12, 0, 0)

    return {
      dateKey: formatSalonDateKey(date),
      weekdayLabel: formatAgendaWeekday(date),
      dayNumber: new Intl.DateTimeFormat('fr-FR', {
        timeZone: SALON_TIME_ZONE,
        day: '2-digit',
      }).format(date),
      active: index === activeDayIndex,
    }
  })
}

export function buildDashboardAgendaMonth(referenceDate: Date): DashboardAgendaMonth {
  const parts = getSalonDateParts(referenceDate)
  const firstMonthDay = zonedDateTimeToUtc(parts.year, parts.month, 1, 12, 0, 0)
  const firstMonthDayParts = getSalonDateParts(firstMonthDay)
  const gridStartDay = 1 - ((firstMonthDayParts.weekday + 6) % 7)
  const activeDateKey = formatSalonDateKey(referenceDate)

  return {
    label: formatDashboardMonthLabel(referenceDate),
    days: Array.from({ length: 42 }, (_, index) => {
      const date = zonedDateTimeToUtc(parts.year, parts.month, gridStartDay + index, 12, 0, 0)
      const dateParts = getSalonDateParts(date)
      const dateKey = formatSalonDateKey(date)

      return {
        dateKey,
        dayNumber: String(dateParts.day),
        isCurrentMonth: dateParts.year === parts.year && dateParts.month === parts.month,
        active: dateKey === activeDateKey,
      }
    }),
  }
}

export function buildDashboardAgendaSummary(
  bookings: BookingWithService[]
): DashboardAgendaSummary {
  const sortedBookings = [...bookings].sort(
    (bookingA, bookingB) =>
      new Date(bookingA.starts_at).getTime() - new Date(bookingB.starts_at).getTime()
  )
  const nextBooking = sortedBookings.find((booking) => booking.status !== 'cancelled')
  const totalEstimateCents = sortedBookings
    .filter((booking) => booking.status !== 'cancelled')
    .reduce((total, booking) => total + booking.service.price_cents, 0)

  return {
    bookingCount: sortedBookings.filter((booking) => booking.status !== 'cancelled').length,
    nextBookingLabel: nextBooking
      ? `${nextBooking.service.name} · ${nextBooking.client_name}`
      : 'Aucun rendez-vous',
    nextBookingTime: nextBooking ? formatDashboardTime(new Date(nextBooking.starts_at)) : null,
    pendingCount: sortedBookings.filter((booking) => booking.status === 'pending').length,
    totalEstimate: formatDashboardPrice(totalEstimateCents),
  }
}

export function buildDashboardAgendaHourRows(
  items: DashboardAgendaItem[]
): DashboardAgendaHourRow[] {
  const visibleHours = buildDashboardAgendaVisibleHours(items)

  return visibleHours.map((hour) => ({
    hour,
    items: items.filter((item) => getAgendaItemHour(item) === hour),
  }))
}

export function buildDashboardAgendaVisibleHours(
  items: DashboardAgendaItem[]
): string[] {
  const visibleHours = new Set(
    DASHBOARD_AGENDA_HOURS.map((hour) => getAgendaTimeHourValue(hour)).filter(
      (hour): hour is number => hour !== null
    )
  )

  items.forEach((item) => {
    const startMinutes = getAgendaTimeTotalMinutes(item.time)
    const endMinutes = getAgendaTimeTotalMinutes(item.endTime)

    if (startMinutes === null) return

    const startHour = Math.floor(startMinutes / 60)
    const endHour =
      endMinutes !== null && endMinutes > startMinutes
        ? Math.floor((endMinutes - 1) / 60)
        : startHour

    visibleHours.add(startHour)
    visibleHours.add(endHour)
  })

  const sortedHours = Array.from(visibleHours).sort((hourA, hourB) => hourA - hourB)
  const firstHour = sortedHours[0] ?? 8
  const lastHour = sortedHours[sortedHours.length - 1] ?? 19

  return Array.from({ length: lastHour - firstHour + 1 }, (_, index) =>
    formatDashboardAgendaHour(firstHour + index)
  )
}

export function buildDashboardAgendaBookingCountsByDate(
  columns: DashboardAgendaWeekColumn[]
): Record<string, number> {
  const counts: Record<string, number> = {}

  columns.forEach((column) => {
    const bookingCount = column.items.filter((item) => item.kind === 'booking').length
    if (bookingCount > 0) counts[column.dateKey] = bookingCount
  })

  return counts
}

export function getMobileAgendaWeekSelectedScrollLeft(
  columns: DashboardAgendaWeekColumn[],
  selectedDateKey: string
): number {
  const selectedIndex = columns.findIndex((column) => column.dateKey === selectedDateKey)
  if (selectedIndex <= 1) return 0

  return (selectedIndex - 1) * MOBILE_AGENDA_WEEK_DAY_COLUMN_WIDTH
}

export function getMobileAgendaDayOffsetClass(time: string): string {
  return MOBILE_AGENDA_DAY_OFFSET_CLASSES[getAgendaQuarterMinute(time)] ?? 'top-0'
}

export function getMobileAgendaWeekOffsetClass(time: string): string {
  return MOBILE_AGENDA_WEEK_OFFSET_CLASSES[getAgendaQuarterMinute(time)] ?? 'top-0'
}

export function getMobileAgendaDayDurationClass(time: string, endTime: string): string {
  return getMobileAgendaDurationClass(
    getAgendaDurationMinutes(time, endTime),
    MOBILE_AGENDA_DAY_DURATION_CLASSES,
    'min-h-[288px]'
  )
}

export function getMobileAgendaWeekDurationClass(time: string, endTime: string): string {
  return getMobileAgendaDurationClass(
    getAgendaDurationMinutes(time, endTime),
    MOBILE_AGENDA_WEEK_DURATION_CLASSES,
    'min-h-[240px]'
  )
}

export function buildDashboardAgendaWeekColumns(
  weekBookings: BookingWithService[],
  referenceDate: Date
): DashboardAgendaWeekColumn[] {
  const parts = getSalonDateParts(referenceDate)
  const activeDayIndex = (parts.weekday + 6) % 7
  const mondayDay = parts.day - activeDayIndex

  return Array.from({ length: 7 }, (_, index) => {
    const date = zonedDateTimeToUtc(parts.year, parts.month, mondayDay + index, 12, 0, 0)
    const dateKey = formatSalonDateKey(date)
    const dayLabel = formatAgendaWeekday(date)
    const dayStart = zonedDateTimeToUtc(parts.year, parts.month, mondayDay + index, 0, 0, 0)
    const dayEnd = zonedDateTimeToUtc(parts.year, parts.month, mondayDay + index + 1, 0, 0, 0)

    const dayBookings = weekBookings.filter((booking) => {
      const startsAt = new Date(booking.starts_at).getTime()
      return startsAt >= dayStart.getTime() && startsAt < dayEnd.getTime()
    })

    return {
      dateKey,
      dayLabel,
      items: mapBookingsToAgendaItems(dayBookings),
    }
  })
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
    duration: formatDashboardDuration(booking.service.duration_minutes),
    price: formatDashboardPrice(booking.service.price_cents),
    status: mapDashboardStatus(booking.status),
    email: booking.client_email,
    phone: booking.client_phone ?? null,
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

function formatDashboardMonthLabel(date: Date): string {
  const label = new Intl.DateTimeFormat('fr-FR', {
    timeZone: SALON_TIME_ZONE,
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

export function formatDashboardDuration(durationMinutes: number): string {
  if (durationMinutes < 60) return `${durationMinutes} min`

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return minutes === 0 ? `${hours}h` : `${hours}h${minutes}`
}

export function mapDashboardStatus(status: BookingWithService['status']): DashboardBookingStatus {
  if (status === 'pending') return 'À confirmer'
  return status === 'cancelled' ? 'Annulé' : 'Confirmé'
}

function formatAgendaWeekday(date: Date): string {
  const label = new Intl.DateTimeFormat('fr-FR', {
    timeZone: SALON_TIME_ZONE,
    weekday: 'short',
  })
    .format(date)
    .replace('.', '')

  return label.charAt(0).toUpperCase() + label.slice(1)
}

function getAgendaItemHour(item: DashboardAgendaItem): string | null {
  const hour = getAgendaTimeHourValue(item.time)
  if (hour === null) return null

  return formatDashboardAgendaHour(hour)
}

function getAgendaTimeHourValue(time: string): number | null {
  const minutes = getAgendaTimeTotalMinutes(time)
  if (minutes === null) return null

  return Math.floor(minutes / 60)
}

function getAgendaTimeTotalMinutes(time: string): number | null {
  const [hourPart, minutePart] = time.split(':')
  const hour = Number(hourPart)
  const minute = Number(minutePart)

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null

  return hour * 60 + minute
}

function formatDashboardAgendaHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

function getAgendaQuarterMinute(time: string): number {
  const minutes = getAgendaTimeTotalMinutes(time)
  if (minutes === null) return 0

  return Math.min(45, Math.floor((minutes % 60) / 15) * 15)
}

function getAgendaDurationMinutes(time: string, endTime: string): number {
  const startMinutes = getAgendaTimeTotalMinutes(time)
  const endMinutes = getAgendaTimeTotalMinutes(endTime)

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return 30
  }

  return endMinutes - startMinutes
}

function getMobileAgendaDurationClass(
  durationMinutes: number,
  durationClasses: { maxMinutes: number; className: string }[],
  fallbackClassName: string
): string {
  return (
    durationClasses.find((durationClass) => durationMinutes <= durationClass.maxMinutes)
      ?.className ?? fallbackClassName
  )
}

export function formatSalonDateKey(date: Date): string {
  const parts = getSalonDateParts(date)
  return [
    parts.year,
    String(parts.month).padStart(2, '0'),
    String(parts.day).padStart(2, '0'),
  ].join('-')
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
