import type { DashboardBookingStatus, DashboardRecentBooking } from '@/types/dashboard'

export type DashboardReservationStatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled'

type DashboardReservationFilters = {
  search: string
  status: DashboardReservationStatusFilter
}

const statusByFilter: Record<
  Exclude<DashboardReservationStatusFilter, 'all'>,
  DashboardBookingStatus
> = {
  pending: 'À confirmer',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
}

export function isDashboardReservationStatusFilter(
  value: string
): value is DashboardReservationStatusFilter {
  return value === 'all' || value === 'pending' || value === 'confirmed' || value === 'cancelled'
}

export function filterDashboardReservations(
  reservations: DashboardRecentBooking[],
  filters: DashboardReservationFilters
): DashboardRecentBooking[] {
  const normalizedSearch = normalizeSearch(filters.search)
  const expectedStatus = filters.status === 'all' ? null : statusByFilter[filters.status]

  return reservations.filter((reservation) => {
    const matchesStatus = expectedStatus === null || reservation.status === expectedStatus
    const matchesSearch =
      normalizedSearch.length === 0 ||
      normalizeSearch(
        [
          reservation.client,
          reservation.email,
          reservation.phone ?? '',
          reservation.service,
          reservation.date,
          reservation.time,
        ].join(' ')
      ).includes(normalizedSearch)

    return matchesStatus && matchesSearch
  })
}

export function countDashboardReservationsByStatus(
  reservations: DashboardRecentBooking[]
): Record<DashboardReservationStatusFilter, number> {
  return reservations.reduce(
    (counts, reservation) => {
      counts.all += 1

      if (reservation.status === 'À confirmer') counts.pending += 1
      if (reservation.status === 'Confirmé') counts.confirmed += 1
      if (reservation.status === 'Annulé') counts.cancelled += 1

      return counts
    },
    {
      all: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    }
  )
}

function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
