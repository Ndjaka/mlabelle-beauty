'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { BookingDetailPanel } from '@/components/ui/dashboard/booking-detail-panel'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import { ReservationFilters } from '@/components/ui/dashboard/reservations/reservation-filters'
import { ReservationList } from '@/components/ui/dashboard/reservations/reservation-list'
import { ReservationMobileInfiniteList } from '@/components/ui/dashboard/reservations/reservation-mobile-infinite-list'
import { ReservationPagination } from '@/components/ui/dashboard/reservations/reservation-pagination'
import { ReservationsPageHeader } from '@/components/ui/dashboard/reservations/reservations-page-header'
import type { DashboardReservationStatusFilter } from '@/features/dashboard/reservation-filters'
import { formatDashboardDateLabel } from '@/features/dashboard/utils'
import type { DashboardRecentBooking } from '@/types/dashboard'
import type { Service } from '@/types/service'

type ReservationsPageProps = {
  reservations: DashboardRecentBooking[]
  total: number
  currentPage: number
  currentSearch: string
  currentStatus: DashboardReservationStatusFilter
  services: Service[]
  initialDateKey: string
}

const ITEMS_PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 350

export function ReservationsPage({
  reservations,
  total,
  currentPage,
  currentSearch,
  currentStatus,
  services,
  initialDateKey,
}: ReservationsPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [selectedReservation, setSelectedReservation] = useState<DashboardRecentBooking | null>(null)
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  const updateFilters = useCallback(
    (updates: { page?: number; search?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString())
      updateOptionalParam(params, 'search', updates.search)
      updateOptionalParam(params, 'status', updates.status === 'all' ? '' : updates.status)

      if (updates.page !== undefined) {
        if (updates.page > 1) params.set('page', updates.page.toString())
        else params.delete('page')
      }

      startTransition(() => {
        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname)
      })
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    if (searchValue === currentSearch) return

    const timeout = window.setTimeout(() => {
      updateFilters({ search: searchValue, page: 1 })
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [currentSearch, searchValue, updateFilters])

  return (
    <DashboardShell
      dateLabel={formatDashboardDateLabel(new Date())}
      navItems={getDashboardNavItems('bookings')}
      mobileNavItems={getDashboardMobileNavItems('bookings')}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 md:px-8 lg:px-10 lg:py-8">
        <ReservationsPageHeader services={services} initialDateKey={initialDateKey} />

        <section className="space-y-4">
          <ReservationFilters
            searchValue={searchValue}
            statusValue={currentStatus}
            onSearchChange={setSearchValue}
            onStatusChange={(status) => updateFilters({ status, page: 1 })}
          />

          <div className={`border border-outline-variant bg-surface-container-low p-5 transition-opacity md:p-6 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-caps text-secondary">Liste</p>
                <h2 className="mt-1 font-serif text-3xl text-foreground">
                  {total} réservation{total > 1 ? 's' : ''}
                </h2>
              </div>
              <p className="text-sm text-foreground/55">
                <span className="hidden md:inline">Page {currentPage} sur {totalPages}</span>
                <span className="md:hidden">{reservations.length} affichée{reservations.length > 1 ? 's' : ''}</span>
              </p>
            </div>

            <div className="hidden md:block">
              <ReservationList reservations={reservations} onOpen={setSelectedReservation} />
              <ReservationPagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
                pageSize={ITEMS_PER_PAGE}
                isPending={isPending}
                onPageChange={(page) => updateFilters({ page })}
              />
            </div>
            <ReservationMobileInfiniteList
              key={`${currentSearch}-${currentStatus}`}
              initialReservations={reservations}
              total={total}
              pageSize={ITEMS_PER_PAGE}
              search={currentSearch}
              status={currentStatus}
              onOpen={setSelectedReservation}
            />
          </div>
        </section>
      </div>

      {selectedReservation && (
        <BookingDetailPanel
          booking={selectedReservation}
          isOpen
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </DashboardShell>
  )
}

function updateOptionalParam(params: URLSearchParams, key: string, value?: string) {
  if (value === undefined) return
  if (value) params.set(key, value)
  else params.delete(key)
}
