'use client'

import { useEffect, useRef } from 'react'
import { AgendaMobileWeekCell } from '@/components/ui/dashboard/agenda/agenda-mobile-week-cell'
import { cn } from '@/lib/utils'
import {
  buildDashboardAgendaBookingCountsByDate,
  buildDashboardAgendaVisibleHours,
  getMobileAgendaWeekSelectedScrollLeft,
} from '@/features/dashboard/utils'
import type { DashboardAgendaItem, DashboardAgendaWeekColumn } from '@/types/dashboard'

const mobileWeekHourColumnClassName = 'w-14 shrink-0'
const mobileWeekDayColumnClassName = 'w-[120px] shrink-0'

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
  const scrollRef = useRef<HTMLDivElement>(null)
  const visibleHours = buildDashboardAgendaVisibleHours(columns.flatMap((column) => column.items))
  const bookingCountsByDate = buildDashboardAgendaBookingCountsByDate(columns)
  const selectedScrollLeft = getMobileAgendaWeekSelectedScrollLeft(columns, selectedDateKey)

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: selectedScrollLeft })
  }, [selectedScrollLeft])

  return (
    <div
      role="region"
      aria-label="Planning mobile de la semaine"
      className="overflow-hidden border border-outline-variant bg-background md:hidden"
    >
      <div ref={scrollRef} className="overflow-x-auto">
        <div className="w-max min-w-full">
          <div className="flex border-b border-outline-variant bg-surface-container-low">
            <div
              className={cn(
                'sticky left-0 z-30 border-r border-outline-variant bg-surface-container-low px-2 py-3 text-[10px] font-semibold uppercase text-foreground/45',
                mobileWeekHourColumnClassName
              )}
            >
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
                    'min-w-0 border-r border-outline-variant px-2 py-2 text-center transition-colors last:border-r-0',
                    'hover:bg-primary/40',
                    mobileWeekDayColumnClassName,
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
              <div key={hour} className="flex h-20">
                <div
                  className={cn(
                    'sticky left-0 z-20 border-r border-t border-outline-variant bg-background px-2 pt-3 text-[11px] font-semibold text-foreground/50',
                    mobileWeekHourColumnClassName
                  )}
                >
                  {hour}
                </div>
                {columns.map((column) => (
                  <AgendaMobileWeekCell
                    key={`${column.dateKey}-${hour}`}
                    column={column}
                    hour={hour}
                    selected={column.dateKey === selectedDateKey}
                    className={mobileWeekDayColumnClassName}
                    onBookingClick={onBookingClick}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
