import { describe, expect, it } from 'vitest'
import {
  buildDashboardReservationSearchFilter,
  getBookingStatusFromReservationFilter,
  isDashboardReservationStatusFilter,
  normalizeDashboardReservationSearch,
  parseDashboardReservationFilters,
  parseDashboardReservationPage,
} from '@/features/dashboard/reservation-filters'

describe('dashboard reservation filters', () => {
  it('validates reservation status filters', () => {
    expect(isDashboardReservationStatusFilter('all')).toBe(true)
    expect(isDashboardReservationStatusFilter('confirmed')).toBe(true)
    expect(isDashboardReservationStatusFilter('unknown')).toBe(false)
  })

  it('maps admin status filters to database statuses', () => {
    expect(getBookingStatusFromReservationFilter('all')).toBeNull()
    expect(getBookingStatusFromReservationFilter('pending')).toBe('pending')
    expect(getBookingStatusFromReservationFilter('confirmed')).toBe('confirmed')
    expect(getBookingStatusFromReservationFilter('cancelled')).toBe('cancelled')
  })

  it('normalizes reservation search and page parameters', () => {
    expect(parseDashboardReservationPage('3')).toBe(3)
    expect(parseDashboardReservationPage('-1')).toBe(1)
    expect(parseDashboardReservationPage('abc')).toBe(1)
    expect(normalizeDashboardReservationSearch('  Eugénie, Brushing  ')).toBe('Eugénie Brushing')
  })

  it('parses reservation URL filters safely', () => {
    expect(parseDashboardReservationFilters({
      page: '2',
      search: 'camille',
      status: 'cancelled',
    })).toEqual({
      page: 2,
      search: 'camille',
      status: 'cancelled',
    })
    expect(parseDashboardReservationFilters({ status: 'unknown' })).toEqual({
      page: 1,
      search: '',
      status: 'all',
    })
  })

  it('builds a Supabase OR search filter for reservations', () => {
    expect(buildDashboardReservationSearchFilter('camille', [])).toBe(
      'client_name.ilike.%camille%,client_email.ilike.%camille%,client_phone.ilike.%camille%'
    )
    expect(buildDashboardReservationSearchFilter('brushing', ['service-id'])).toContain(
      'service_id.in.(service-id)'
    )
    expect(buildDashboardReservationSearchFilter(' , ', [])).toBe('')
  })
})
