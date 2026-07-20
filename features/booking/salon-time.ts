export const SALON_TIME_ZONE = 'Europe/Paris'

const DATE_KEY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/
const SLOT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/

type SalonDateParts = {
  year: number
  month: number
  day: number
  weekday: number
}

export function buildSalonDateTimeFromSlot(dateKey: string, slot: string): Date | null {
  const dateParts = parseDateKeyParts(dateKey)
  const slotParts = parseSlotParts(slot)
  if (!dateParts || !slotParts) return null

  return zonedDateTimeToUtc(
    dateParts.year,
    dateParts.month,
    dateParts.day,
    slotParts.hour,
    slotParts.minute,
    0
  )
}

export function parseSalonDateKey(dateKey: string): Date | null {
  const dateParts = parseDateKeyParts(dateKey)
  if (!dateParts) return null

  return zonedDateTimeToUtc(dateParts.year, dateParts.month, dateParts.day, 12, 0, 0)
}

export function formatSalonDateKey(date: Date): string {
  const parts = getSalonDateParts(date)
  return [
    parts.year,
    String(parts.month).padStart(2, '0'),
    String(parts.day).padStart(2, '0'),
  ].join('-')
}

export function formatSalonTime(date: Date): string {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: SALON_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return `${values.hour}:${values.minute}`
}

export function getSalonDayOfWeek(date: Date): number {
  return getSalonDateParts(date).weekday
}

export function getSalonDayRange(date: Date): { start: Date; end: Date } {
  const parts = getSalonDateParts(date)
  const nextParts = addDaysToParts(parts.year, parts.month, parts.day, 1)

  return {
    start: zonedDateTimeToUtc(parts.year, parts.month, parts.day, 0, 0, 0),
    end: zonedDateTimeToUtc(nextParts.year, nextParts.month, nextParts.day, 0, 0, 0),
  }
}

function parseDateKeyParts(dateKey: string): Omit<SalonDateParts, 'weekday'> | null {
  const match = DATE_KEY_REGEX.exec(dateKey)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return { year, month, day }
}

function parseSlotParts(slot: string): { hour: number; minute: number } | null {
  const match = SLOT_REGEX.exec(slot)
  if (!match) return null

  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  }
}

function addDaysToParts(
  year: number,
  month: number,
  day: number,
  dayCount: number
): Omit<SalonDateParts, 'weekday'> {
  const date = new Date(Date.UTC(year, month - 1, day + dayCount, 12, 0, 0))

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

function getSalonDateParts(date: Date): SalonDateParts {
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
