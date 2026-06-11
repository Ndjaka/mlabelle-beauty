'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { ServiceFilters } from '@/components/ui/dashboard/services/service-filters'
import { ServiceList } from '@/components/ui/dashboard/services/service-list'
import { ServiceModal } from '@/components/ui/dashboard/services/service-modal'
import { ServicePagination } from '@/components/ui/dashboard/services/service-pagination'
import { formatDashboardDateLabel } from '@/features/dashboard/utils'
import type { Service } from '@/types/service'

type ServicesPageProps = {
  services: Service[]
  total: number
  currentPage: number
  currentSearch: string
  currentStatus: 'all' | 'active' | 'inactive'
}

const ITEMS_PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 350

export function ServicesPage({
  services,
  total,
  currentPage,
  currentSearch,
  currentStatus,
}: ServicesPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [pageError, setPageError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
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

  function openCreateModal() {
    setSelectedService(null)
    setIsModalOpen(true)
  }

  function openEditModal(service: Service) {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  return (
    <DashboardShell
      dateLabel={formatDashboardDateLabel(new Date())}
      navItems={getDashboardNavItems('services')}
      mobileNavItems={getDashboardMobileNavItems('services')}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 md:px-8 lg:px-10 lg:py-8">
        <section className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps text-secondary">Configuration</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Prestations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
              Gérez les services proposés par le salon : tarifs, durées et statuts d&apos;activation.
            </p>
          </div>
          <Button onClick={openCreateModal} className="flex w-full items-center justify-center gap-2 md:w-auto">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              add
            </span>
            Nouveau service
          </Button>
        </section>

        <section className="space-y-4">
          <ServiceFilters
            searchValue={searchValue}
            statusValue={currentStatus}
            onSearchChange={setSearchValue}
            onStatusChange={(status) => updateFilters({ status, page: 1 })}
          />
          {pageError && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pageError}
            </p>
          )}
          <div className={`border border-outline-variant bg-surface-container-low p-5 transition-opacity md:p-6 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
            <ServiceList
              services={services}
              onEdit={openEditModal}
              onStatusError={setPageError}
            />
            <ServicePagination
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
      {isModalOpen && (
        <ServiceModal service={selectedService} onClose={() => setIsModalOpen(false)} />
      )}
    </DashboardShell>
  )
}

function updateOptionalParam(params: URLSearchParams, key: string, value?: string) {
  if (value === undefined) return
  if (value) params.set(key, value)
  else params.delete(key)
}
