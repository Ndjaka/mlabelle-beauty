import { describe, expect, it } from 'vitest'
import {
  countDashboardReservationsByStatus,
  filterDashboardReservations,
  isDashboardReservationStatusFilter,
} from '@/features/dashboard/reservation-filters'
import type { DashboardRecentBooking } from '@/types/dashboard'

const pendingReservation: DashboardRecentBooking = {
  id: 'pending-booking',
  client: 'Eugénie Ndjaka',
  service: 'Brushing',
  date: 'Demain',
  time: '09:00',
  duration: '45 min',
  price: '35,00 €',
  status: 'À confirmer',
  email: 'eugenie@example.com',
  phone: '07 12 34 56 78',
  note: 'créée il y a 2h',
}

const confirmedReservation: DashboardRecentBooking = {
  ...pendingReservation,
  id: 'confirmed-booking',
  client: 'Camille Laurent',
  service: 'Coloration',
  status: 'Confirmé',
  email: 'camille@example.com',
}

const cancelledReservation: DashboardRecentBooking = {
  ...pendingReservation,
  id: 'cancelled-booking',
  client: 'Nadia Benali',
  service: 'Soin profond',
  status: 'Annulé',
  email: 'nadia@example.com',
}

describe('dashboard reservation filters', () => {
  const reservations = [pendingReservation, confirmedReservation, cancelledReservation]

  it('validates reservation status filters', () => {
    expect(isDashboardReservationStatusFilter('all')).toBe(true)
    expect(isDashboardReservationStatusFilter('confirmed')).toBe(true)
    expect(isDashboardReservationStatusFilter('unknown')).toBe(false)
  })

  it('filters reservations by admin status', () => {
    expect(filterDashboardReservations(reservations, { search: '', status: 'pending' })).toEqual([
      pendingReservation,
    ])
    expect(filterDashboardReservations(reservations, { search: '', status: 'cancelled' })).toEqual([
      cancelledReservation,
    ])
  })

  it('searches reservations by client, email, phone, service and accents', () => {
    expect(filterDashboardReservations(reservations, { search: 'eugenie', status: 'all' })).toEqual([
      pendingReservation,
    ])
    expect(filterDashboardReservations(reservations, { search: 'camille@', status: 'all' })).toEqual([
      confirmedReservation,
    ])
    expect(filterDashboardReservations(reservations, { search: '07 12', status: 'all' })).toHaveLength(3)
    expect(filterDashboardReservations(reservations, { search: 'soin profond', status: 'all' })).toEqual([
      cancelledReservation,
    ])
  })

  it('counts reservations by status', () => {
    expect(countDashboardReservationsByStatus(reservations)).toEqual({
      all: 3,
      pending: 1,
      confirmed: 1,
      cancelled: 1,
    })
  })
})
