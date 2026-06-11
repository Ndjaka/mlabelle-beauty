import type { ChangeEvent } from 'react'

type ServiceFiltersProps = {
  searchValue: string
  statusValue: 'all' | 'active' | 'inactive'
  onSearchChange: (value: string) => void
  onStatusChange: (value: 'all' | 'active' | 'inactive') => void
}

export function ServiceFilters({
  searchValue,
  statusValue,
  onSearchChange,
  onStatusChange,
}: ServiceFiltersProps) {
  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    if (value === 'active' || value === 'inactive' || value === 'all') {
      onStatusChange(value)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative max-w-md flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-foreground/40">
          search
        </span>
        <input
          type="text"
          placeholder="Rechercher une prestation..."
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-sm text-foreground focus:border-secondary focus:outline-none"
        />
      </div>
      <select
        value={statusValue}
        onChange={handleStatusChange}
        className="border border-outline-variant bg-surface-container-low py-2 pl-3 pr-8 text-sm text-foreground focus:border-secondary focus:outline-none sm:w-48"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs uniquement</option>
        <option value="inactive">Inactifs uniquement</option>
      </select>
    </div>
  )
}
