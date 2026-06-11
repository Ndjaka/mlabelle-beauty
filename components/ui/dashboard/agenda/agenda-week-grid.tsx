import { AgendaBookingBlock } from '@/components/ui/dashboard/agenda/agenda-booking-block'
import { cn } from '@/lib/utils'
import { buildDashboardAgendaVisibleHours } from '@/features/dashboard/utils'
import type { DashboardAgendaWeekColumn, DashboardAgendaItem } from '@/types/dashboard'

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

type AgendaWeekGridProps = {
  columns: DashboardAgendaWeekColumn[]
  selectedDateKey: string
  onDayClick: (dateKey: string) => void
  onBookingClick?: (booking: DashboardAgendaItem) => void
}

export function AgendaWeekGrid({ columns, selectedDateKey, onDayClick, onBookingClick }: AgendaWeekGridProps) {
  const visibleHours = buildDashboardAgendaVisibleHours(columns.flatMap((column) => column.items))

  return (
    <div className="hidden overflow-x-auto border border-outline-variant bg-background md:block">
      {/* Header row — days of the week */}
      <div className="grid grid-cols-[80px_repeat(7,minmax(120px,1fr))] border-b border-outline-variant bg-surface-container-low">
        <div className="border-r border-outline-variant px-3 py-4 text-xs font-semibold uppercase text-foreground/45">
          Heure
        </div>
        {columns.map((col) => (
          <button
            key={col.dateKey}
            type="button"
            onClick={() => onDayClick(col.dateKey)}
            className={cn(
              'border-r border-outline-variant px-3 py-4 text-center text-xs font-semibold uppercase last:border-r-0 transition-colors hover:bg-primary/30',
              col.dateKey === selectedDateKey && 'bg-tertiary text-white hover:bg-tertiary'
            )}
          >
            <span className="block">{col.dayLabel}</span>
            <span className="mt-1 block font-serif text-lg leading-none">
              {col.dateKey.slice(8)}
            </span>
          </button>
        ))}
      </div>

      {/* Time rows */}
      <div>
        {visibleHours.map((hour) => (
          <div key={hour} className="grid h-20 grid-cols-[80px_repeat(7,minmax(120px,1fr))]">
            <div className="border-r border-t border-outline-variant px-3 pt-4 text-xs font-semibold text-foreground/50">
              {hour}
            </div>
            {columns.map((col) => {
              const hourItems = col.items.filter((item) => {
                const [itemHour] = item.time.split(':')
                return `${itemHour?.padStart(2, '0')}:00` === hour
              })

              return (
                <div
                  key={`${col.dateKey}-${hour}`}
                  className={cn(
                    'border-r border-t border-outline-variant relative',
                    col.dateKey === selectedDateKey && 'bg-tertiary/5'
                  )}
                >
                  {hourItems.length > 0 && hourItems.map((item, index) => {
                    const styles = getEventStyles(item.time, item.endTime, hour)
                    return (
                      <div
                        key={`${item.kind}-${item.time}-${item.endTime}-${index}`}
                        className="absolute left-1 right-1 z-10 flex flex-col"
                        style={styles}
                      >
                        <AgendaBookingBlock
                          item={item}
                          compact
                          onClick={item.kind === 'booking' && onBookingClick ? () => onBookingClick(item) : undefined}
                          className="flex-1 w-full"
                        />
                      </div>
                    )
                  })}
                  {hourItems.length === 0 && (
                    <div className="h-full w-full" />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
