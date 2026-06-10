import { AgendaBookingBlock } from '@/components/ui/dashboard/agenda/agenda-booking-block'
import type { DashboardAgendaHourRow } from '@/types/dashboard'

type AgendaMobileListProps = {
  rows: DashboardAgendaHourRow[]
}

export function AgendaMobileList({ rows }: AgendaMobileListProps) {
  const visibleRows = rows.filter((row) => row.items.length > 0)

  if (visibleRows.length === 0) {
    return (
      <div className="border border-dashed border-outline-variant bg-background px-4 py-6 text-sm leading-6 text-foreground/55 md:hidden">
        Aucun rendez-vous prévu aujourd’hui.
      </div>
    )
  }

  return (
    <div className="space-y-4 md:hidden">
      {visibleRows.map((row) => (
        <div key={row.hour} className="grid grid-cols-[56px_1fr] gap-3">
          <p className="pt-4 text-xs font-semibold text-foreground/50">{row.hour}</p>
          <div className="space-y-3">
            {row.items.map((item) => (
              <AgendaBookingBlock key={`${item.kind}-${item.time}-${item.endTime}`} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
