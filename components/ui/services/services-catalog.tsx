'use client'

import { useMemo, useState } from 'react'
import type { Service } from '@/types/service'
import { ServiceCard } from '@/components/ui/service-card'
import {
  ServicesCatalogControls,
  type ServiceFilter,
  type ServiceSort,
} from '@/components/ui/services/services-catalog-controls'
import { ServicesTrustBar } from '@/components/ui/services/services-trust-bar'

interface ServicesCatalogProps {
  services: Service[]
  today: string
}

type FilterOption = {
  icon: string
  id: ServiceFilter
  keywords: string[]
  label: string
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'Toutes les prestations', icon: 'grid_view', keywords: [] },
  { id: 'coupe', label: 'Coupe', icon: 'content_cut', keywords: ['coupe'] },
  { id: 'brushing', label: 'Brushing', icon: 'air', keywords: ['brushing'] },
  { id: 'coloration', label: 'Coloration', icon: 'palette', keywords: ['coloration', 'couleur'] },
  { id: 'coiffage', label: 'Coiffage', icon: 'auto_fix_high', keywords: ['coiffage', 'chignon'] },
]

export function ServicesCatalog({ services, today }: ServicesCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<ServiceSort>('name')

  const filteredServices = useMemo(() => {
    const searchValue = normalizeValue(search)
    const activeOption = FILTER_OPTIONS.find((option) => option.id === activeFilter)

    return services
      .filter((service) => {
        const searchable = normalizeValue(`${service.name} ${service.description ?? ''}`)
        const matchesSearch = searchValue === '' || searchable.includes(searchValue)
        const matchesFilter = !activeOption || activeOption.id === 'all'
          || activeOption.keywords.some((keyword) => searchable.includes(keyword))

        return matchesSearch && matchesFilter
      })
      .toSorted((firstService, secondService) => {
        if (sort === 'price') {
          return firstService.price_cents - secondService.price_cents
        }

        if (sort === 'duration') {
          return firstService.duration_minutes - secondService.duration_minutes
        }

        return firstService.name.localeCompare(secondService.name, 'fr')
      })
  }, [activeFilter, search, services, sort])

  return (
    <section
      id="prestations"
      className="mx-auto w-full max-w-[1500px] px-5 py-9 sm:px-7 md:px-10 md:py-14 xl:px-12"
    >
      <header className="mb-7 flex flex-col gap-4 md:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-2xl">
          <h1 className="font-serif text-[42px] leading-none text-foreground md:text-[56px]">
            Nos prestations
          </h1>
          <p className="mt-3 w-fit max-w-full whitespace-nowrap font-sans text-[14px] leading-7 text-foreground/70 sm:text-[15px] md:text-[17px]">
            Choisissez le service qui vous correspond.
          </p>
          <span className="mt-4 block h-px w-10 bg-secondary" aria-hidden="true" />
        </div>
      </header>

      <ServicesCatalogControls
        activeFilter={activeFilter}
        filterOptions={FILTER_OPTIONS}
        resultCount={filteredServices.length}
        search={search}
        sort={sort}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />

      {filteredServices.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} today={today} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[8px] border border-secondary/15 bg-white p-8 text-center text-foreground/70 shadow-[0_14px_34px_rgba(30,27,21,0.04)]">
          Aucune prestation ne correspond à cette recherche.
        </div>
      )}

      <ServicesTrustBar />
    </section>
  )
}

function normalizeValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
