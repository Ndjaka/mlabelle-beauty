'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookingDetailPanel } from '@/components/ui/dashboard/booking-detail-panel'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import { ReservationFilters } from '@/components/ui/dashboard/reservations/reservation-filters'
import { ReservationList } from '@/components/ui/dashboard/reservations/reservation-list'
import {
  countDashboardReservationsByStatus,
  filterDashboardReservations,
  type DashboardReservationStatusFilter,
} from '@/features/dashboard/reservation-filters'
import { formatDashboardDateLabel } from '@/features/dashboard/utils'
import type { DashboardRecentBooking } from '@/types/dashboard'

type ReservationsPageProps = {
  reservations: DashboardRecentBooking[]
}

export function ReservationsPage({ reservations }: ReservationsPageProps) {
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<DashboardReservationStatusFilter>('all')
  const [selectedReservation, setSelectedReservation] = useState<DashboardRecentBooking | null>(null)
  const counts = useMemo(() => countDashboardReservationsByStatus(reservations), [reservations])
  const filteredReservations = useMemo(
    () => filterDashboardReservations(reservations, { search: searchValue, status: statusFilter }),
    [reservations, searchValue, statusFilter]
  )

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
            statusValue={statusFilter}
            counts={counts}
            onSearchChange={setSearchValue}
            onStatusChange={setStatusFilter}
          />

          <div className="border border-outline-variant bg-surface-container-low p-5 md:p-6">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-caps text-secondary">Liste</p>
                <h2 className="mt-1 font-serif text-3xl text-foreground">
                  {filteredReservations.length} réservation
                  {filteredReservations.length > 1 ? 's' : ''}
                </h2>
              </div>
              <p className="text-sm text-foreground/55">{reservations.length} au total</p>
            </div>

            <ReservationList reservations={filteredReservations} onOpen={setSelectedReservation} />
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
