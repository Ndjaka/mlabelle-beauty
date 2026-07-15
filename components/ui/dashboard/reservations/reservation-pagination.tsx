type ReservationPaginationProps = {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
  isPending: boolean
  onPageChange: (page: number) => void
}

export function ReservationPagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  isPending,
  onPageChange,
}: ReservationPaginationProps) {
  if (total === 0) return null

  const firstVisibleItem = (currentPage - 1) * pageSize + 1
  const lastVisibleItem = Math.min(currentPage * pageSize, total)

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-foreground/60">
        <span className="sm:hidden">
          {firstVisibleItem}–{lastVisibleItem} sur {total}
        </span>
        <span className="hidden sm:inline">
          Affichage de {firstVisibleItem} à {lastVisibleItem} sur {total} réservations
        </span>
      </p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isPending}
          className="flex h-11 items-center justify-center gap-1 border border-outline-variant px-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface-container-low disabled:opacity-50 sm:size-8 sm:px-0"
          aria-label="Page précédente"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            chevron_left
          </span>
          <span className="sm:hidden">Précédent</span>
        </button>
        <div className="px-2 text-center text-sm font-medium text-foreground">
          {currentPage} / {totalPages}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isPending}
          className="flex h-11 items-center justify-center gap-1 border border-outline-variant px-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface-container-low disabled:opacity-50 sm:size-8 sm:px-0"
          aria-label="Page suivante"
        >
          <span className="sm:hidden">Suivant</span>
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  )
}
