'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import { getDashboardNavItems, getDashboardMobileNavItems } from '@/components/ui/dashboard/dashboard-navigation'
import { ServiceList } from '@/components/ui/dashboard/services/service-list'
import { ServiceModal } from '@/components/ui/dashboard/services/service-modal'
import type { Service } from '@/types/service'
import { formatDashboardDateLabel } from '@/features/dashboard/utils'

type ServicesPageProps = {
  services: Service[]
  total: number
  currentPage: number
  currentSearch: string
  currentStatus: 'all' | 'active' | 'inactive'
}

const ITEMS_PER_PAGE = 10

export function ServicesPage({ 
  services, 
  total, 
  currentPage, 
  currentSearch, 
  currentStatus 
}: ServicesPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const navItems = getDashboardNavItems('services')
  const mobileNavItems = getDashboardMobileNavItems('services')
  const dateLabel = formatDashboardDateLabel(new Date())

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  const updateFilters = (updates: { page?: number; search?: string; status?: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (updates.search !== undefined) {
      if (updates.search) params.set('search', updates.search)
      else params.delete('search')
    }
    
    if (updates.status !== undefined) {
      if (updates.status !== 'all') params.set('status', updates.status)
      else params.delete('status')
    }
    
    if (updates.page !== undefined) {
      if (updates.page > 1) params.set('page', updates.page.toString())
      else params.delete('page')
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value, page: 1 })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ status: e.target.value, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage })
  }

  const handleCreate = () => {
    setSelectedService(null)
    setIsModalOpen(true)
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  return (
    <DashboardShell dateLabel={dateLabel} navItems={navItems} mobileNavItems={mobileNavItems}>
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
          <Button onClick={handleCreate} className="w-full md:w-auto flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              add
            </span>
            Nouveau service
          </Button>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-foreground/40">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher une prestation..."
                defaultValue={currentSearch}
                onChange={(e) => {
                  // Basic debounce mechanism could be added here, 
                  // but for simplicity we will just call handleSearchChange
                  handleSearchChange(e)
                }}
                className="w-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-sm text-foreground focus:border-secondary focus:outline-none"
              />
            </div>
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              className="border border-outline-variant bg-surface-container-low py-2 pl-3 pr-8 text-sm text-foreground focus:border-secondary focus:outline-none sm:w-48"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs uniquement</option>
              <option value="inactive">Inactifs uniquement</option>
            </select>
          </div>

          <div className={`border border-outline-variant bg-surface-container-low p-5 md:p-6 transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
            <ServiceList services={services} onEdit={handleEdit} />

            {total > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
                <p className="text-sm text-foreground/60">
                  Affichage de {(currentPage - 1) * ITEMS_PER_PAGE + 1} à{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, total)} sur {total} prestations
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || isPending}
                    className="flex size-8 items-center justify-center border border-outline-variant text-foreground/70 transition-colors hover:bg-surface-container-low disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <div className="text-sm font-medium text-foreground">
                    {currentPage} / {totalPages}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || isPending}
                    className="flex size-8 items-center justify-center border border-outline-variant text-foreground/70 transition-colors hover:bg-surface-container-low disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <ServiceModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </DashboardShell>
  )
}
