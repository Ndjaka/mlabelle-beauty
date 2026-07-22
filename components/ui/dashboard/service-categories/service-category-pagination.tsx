type ServiceCategoryPaginationProps = {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
  isPending: boolean
  onPageChange: (page: number) => void
}

export function ServiceCategoryPagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  isPending,
  onPageChange,
}: ServiceCategoryPaginationProps) {
  if (total === 0) return null

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-foreground/60">
        Affichage de {(currentPage - 1) * pageSize + 1} à{' '}
        {Math.min(currentPage * pageSize, total)} sur {total} catégories
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isPending}
          className="flex size-8 items-center justify-center border border-outline-variant text-foreground/70 transition-colors hover:bg-surface-container-low disabled:opacity-50"
          aria-label="Page précédente"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            chevron_left
          </span>
        </button>
        <div className="text-sm font-medium text-foreground">
          {currentPage} / {totalPages}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isPending}
          className="flex size-8 items-center justify-center border border-outline-variant text-foreground/70 transition-colors hover:bg-surface-container-low disabled:opacity-50"
          aria-label="Page suivante"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  )
}
