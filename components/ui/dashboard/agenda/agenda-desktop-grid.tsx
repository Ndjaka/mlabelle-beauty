import { AgendaBookingBlock } from '@/components/ui/dashboard/agenda/agenda-booking-block'
import type { DashboardAgendaHourRow } from '@/types/dashboard'

type AgendaDesktopGridProps = {
  rows: DashboardAgendaHourRow[]
}

export function AgendaDesktopGrid({ rows }: AgendaDesktopGridProps) {
  return (
    <div className="hidden overflow-hidden border border-outline-variant bg-background md:block">
      <div className="grid grid-cols-[80px_1fr] border-b border-outline-variant bg-surface-container-low">
        <div className="border-r border-outline-variant px-3 py-4 text-xs font-semibold uppercase text-foreground/45">
          Heure
        </div>
        <div className="px-4 py-4 text-xs font-semibold uppercase text-foreground/45">
          Rendez-vous
        </div>
      </div>

      <div>
        {rows.map((row) => (
          <div key={row.hour} className="grid min-h-24 grid-cols-[80px_1fr]">
            <div className="border-r border-t border-outline-variant px-3 pt-4 text-xs font-semibold text-foreground/50">
              {row.hour}
            </div>
            <div className="border-t border-outline-variant p-3">
              {row.items.length > 0 ? (
                <div className="space-y-3">
                  {row.items.map((item) => (
                    <AgendaBookingBlock key={`${item.kind}-${item.time}-${item.endTime}`} item={item} />
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-16 bg-surface-container-low/30" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
