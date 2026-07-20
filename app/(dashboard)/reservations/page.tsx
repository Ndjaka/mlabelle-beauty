import { ReservationsPage } from '@/components/ui/dashboard/reservations-page'
import { getActiveServices } from '@/features/booking/queries'
import { parseDashboardReservationFilters } from '@/features/dashboard/reservation-filters'
import { getDashboardReservations } from '@/features/dashboard/queries'
import { formatSalonDateKey } from '@/features/dashboard/utils'

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
  const [paginatedResult, services] = await Promise.all([
    getDashboardReservations(filters),
    getActiveServices(),
  ])

  return (
    <ReservationsPage
      reservations={paginatedResult.data}
      total={paginatedResult.total}
      currentPage={filters.page}
      currentSearch={filters.search}
      currentStatus={filters.status}
      services={services}
      initialDateKey={formatSalonDateKey(new Date())}
    />
  )
}
