'use client'

import { AgendaMobileBookingCard } from '@/components/ui/dashboard/agenda/agenda-mobile-booking-card'
import { cn } from '@/lib/utils'
import {
  buildDashboardAgendaBookingCountsByDate,
  buildDashboardAgendaVisibleHours,
  getMobileAgendaWeekDurationClass,
  getMobileAgendaWeekOffsetClass,
} from '@/features/dashboard/utils'
import type { DashboardAgendaItem, DashboardAgendaWeekColumn } from '@/types/dashboard'

type AgendaMobileWeekGridProps = {
  columns: DashboardAgendaWeekColumn[]
  selectedDateKey: string
  onDayClick: (dateKey: string) => void
  onBookingClick?: (booking: DashboardAgendaItem) => void
}

export function AgendaMobileWeekGrid({
  columns,
  selectedDateKey,
  onDayClick,
  onBookingClick,
}: AgendaMobileWeekGridProps) {
  const visibleHours = buildDashboardAgendaVisibleHours(columns.flatMap((column) => column.items))
  const bookingCountsByDate = buildDashboardAgendaBookingCountsByDate(columns)

  return (
    <div
      role="region"
      aria-label="Planning mobile de la semaine"
      className="border border-outline-variant bg-background md:hidden"
    >
      <div className="sticky top-[86px] z-20 grid grid-cols-[44px_repeat(7,minmax(0,1fr))] border-b border-outline-variant bg-surface-container-low">
        <div className="border-r border-outline-variant px-1 py-3 text-[10px] font-semibold uppercase text-foreground/45">
          Heure
        </div>
        {columns.map((column) => {
          const bookingCount = bookingCountsByDate[column.dateKey] ?? 0

          return (
            <button
              key={column.dateKey}
              type="button"
              onClick={() => onDayClick(column.dateKey)}
              className={cn(
                'min-w-0 border-r border-outline-variant px-1 py-2 text-center transition-colors last:border-r-0',
                'hover:bg-primary/40',
                column.dateKey === selectedDateKey && 'bg-tertiary text-white hover:bg-tertiary'
              )}
            >
              <span className="block truncate text-[10px] font-semibold uppercase leading-none">
                {column.dayLabel}
              </span>
              <span className="mt-1 block font-serif text-lg leading-none">
                {column.dateKey.slice(8)}
              </span>
              {bookingCount > 0 && (
                <span
                  aria-label={`${bookingCount} rendez-vous`}
                  className={cn(
                    'mx-auto mt-1 block h-1.5 w-1.5 rounded-full',
                    column.dateKey === selectedDateKey ? 'bg-white/80' : 'bg-secondary'
                  )}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="pb-20">
        {visibleHours.map((hour) => (
          <div key={hour} className="grid h-20 grid-cols-[44px_repeat(7,minmax(0,1fr))]">
            <div className="border-r border-t border-outline-variant px-1.5 pt-3 text-[11px] font-semibold text-foreground/50">
              {hour}
            </div>
            {columns.map((column) => (
              <AgendaMobileWeekCell
                key={`${column.dateKey}-${hour}`}
                column={column}
                hour={hour}
                selected={column.dateKey === selectedDateKey}
                onBookingClick={onBookingClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function AgendaMobileWeekCell({
  column,
  hour,
  selected,
  onBookingClick,
}: {
  column: DashboardAgendaWeekColumn
  hour: string
  selected: boolean
  onBookingClick?: (booking: DashboardAgendaItem) => void
}) {
  const hourItems = column.items.filter((item) => {
    const [itemHour] = item.time.split(':')
    return `${itemHour?.padStart(2, '0')}:00` === hour
  })

  return (
    <div
      className={cn(
        'relative border-r border-t border-outline-variant last:border-r-0',
        selected && 'bg-tertiary/5'
      )}
    >
      {hourItems.map((item, index) => (
        <div
          key={`${item.kind}-${item.time}-${item.endTime}-${index}`}
          className={cn(
            'absolute left-0.5 right-0.5 z-10 min-w-0 max-w-full',
            getMobileAgendaWeekOffsetClass(item.time),
            getMobileAgendaWeekDurationClass(item.time, item.endTime)
          )}
        >
          <AgendaMobileBookingCard
            item={item}
            variant="week"
            onClick={
              item.kind === 'booking' && onBookingClick ? () => onBookingClick(item) : undefined
            }
          />
        </div>
      ))}
    </div>
  )
}
