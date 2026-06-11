import { AgendaBookingBlock } from '@/components/ui/dashboard/agenda/agenda-booking-block'
import { cn } from '@/lib/utils'
import { buildDashboardAgendaVisibleHours } from '@/features/dashboard/utils'
import type { DashboardAgendaWeekColumn, DashboardAgendaItem } from '@/types/dashboard'

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
          <div key={hour} className="grid min-h-20 grid-cols-[80px_repeat(7,minmax(120px,1fr))]">
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
                    'border-r border-t border-outline-variant p-2 last:border-r-0',
                    col.dateKey === selectedDateKey && 'bg-tertiary/5'
                  )}
                >
                  {hourItems.length > 0 ? (
                    <div className="space-y-2">
                      {hourItems.map((item) => (
                        <AgendaBookingBlock
                          key={`${item.kind}-${item.time}-${item.endTime}`}
                          item={item}
                          compact
                          onClick={item.kind === 'booking' && onBookingClick ? () => onBookingClick(item) : undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full min-h-12" />
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
