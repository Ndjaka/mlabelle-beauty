'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { BookingDetailPanel } from '@/components/ui/dashboard/booking-detail-panel'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import { ReservationFilters } from '@/components/ui/dashboard/reservations/reservation-filters'
import { ReservationList } from '@/components/ui/dashboard/reservations/reservation-list'
import { ReservationPagination } from '@/components/ui/dashboard/reservations/reservation-pagination'
import type { DashboardReservationStatusFilter } from '@/features/dashboard/reservation-filters'
import { formatDashboardDateLabel } from '@/features/dashboard/utils'
import type { DashboardRecentBooking } from '@/types/dashboard'

type ReservationsPageProps = {
  reservations: DashboardRecentBooking[]
  total: number
  currentPage: number
  currentSearch: string
  currentStatus: DashboardReservationStatusFilter
}

const ITEMS_PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 350

export function ReservationsPage({
  reservations,
  total,
  currentPage,
  currentSearch,
  currentStatus,
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
        <section className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps text-secondary">Suivi admin</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Réservations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
              Retrouvez toutes les demandes, les rendez-vous confirmés et les annulations du salon.
            </p>
          </div>
          <Button href="/agenda" variant="outline" className="w-full md:w-auto">
            Voir l’agenda
          </Button>
        </section>

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
                Page {currentPage} sur {totalPages}
              </p>
            </div>

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
