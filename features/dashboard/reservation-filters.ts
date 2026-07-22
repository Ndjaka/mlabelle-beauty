import type { BookingStatus } from '@/types/booking'

export type DashboardReservationStatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled'

export type DashboardReservationSearchParams = {
  page: number
  search: string
  status: DashboardReservationStatusFilter
}

const bookingStatusByFilter: Record<Exclude<DashboardReservationStatusFilter, 'all'>, BookingStatus> =
  {
    pending: 'pending',
    confirmed: 'confirmed',
    cancelled: 'cancelled',
  }

export function isDashboardReservationStatusFilter(
  value: string
): value is DashboardReservationStatusFilter {
  return value === 'all' || value === 'pending' || value === 'confirmed' || value === 'cancelled'
}

export function parseDashboardReservationPage(value: string | undefined): number {
  const parsedPage = value ? Number.parseInt(value, 10) : 1

  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

export function normalizeDashboardReservationSearch(value: string | undefined): string {
  return (value ?? '')
    .replace(/[%*,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getBookingStatusFromReservationFilter(
  status: DashboardReservationStatusFilter
): BookingStatus | null {
  return status === 'all' ? null : bookingStatusByFilter[status]
}

export function hasMoreDashboardReservations(loadedCount: number, total: number): boolean {
  return loadedCount < total
}

export function getNextDashboardReservationPage(currentPage: number): number {
  return currentPage + 1
}

export function buildDashboardReservationSearchFilter(
  search: string,
  serviceIds: string[]
): string {
  const normalizedSearch = normalizeDashboardReservationSearch(search)
  if (!normalizedSearch) return ''

  const filters = [
    `client_name.ilike.%${normalizedSearch}%`,
    `client_email.ilike.%${normalizedSearch}%`,
    `client_phone.ilike.%${normalizedSearch}%`,
  ]

  if (serviceIds.length > 0) {
    filters.push(`service_id.in.(${serviceIds.join(',')})`)
  }

  return filters.join(',')
}

export function parseDashboardReservationFilters(params: {
  page?: string
  search?: string
  status?: string
}): DashboardReservationSearchParams {
  const status = params.status && isDashboardReservationStatusFilter(params.status)
    ? params.status
    : 'all'

  return {
    page: parseDashboardReservationPage(params.page),
    search: normalizeDashboardReservationSearch(params.search),
    status,
  }
}
