'use client'

import { useMemo, useState } from 'react'
import type { Service } from '@/types/service'
import { ServiceCard } from '@/components/ui/service-card'
import {
  ServicesCatalogControls,
  type ServiceFilter,
  type ServiceSort,
} from '@/components/ui/services/services-catalog-controls'
import { ServicesFinalCta } from '@/components/ui/services/services-final-cta'
import { ServicesHero } from '@/components/ui/services/services-hero'
import { ServicesProcess } from '@/components/ui/services/services-process'
import { ServicesTrustBar } from '@/components/ui/services/services-trust-bar'
import {
  getDefaultPublicCatalogCategoryId,
  isPublicCatalogService,
} from '@/features/services/utils'

interface ServicesCatalogProps {
  services: Service[]
  today: string
}

type FilterOption = {
  icon: string
  id: ServiceFilter
  label: string
}

export function ServicesCatalog({ services, today }: ServicesCatalogProps) {
  const defaultCategoryId = useMemo(
    () => getDefaultPublicCatalogCategoryId(services),
    [services]
  )
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>(defaultCategoryId)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<ServiceSort>('name')
  const filterOptions = useMemo<FilterOption[]>(() => {
    const categories = new Map<string, string>()
    for (const service of services) {
      if (!isPublicCatalogService(service)) continue
      categories.set(service.category.id, service.category.name)
    }

    return Array.from(categories, ([id, label]) => ({ id, label, icon: 'category' }))
      .toSorted((first, second) => first.label.localeCompare(second.label, 'fr'))
  }, [services])

  const filteredServices = useMemo(() => {
    const searchValue = normalizeValue(search)
    return services
      .filter((service) => {
        if (!isPublicCatalogService(service)) return false

        const searchable = normalizeValue(`${service.name} ${service.description ?? ''}`)
        const matchesSearch = searchValue === '' || searchable.includes(searchValue)
        const matchesFilter = activeFilter !== '' && service.category_id === activeFilter

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
      className="mx-auto w-full max-w-[1440px] px-gutter py-8 md:px-xxl md:py-14"
    >
      <ServicesHero />
      <ServicesTrustBar />
      <ServicesProcess />

      <div id="prestations-catalog" className="scroll-mt-28 pt-9 md:pt-12">
        <div className="mb-5 flex flex-col gap-2 md:mb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
              Prestations
            </p>
            <h2 className="mt-2 font-serif text-[34px] leading-none text-foreground md:text-[44px]">
              Choisissez votre prestation
            </h2>
          </div>
          <p className="max-w-[430px] font-sans text-[13px] leading-6 text-foreground/60 md:text-right">
            Comparez les durées et les prix, puis sélectionnez une prestation pour voir les créneaux disponibles.
          </p>
        </div>

        <ServicesCatalogControls
          activeFilter={activeFilter}
          filterOptions={filterOptions}
          resultCount={filteredServices.length}
          search={search}
          sort={sort}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearch}
          onSortChange={setSort}
        />
      </div>

      {filteredServices.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} today={today} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[8px] border border-secondary/15 bg-white p-8 text-center text-foreground/70 shadow-[0_14px_34px_rgba(30,27,21,0.04)]">
          <p className="font-sans text-[15px] font-semibold text-foreground">
            Aucune prestation ne correspond à cette recherche.
          </p>
          <p className="mt-2 font-sans text-[13px] leading-6 text-foreground/60">
            Essayez un autre mot-clé ou sélectionnez une autre catégorie.
          </p>
        </div>
      )}

      <ServicesFinalCta />
    </section>
  )
}

function normalizeValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
