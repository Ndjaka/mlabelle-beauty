import { describe, expect, it } from 'vitest'
import {
  buildDashboardAgendaDays,
  buildDashboardAgendaHourRows,
  buildDashboardMetrics,
  formatDashboardDateLabel,
  formatDashboardPrice,
  getCurrentWeekSalonStart,
  getTodaySalonRange,
  mapBookingsToAgendaItems,
  mapBookingsToRecentBookings,
} from '@/features/dashboard/utils'
import type { BookingStats, BookingWithService } from '@/types/booking'
import type { DashboardBookingWithCreatedAt } from '@/types/dashboard'

const REFERENCE_DATE = new Date('2026-06-10T10:00:00.000Z')
const EARLY_BOOKING_HOUR = '06:00'
const MIDDAY_EMPTY_HOUR = '12:00'
const MORNING_BOOKING_HOUR = '09:00'
const AFTERNOON_FREE_HOUR = '14:00'

describe('dashboard utils', () => {
  it('builds dashboard metrics from booking stats', () => {
    const stats: BookingStats = {
      monthly_revenue_cents: 124000,
      monthly_bookings_count: 20,
      recent_bookings_count: 3,
      weekly_fill_rate: 72,
    }

    const metrics = buildDashboardMetrics(stats, 5)

    expect(metrics).toEqual([
      {
        label: 'Aujourd’hui',
        value: '5',
        detail: 'rendez-vous prévus',
        tone: 'neutral',
      },
      {
        label: 'Nouvelles',
        value: '3',
        detail: 'réservations cette semaine',
        tone: 'gold',
      },
      {
        label: 'Mois en cours',
        value: '1 240,00 €'.replace(/\u202F/g, ' '),
        detail: 'chiffre estimé',
        tone: 'dark',
      },
      {
        label: 'Remplissage',
        value: '72%',
        detail: 'sur les créneaux ouverts',
        tone: 'neutral',
      },
    ])
  })

  it('maps bookings to agenda items', () => {
    const booking: BookingWithService = {
      id: 'booking-id',
      client_name: 'Camille Laurent',
      client_email: 'camille@example.com',
      starts_at: '2026-06-10T07:00:00.000Z',
      ends_at: '2026-06-10T07:45:00.000Z',
      status: 'confirmed',
      cancel_token: 'cancel-token',
      service: {
        name: 'Brushing',
        duration_minutes: 45,
        price_cents: 3500,
      },
    }

    expect(mapBookingsToAgendaItems([booking])).toEqual([
      {
        kind: 'booking',
        time: '09:00',
        endTime: '09:45',
        service: 'Brushing',
        client: 'Camille Laurent',
        duration: '45 min',
        status: 'Confirmé',
        price: '35,00 €',
      },
    ])
  })

  it('maps pending bookings as bookings to confirm', () => {
    const booking: BookingWithService = {
      id: 'booking-id',
      client_name: 'Camille Laurent',
      client_email: 'camille@example.com',
      starts_at: '2026-06-10T07:00:00.000Z',
      ends_at: '2026-06-10T07:45:00.000Z',
      status: 'pending',
      cancel_token: 'cancel-token',
      service: {
        name: 'Brushing',
        duration_minutes: 45,
        price_cents: 3500,
      },
    }

    expect(mapBookingsToAgendaItems([booking])[0]).toMatchObject({
      status: 'À confirmer',
    })
  })

  it('builds the visible agenda week around the reference day', () => {
    expect(buildDashboardAgendaDays(REFERENCE_DATE)).toEqual([
      { weekdayLabel: 'Lun', dayNumber: '08', active: false },
      { weekdayLabel: 'Mar', dayNumber: '09', active: false },
      { weekdayLabel: 'Mer', dayNumber: '10', active: true },
      { weekdayLabel: 'Jeu', dayNumber: '11', active: false },
      { weekdayLabel: 'Ven', dayNumber: '12', active: false },
      { weekdayLabel: 'Sam', dayNumber: '13', active: false },
      { weekdayLabel: 'Dim', dayNumber: '14', active: false },
    ])
  })

  it('groups agenda items by visible hour rows', () => {
    const rows = buildDashboardAgendaHourRows([
      {
        kind: 'booking',
        time: '09:30',
        endTime: '10:15',
        service: 'Coupe',
        client: 'Nora',
        duration: '45 min',
        status: 'Confirmé',
        price: '45,00 €',
      },
      {
        kind: 'free',
        time: '14:00',
        endTime: '15:00',
        label: 'Disponible',
      },
    ])

    expect(rows.find((row) => row.hour === MORNING_BOOKING_HOUR)?.items).toHaveLength(1)
    expect(rows.find((row) => row.hour === AFTERNOON_FREE_HOUR)?.items).toHaveLength(1)
    expect(rows.find((row) => row.hour === MIDDAY_EMPTY_HOUR)?.items).toHaveLength(0)
  })

  it('keeps agenda bookings visible when they start before default opening hours', () => {
    const rows = buildDashboardAgendaHourRows([
      {
        kind: 'booking',
        time: '06:30',
        endTime: '07:15',
        service: 'Brushing',
        client: 'Nadia',
        duration: '45 min',
        status: 'Confirmé',
        price: '35,00 €',
      },
    ])

    expect(rows.find((row) => row.hour === EARLY_BOOKING_HOUR)?.items).toHaveLength(1)
    expect(rows[0]?.hour).toBe(EARLY_BOOKING_HOUR)
  })

  it('maps recent bookings with relative labels', () => {
    const booking: DashboardBookingWithCreatedAt = {
      id: 'booking-id',
      client_name: 'Nadia Benali',
      client_email: 'nadia@example.com',
      starts_at: '2026-06-11T11:00:00.000Z',
      ends_at: '2026-06-11T12:00:00.000Z',
      status: 'confirmed',
      cancel_token: 'cancel-token',
      created_at: '2026-06-10T08:00:00.000Z',
      service: {
        name: 'Soin profond',
        duration_minutes: 60,
        price_cents: 4500,
      },
    }

    expect(mapBookingsToRecentBookings([booking], REFERENCE_DATE)).toEqual([
      {
        id: 'booking-id',
        client: 'Nadia Benali',
        service: 'Soin profond',
        date: 'Demain',
        time: '13:00',
        duration: '1h',
        price: '45,00 €',
        status: 'Confirmé',
        email: 'nadia@example.com',
        phone: null,
        note: 'créée il y a 2h',
      },
    ])
  })

  it('formats the dashboard date label in French', () => {
    expect(formatDashboardDateLabel(REFERENCE_DATE)).toBe('Mercredi 10 juin 2026')
  })

  it('computes the current salon day range in UTC', () => {
    const range = getTodaySalonRange(REFERENCE_DATE)

    expect(range.start.toISOString()).toBe('2026-06-09T22:00:00.000Z')
    expect(range.end.toISOString()).toBe('2026-06-10T22:00:00.000Z')
  })

  it('computes the current week start in salon timezone', () => {
    expect(getCurrentWeekSalonStart(REFERENCE_DATE).toISOString()).toBe(
      '2026-06-07T22:00:00.000Z'
    )
  })

  it('formats dashboard prices with euro cents', () => {
    expect(formatDashboardPrice(5500)).toBe('55,00 €')
  })
})
