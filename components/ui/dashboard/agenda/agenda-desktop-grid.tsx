import { AgendaBookingBlock } from '@/components/ui/dashboard/agenda/agenda-booking-block'
import { cn } from '@/lib/utils'
import type { DashboardAgendaHourRow, DashboardAgendaItem } from '@/types/dashboard'

function getEventStyles(itemTime: string, itemEndTime: string, rowHour: string) {
  const [rowH] = rowHour.split(':').map(Number)
  const [startH, startM] = itemTime.split(':').map(Number)
  const [endH, endM] = itemEndTime.split(':').map(Number)

  const startOffsetMinutes = (startH - rowH) * 60 + startM
  const durationMinutes = (endH - startH) * 60 + (endM - startM)

  const top = `${(startOffsetMinutes * 80) / 60}px`
  const minHeight = `${(durationMinutes * 80) / 60}px`

  return { top, minHeight }
}

type AgendaDesktopGridProps = {
  rows: DashboardAgendaHourRow[]
  onBookingClick?: (booking: DashboardAgendaItem) => void
}

export function AgendaDesktopGrid({ rows, onBookingClick }: AgendaDesktopGridProps) {
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
          <div key={row.hour} className="grid h-20 grid-cols-[80px_1fr]">
            <div className="border-r border-t border-outline-variant px-3 pt-3 text-xs font-semibold text-foreground/50">
              {row.hour}
            </div>
            <div className="border-t border-outline-variant relative p-2">
              {row.items.length > 0 && row.items.map((item, index) => {
                const styles = getEventStyles(item.time, item.endTime, row.hour)
                return (
                  <div
                    key={`${item.kind}-${item.time}-${item.endTime}-${index}`}
                    className="absolute left-2 right-2 z-10 flex flex-col"
                    style={styles}
                  >
                    <AgendaBookingBlock
                      item={item}
                      onClick={item.kind === 'booking' && onBookingClick ? () => onBookingClick(item) : undefined}
                      className="flex-1 w-full"
                    />
                  </div>
                )
              })}
              {row.items.length === 0 && (
                <div className="h-full w-full bg-surface-container-low/30" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
