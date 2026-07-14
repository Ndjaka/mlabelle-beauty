import type { ChangeEvent } from 'react'
import type { DashboardReservationStatusFilter } from '@/features/dashboard/reservation-filters'

type ReservationFiltersProps = {
  searchValue: string
  statusValue: DashboardReservationStatusFilter
  counts: Record<DashboardReservationStatusFilter, number>
  onSearchChange: (value: string) => void
  onStatusChange: (value: DashboardReservationStatusFilter) => void
}

const statusOptions: Array<{ value: DashboardReservationStatusFilter; label: string }> = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'À confirmer' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'cancelled', label: 'Annulées' },
]

export function ReservationFilters({
  searchValue,
  statusValue,
  counts,
  onSearchChange,
  onStatusChange,
}: ReservationFiltersProps) {
  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    const option = statusOptions.find((statusOption) => statusOption.value === value)
    if (option) onStatusChange(option.value)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-xl flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-foreground/40">
            search
          </span>
          <input
            type="text"
            placeholder="Rechercher une cliente, prestation, e-mail..."
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
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onStatusChange(option.value)}
            className={`border px-3 py-3 text-left transition-colors ${
              statusValue === option.value
                ? 'border-tertiary bg-tertiary text-white'
                : 'border-outline-variant bg-background text-foreground hover:bg-primary/40'
            }`}
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
              {option.label}
            </span>
            <span className="mt-1 block font-serif text-2xl leading-none">{counts[option.value]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
