import { describe, expect, it } from 'vitest'
import {
  buildSalonDateTimeFromSlot,
  formatSalonDateKey,
  formatSalonDateLong,
  formatSalonDateShort,
  formatSalonTime,
  getSalonDayRange,
  parseSalonDateKey,
} from '@/features/booking/salon-time'

describe('salon time helpers', () => {
  it('builds a summer appointment in Europe/Paris time', () => {
    const date = buildSalonDateTimeFromSlot('2026-07-14', '09:00')

    expect(date?.toISOString()).toBe('2026-07-14T07:00:00.000Z')
    expect(date ? formatSalonDateKey(date) : null).toBe('2026-07-14')
    expect(date ? formatSalonDateLong(date) : null).toBe('Mardi 14 juillet 2026')
    expect(date ? formatSalonDateShort(date) : null).toBe('mar. 14 juil.')
    expect(date ? formatSalonTime(date) : null).toBe('09:00')
  })

  it('formats a stored UTC booking with the salon local time', () => {
    const date = new Date('2026-07-21T13:45:00.000Z')

    expect(formatSalonDateLong(date)).toBe('Mardi 21 juillet 2026')
    expect(formatSalonDateShort(date)).toBe('mar. 21 juil.')
    expect(formatSalonTime(date)).toBe('15:45')
  })

  it('builds a winter appointment in Europe/Paris time', () => {
    const date = buildSalonDateTimeFromSlot('2026-01-14', '09:00')

    expect(date?.toISOString()).toBe('2026-01-14T08:00:00.000Z')
    expect(date ? formatSalonTime(date) : null).toBe('09:00')
  })

  it('returns the UTC range for a full salon day', () => {
    const date = parseSalonDateKey('2026-07-14')
    const range = date ? getSalonDayRange(date) : null

    expect(range?.start.toISOString()).toBe('2026-07-13T22:00:00.000Z')
    expect(range?.end.toISOString()).toBe('2026-07-14T22:00:00.000Z')
  })

  it('rejects invalid dates and slots', () => {
    expect(parseSalonDateKey('2026-02-31')).toBeNull()
    expect(buildSalonDateTimeFromSlot('2026-07-14', '25:00')).toBeNull()
  })
})
