import { describe, expect, it } from 'vitest'
import {
  buildDashboardAgendaUrl,
  countDashboardAgendaBookings,
  countDashboardAgendaViewBookings,
  getTodayDashboardAgendaDateKey,
  mapAgendaItemToRecentBooking,
  shiftDashboardAgendaDateKey,
  shiftDashboardAgendaMonthDateKey,
} from '@/features/dashboard/agenda-navigation'
import type { DashboardAgendaItem } from '@/types/dashboard'

const SELECTED_DATE_KEY = '2026-06-11'
const PARIS_REFERENCE_DATE = new Date('2026-06-10T22:30:00.000Z')

describe('dashboard agenda navigation', () => {
  const bookingItem: DashboardAgendaItem = {
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
    date: 'Aujourd’hui',
  }

  it('builds day and week agenda URLs', () => {
    expect(buildDashboardAgendaUrl(SELECTED_DATE_KEY, 'day')).toBe(
      '/agenda?date=2026-06-11'
    )
    expect(buildDashboardAgendaUrl(SELECTED_DATE_KEY, 'week')).toBe(
      '/agenda?date=2026-06-11&view=week'
    )
  })

  it('shifts the selected agenda date by day offsets', () => {
    expect(shiftDashboardAgendaDateKey(SELECTED_DATE_KEY, 1)).toBe('2026-06-12')
    expect(shiftDashboardAgendaDateKey(SELECTED_DATE_KEY, -7)).toBe('2026-06-04')
  })

  it('shifts the displayed calendar month without keeping an unsafe day number', () => {
    expect(shiftDashboardAgendaMonthDateKey('2026-06-11', 1)).toBe('2026-07-01')
    expect(shiftDashboardAgendaMonthDateKey('2026-06-11', -1)).toBe('2026-05-01')
    expect(shiftDashboardAgendaMonthDateKey('2026-01-31', 1)).toBe('2026-02-01')
  })

  it('uses the salon timezone for today date keys', () => {
    expect(getTodayDashboardAgendaDateKey(PARIS_REFERENCE_DATE)).toBe('2026-06-11')
  })

  it('counts only bookings in agenda items', () => {
    const items: DashboardAgendaItem[] = [
      bookingItem,
      {
        kind: 'free',
        time: '10:00',
        endTime: '11:00',
        label: 'Disponible',
      },
    ]

    expect(countDashboardAgendaBookings(items)).toBe(1)
  })

  it('counts bookings across all columns in week view', () => {
    const weekColumns = [
      {
        dateKey: '2026-06-08',
        dayLabel: 'Lun',
        items: [bookingItem],
      },
      {
        dateKey: '2026-06-09',
        dayLabel: 'Mar',
        items: [{ ...bookingItem, id: 'second-booking-id' }],
      },
    ]

    expect(countDashboardAgendaViewBookings('day', [bookingItem], weekColumns)).toBe(1)
    expect(countDashboardAgendaViewBookings('week', [bookingItem], weekColumns)).toBe(2)
  })

  it('maps agenda bookings to detail panel bookings', () => {
    expect(mapAgendaItemToRecentBooking(bookingItem)).toEqual({
      id: 'booking-id',
      client: 'Camille Laurent',
      service: 'Brushing',
      date: 'Aujourd’hui',
      time: '09:00',
      duration: '45 min',
      price: '35,00 €',
      status: 'Confirmé',
      email: 'camille@example.com',
      phone: null,
      note: '',
    })
  })
})
