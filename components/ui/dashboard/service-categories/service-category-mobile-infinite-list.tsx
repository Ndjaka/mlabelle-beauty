'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { loadServiceCategoriesPage } from '@/features/service-categories/actions'
import {
  getNextServiceCategoriesPage,
  hasMoreServiceCategories,
} from '@/features/service-categories/utils'
import { ServiceCategoryList } from '@/components/ui/dashboard/service-categories/service-category-list'
import type { ServiceCategory } from '@/types/service-category'

type ServiceCategoryMobileInfiniteListProps = {
  initialCategories: ServiceCategory[]
  total: number
  pageSize: number
  deletingId: string | null
  onDelete: (category: ServiceCategory) => void
  onEdit: (category: ServiceCategory) => void
}

export function ServiceCategoryMobileInfiniteList({
  initialCategories,
  total,
  pageSize,
  deletingId,
  onDelete,
  onEdit,
}: ServiceCategoryMobileInfiniteListProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [loadedPage, setLoadedPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hasMore = hasMoreServiceCategories(categories.length, total)

  const loadNextPage = useCallback(() => {
    if (isPending || !hasMore) return

    const nextPage = getNextServiceCategoriesPage(loadedPage)
    setError(null)
    startTransition(async () => {
      try {
        const result = await loadServiceCategoriesPage({ page: nextPage, pageSize })
        setCategories((currentCategories) => [
          ...currentCategories,
          ...result.data.filter(
            (category) => !currentCategories.some((current) => current.id === category.id)
          ),
        ])
        setLoadedPage(nextPage)
      } catch {
        setError('Impossible de charger plus de catégories.')
      }
    })
  }, [hasMore, isPending, loadedPage, pageSize])

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
      <ServiceCategoryList
        categories={categories}
        deletingId={deletingId}
        onDelete={onDelete}
        onEdit={onEdit}
      />

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
              Toutes les catégories sont affichées.
            </p>
          )
        )}
      </div>
    </div>
  )
}
