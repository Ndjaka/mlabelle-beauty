'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { DashboardAgendaMonth } from '@/types/dashboard'

type AgendaMobileCalendarProps = {
  month: DashboardAgendaMonth
  bookingCountsByDate: Record<string, number>
  onDayClick: (dateKey: string) => void
}

const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function AgendaMobileCalendar({
  month,
  bookingCountsByDate,
  onDayClick,
}: AgendaMobileCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="border border-outline-variant bg-background xl:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <span>
          <span className="label-caps text-secondary">Calendrier</span>
          <span className="mt-1 flex items-center gap-2 font-serif text-2xl text-foreground">
            {month.label}
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              {isOpen ? 'expand_less' : 'expand_more'}
            </span>
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-outline-variant px-3 pb-4">
          <div className="grid grid-cols-7 gap-1 pt-3 text-center">
            {weekdayLabels.map((weekday, index) => (
              <span
                key={`${weekday}-${index}`}
                className="py-2 text-[11px] font-semibold uppercase text-foreground/45"
              >
                {weekday}
              </span>
            ))}

            {month.days.map((day) => {
              const bookingCount = bookingCountsByDate[day.dateKey] ?? 0

              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() => onDayClick(day.dateKey)}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center text-sm font-semibold transition-colors',
                    !day.isCurrentMonth && 'text-foreground/25',
                    day.isCurrentMonth && !day.active && 'text-foreground/60 hover:bg-primary/50',
                    day.active && 'bg-tertiary text-white'
                  )}
                >
                  <span>{day.dayNumber}</span>
                  {bookingCount > 0 && (
                    <span
                      aria-label={`${bookingCount} rendez-vous`}
                      className={cn(
                        'mt-1 h-1.5 w-1.5 rounded-full',
                        day.active ? 'bg-white/85' : 'bg-secondary'
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
