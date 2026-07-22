import { describe, expect, it } from 'vitest'
import {
  buildAdminBookingStartsAt,
  validateAdminBookingInput,
} from '@/features/booking/admin-booking'
import { formatSalonDateKey, formatSalonTime } from '@/features/booking/salon-time'
import type { CreateBookingInput } from '@/types/booking'

const FUTURE_DATE = new Date('2026-07-20T09:00:00')
const NOW = new Date('2026-07-19T12:00:00')

function buildInput(overrides: Partial<CreateBookingInput> = {}): CreateBookingInput {
  return {
    service_id: 'service-id',
    client_name: 'Eugénie Ndjaka',
    client_email: 'eugenie@example.com',
    client_phone: '07 12 34 56 78',
    starts_at: FUTURE_DATE,
    ...overrides,
  }
}

describe('admin booking helpers', () => {
  it('builds the selected appointment date from a date key and slot', () => {
    const startsAt = buildAdminBookingStartsAt('2026-07-20', '14:15')

    expect(startsAt ? formatSalonDateKey(startsAt) : null).toBe('2026-07-20')
    expect(startsAt ? formatSalonTime(startsAt) : null).toBe('14:15')
  })

  it('rejects invalid date keys or slots', () => {
    expect(buildAdminBookingStartsAt('2026/07/20', '14:15')).toBeNull()
    expect(buildAdminBookingStartsAt('2026-02-31', '14:15')).toBeNull()
    expect(buildAdminBookingStartsAt('2026-07-20', '25:00')).toBeNull()
  })

  it('validates required admin booking fields', () => {
    expect(validateAdminBookingInput(buildInput(), NOW)).toEqual({ success: true })
    expect(validateAdminBookingInput(buildInput({ client_name: '' }), NOW)).toEqual({
      success: false,
      error: 'Le nom du client est requis.',
    })
    expect(validateAdminBookingInput(buildInput({ client_email: 'bad-email' }), NOW)).toEqual({
      success: false,
      error: 'Adresse email invalide.',
    })
    expect(validateAdminBookingInput(buildInput({ client_phone: '   ' }), NOW)).toEqual({
      success: false,
      error: 'Le numéro de téléphone est requis.',
    })
    expect(validateAdminBookingInput(buildInput({ starts_at: NOW }), NOW)).toEqual({
      success: false,
      error: 'Le créneau doit être dans le futur.',
    })
  })
})
