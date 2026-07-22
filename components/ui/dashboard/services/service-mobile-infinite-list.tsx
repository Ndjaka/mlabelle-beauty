'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { loadServicesPage } from '@/features/services/actions'
import { getNextServicesPage, hasMoreServices } from '@/features/services/utils'
import { ServiceList } from '@/components/ui/dashboard/services/service-list'
import type { Service } from '@/types/service'

type ServiceMobileInfiniteListProps = {
  initialServices: Service[]
  total: number
  pageSize: number
  search: string
  status: 'all' | 'active' | 'inactive'
  categoryId: string
  onEdit: (service: Service) => void
  onStatusError: (message: string) => void
}

export function ServiceMobileInfiniteList({
  initialServices,
  total,
  pageSize,
  search,
  status,
  categoryId,
  onEdit,
  onStatusError,
}: ServiceMobileInfiniteListProps) {
  const [services, setServices] = useState(initialServices)
  const [loadedPage, setLoadedPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hasMore = hasMoreServices(services.length, total)

  const loadNextPage = useCallback(() => {
    if (isPending || !hasMore) return

    const nextPage = getNextServicesPage(loadedPage)
    setError(null)
    startTransition(async () => {
      try {
        const result = await loadServicesPage({
          page: nextPage,
          pageSize,
          search,
          status,
          categoryId,
        })
        setServices((currentServices) => [
          ...currentServices,
          ...result.data.filter(
            (service) => !currentServices.some((current) => current.id === service.id)
          ),
        ])
        setLoadedPage(nextPage)
      } catch {
        setError('Impossible de charger plus de prestations.')
      }
    })
  }, [categoryId, hasMore, isPending, loadedPage, pageSize, search, status])

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
      <ServiceList services={services} onEdit={onEdit} onStatusError={onStatusError} />

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
              Toutes les prestations sont affichées.
            </p>
          )
        )}
      </div>
    </div>
  )
}
