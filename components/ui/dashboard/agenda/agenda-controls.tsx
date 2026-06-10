type AgendaControlsProps = {
  dateLabel: string
  bookingCount: number
}

export function AgendaControls({ dateLabel, bookingCount }: AgendaControlsProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-outline-variant pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="label-caps text-secondary">Agenda</p>
        <h2 className="mt-2 font-serif text-3xl text-foreground md:text-4xl">Planning</h2>
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          {dateLabel} · {bookingCount} rdv
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center border border-outline-variant bg-background text-foreground transition-colors hover:border-secondary"
          aria-label="Jour précédent"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            chevron_left
          </span>
        </button>
        <button
          type="button"
          className="border border-outline-variant bg-background px-4 py-3 text-xs font-semibold uppercase text-foreground transition-colors hover:border-secondary"
        >
          Aujourd’hui
        </button>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center border border-outline-variant bg-background text-foreground transition-colors hover:border-secondary"
          aria-label="Jour suivant"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            chevron_right
          </span>
        </button>

        <div className="ml-0 flex border border-outline-variant bg-background p-1 md:ml-2">
          <button type="button" className="bg-tertiary px-4 py-2 text-xs font-semibold uppercase text-white">
            Jour
          </button>
          <button type="button" className="px-4 py-2 text-xs font-semibold uppercase text-foreground/55">
            Semaine
          </button>
        </div>
      </div>
    </div>
  )
}
