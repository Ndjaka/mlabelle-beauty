'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { loadDashboardReservationsPage } from '@/features/dashboard/actions'
import {
  getNextDashboardReservationPage,
  hasMoreDashboardReservations,
  type DashboardReservationStatusFilter,
} from '@/features/dashboard/reservation-filters'
import type { DashboardRecentBooking } from '@/types/dashboard'
import { ReservationList } from '@/components/ui/dashboard/reservations/reservation-list'

type ReservationMobileInfiniteListProps = {
  initialReservations: DashboardRecentBooking[]
  total: number
  pageSize: number
  search: string
  status: DashboardReservationStatusFilter
  onOpen: (reservation: DashboardRecentBooking) => void
}

export function ReservationMobileInfiniteList({
  initialReservations,
  total,
  pageSize,
  search,
  status,
  onOpen,
}: ReservationMobileInfiniteListProps) {
  const [reservations, setReservations] = useState(initialReservations)
  const [loadedPage, setLoadedPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hasMore = hasMoreDashboardReservations(reservations.length, total)

  const loadNextPage = useCallback(() => {
    if (isPending || !hasMore) return

    const nextPage = getNextDashboardReservationPage(loadedPage)
    setError(null)
    startTransition(async () => {
      try {
        const result = await loadDashboardReservationsPage({
          page: nextPage,
          pageSize,
          search,
          status,
        })
        setReservations((currentReservations) => [
          ...currentReservations,
          ...result.data.filter(
            (reservation) => !currentReservations.some((current) => current.id === reservation.id)
          ),
        ])
        setLoadedPage(nextPage)
      } catch {
        setError('Impossible de charger plus de réservations.')
      }
    })
  }, [hasMore, isPending, loadedPage, pageSize, search, status])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadNextPage()
      },
      { rootMargin: '240px 0px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadNextPage])

  return (
    <div className="md:hidden">
      <ReservationList reservations={reservations} onOpen={onOpen} />

      {error && (
        <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div ref={sentinelRef} className="h-6" aria-hidden="true" />

      <div className="mt-4 border-t border-outline-variant pt-4 text-center">
        {hasMore ? (
          <button
            type="button"
            onClick={loadNextPage}
            disabled={isPending}
            className="w-full border border-outline-variant px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-low disabled:opacity-50"
          >
            {isPending ? 'Chargement...' : 'Charger plus'}
          </button>
        ) : (
          total > 0 && (
            <p className="text-sm text-foreground/55">
              Toutes les réservations sont affichées.
            </p>
          )
        )}
      </div>
    </div>
  )
}
