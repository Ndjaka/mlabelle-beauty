import { describe, expect, it } from 'vitest'
import {
  buildDashboardAgendaDays,
  buildDashboardAgendaHourRows,
  buildDashboardAgendaMonth,
  buildDashboardAgendaSummary,
  buildDashboardAgendaVisibleHours,
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
const MORNING_BOOKING_START = '2026-06-10T07:00:00.000Z'
const AFTERNOON_BOOKING_START = '2026-06-10T12:30:00.000Z'

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
        id: 'booking-id',
        time: '09:00',
        endTime: '09:45',
        service: 'Brushing',
        client: 'Camille Laurent',
        duration: '45 min',
        status: 'Confirmé',
        price: '35,00 €',
        email: 'camille@example.com',
        phone: null,
        date: 'Mercredi 10 juin 2026',
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
      { dateKey: '2026-06-08', weekdayLabel: 'Lun', dayNumber: '08', active: false },
      { dateKey: '2026-06-09', weekdayLabel: 'Mar', dayNumber: '09', active: false },
      { dateKey: '2026-06-10', weekdayLabel: 'Mer', dayNumber: '10', active: true },
      { dateKey: '2026-06-11', weekdayLabel: 'Jeu', dayNumber: '11', active: false },
      { dateKey: '2026-06-12', weekdayLabel: 'Ven', dayNumber: '12', active: false },
      { dateKey: '2026-06-13', weekdayLabel: 'Sam', dayNumber: '13', active: false },
      { dateKey: '2026-06-14', weekdayLabel: 'Dim', dayNumber: '14', active: false },
    ])
  })

  it('builds a month calendar grid around the active day', () => {
    const month = buildDashboardAgendaMonth(REFERENCE_DATE)

    expect(month.label).toBe('Juin 2026')
    expect(month.days).toHaveLength(42)
    expect(month.days[0]).toMatchObject({
      dateKey: '2026-06-01',
      dayNumber: '1',
      isCurrentMonth: true,
      active: false,
    })
    expect(month.days.find((day) => day.dateKey === '2026-06-10')).toMatchObject({
      dayNumber: '10',
      isCurrentMonth: true,
      active: true,
    })
    expect(month.days[35]).toMatchObject({
      dateKey: '2026-07-06',
      dayNumber: '6',
      isCurrentMonth: false,
      active: false,
    })
  })

  it('builds the agenda day summary from bookings', () => {
    const bookings: BookingWithService[] = [
      {
        id: 'later-booking',
        client_name: 'Nadia Benali',
        client_email: 'nadia@example.com',
        starts_at: AFTERNOON_BOOKING_START,
        ends_at: '2026-06-10T13:15:00.000Z',
        status: 'pending',
        cancel_token: 'later-token',
        service: {
          name: 'Brushing',
          duration_minutes: 45,
          price_cents: 3500,
        },
      },
      {
        id: 'first-booking',
        client_name: 'Camille Laurent',
        client_email: 'camille@example.com',
        starts_at: MORNING_BOOKING_START,
        ends_at: '2026-06-10T08:00:00.000Z',
        status: 'confirmed',
        cancel_token: 'first-token',
        service: {
          name: 'Coupe femme',
          duration_minutes: 60,
          price_cents: 4500,
        },
      },
    ]

    expect(buildDashboardAgendaSummary(bookings)).toEqual({
      bookingCount: 2,
      nextBookingLabel: 'Coupe femme · Camille Laurent',
      nextBookingTime: '09:00',
      pendingCount: 1,
      totalEstimate: '80,00 €',
    })
  })

  it('groups agenda items by visible hour rows', () => {
    const rows = buildDashboardAgendaHourRows([
      {
        kind: 'booking',
        id: 'booking-1',
        time: '09:30',
        endTime: '10:15',
        service: 'Coupe',
        client: 'Nora',
        duration: '45 min',
        status: 'Confirmé',
        price: '45,00 €',
        email: 'nora@example.com',
        phone: null,
        date: 'Aujourd\'hui',
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
        id: 'booking-2',
        time: '06:30',
        endTime: '07:15',
        service: 'Brushing',
        client: 'Nadia',
        duration: '45 min',
        status: 'Confirmé',
        price: '35,00 €',
        email: 'nadia@example.com',
        phone: null,
        date: 'Aujourd\'hui',
      },
    ])

    expect(rows.find((row) => row.hour === EARLY_BOOKING_HOUR)?.items).toHaveLength(1)
    expect(rows[0]?.hour).toBe(EARLY_BOOKING_HOUR)
  })

  it('keeps visible hours dynamic for week agenda views', () => {
    const visibleHours = buildDashboardAgendaVisibleHours([
      {
        kind: 'booking',
        id: 'late-booking',
        time: '21:30',
        endTime: '22:15',
        service: 'Brushing',
        client: 'Emma Rousseau',
        duration: '45 min',
        status: 'Confirmé',
        price: '35,00 €',
        email: 'emma@example.com',
        phone: null,
        date: 'Aujourd’hui',
      },
    ])

    expect(visibleHours).toContain('21:00')
    expect(visibleHours[0]).toBe('08:00')
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
