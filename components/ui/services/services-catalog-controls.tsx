'use client'

export type ServiceFilter = 'all' | 'coupe' | 'brushing' | 'coloration' | 'coiffage'
export type ServiceSort = 'name' | 'price' | 'duration'

type FilterOption = {
  icon: string
  id: ServiceFilter
  label: string
}

interface ServicesCatalogControlsProps {
  activeFilter: ServiceFilter
  filterOptions: FilterOption[]
  resultCount: number
  search: string
  sort: ServiceSort
  onFilterChange: (filter: ServiceFilter) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: ServiceSort) => void
}

const sortLabels: Record<ServiceSort, string> = {
  duration: 'Durée courte',
  name: 'Nom',
  price: 'Prix croissant',
}

export function ServicesCatalogControls({
  activeFilter,
  filterOptions,
  resultCount,
  search,
  sort,
  onFilterChange,
  onSearchChange,
  onSortChange,
}: ServicesCatalogControlsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block lg:w-[360px]">
          <span className="sr-only">Rechercher une prestation</span>
          <span
            className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-foreground/45"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher un service..."
            className="h-11 w-full rounded-[999px] border border-secondary/20 bg-white px-11 font-sans text-[13px] text-foreground shadow-[0_8px_20px_rgba(30,27,21,0.04)] outline-none transition-colors placeholder:text-foreground/45 focus:border-secondary"
          />
        </label>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <span className="font-sans text-[12px] font-semibold text-foreground/55">
            {resultCount} prestation{resultCount > 1 ? 's' : ''}
          </span>
          <label className="flex items-center gap-2">
            <span className="hidden font-sans text-[12px] font-semibold text-foreground/60 sm:inline">
              Trier par
            </span>
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value as ServiceSort)}
              className="h-11 rounded-[999px] border border-secondary/20 bg-white px-4 font-sans text-[12px] font-semibold text-foreground outline-none transition-colors focus:border-secondary"
              aria-label="Trier les prestations"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div>
        <p className="mb-3 font-sans text-[12px] font-semibold text-foreground/70">
          Filtrer par prestation
        </p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {filterOptions.map((option) => {
            const isActive = option.id === activeFilter

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onFilterChange(option.id)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-[999px] border px-4 font-sans text-[12px] font-semibold transition-colors ${
                  isActive
                    ? 'border-secondary bg-secondary text-white shadow-[0_10px_24px_rgba(184,151,74,0.24)]'
                    : 'border-secondary/20 bg-white text-foreground/75 hover:border-secondary/50 hover:text-foreground'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]" aria-hidden="true">
                  {option.icon}
                </span>
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
