import { ReservationsPage } from '@/components/ui/dashboard/reservations-page'
import { parseDashboardReservationFilters } from '@/features/dashboard/reservation-filters'
import { getDashboardReservations } from '@/features/dashboard/queries'

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const filters = parseDashboardReservationFilters({
    page: typeof params.page === 'string' ? params.page : undefined,
    search: typeof params.search === 'string' ? params.search : undefined,
    status: typeof params.status === 'string' ? params.status : undefined,
  })
  const paginatedResult = await getDashboardReservations(filters)

  return (
    <ReservationsPage
      reservations={paginatedResult.data}
      total={paginatedResult.total}
      currentPage={filters.page}
      currentSearch={filters.search}
      currentStatus={filters.status}
    />
  )
}
