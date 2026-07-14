'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { shiftDashboardAgendaMonthDateKey } from '@/features/dashboard/agenda-navigation'
import { buildDashboardAgendaMonthForDateKeys } from '@/features/dashboard/utils'
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
  const activeDateKey = getAgendaMonthActiveDateKey(month)
  const [isOpen, setIsOpen] = useState(false)
  const [displayMonthState, setDisplayMonthState] = useState({
    activeDateKey,
    displayMonthDateKey: activeDateKey,
  })
  const displayMonthDateKey =
    displayMonthState.activeDateKey === activeDateKey
      ? displayMonthState.displayMonthDateKey
      : activeDateKey
  const displayedMonth = useMemo(
    () => buildDashboardAgendaMonthForDateKeys(displayMonthDateKey, activeDateKey),
    [activeDateKey, displayMonthDateKey]
  )

  function handleMonthShift(monthOffset: number) {
    setDisplayMonthState({
      activeDateKey,
      displayMonthDateKey: shiftDashboardAgendaMonthDateKey(displayMonthDateKey, monthOffset),
    })
  }

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
            {displayedMonth.label}
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              {isOpen ? 'expand_less' : 'expand_more'}
            </span>
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-outline-variant px-3 pb-4">
          <div className="flex items-center justify-between border-b border-outline-variant py-3">
            <button
              type="button"
              aria-label="Mois précédent"
              onClick={() => handleMonthShift(-1)}
              className="flex h-10 w-10 items-center justify-center border border-outline-variant text-foreground transition-colors hover:bg-primary/50"
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                chevron_left
              </span>
            </button>
            <span className="font-serif text-xl text-foreground">{displayedMonth.label}</span>
            <button
              type="button"
              aria-label="Mois suivant"
              onClick={() => handleMonthShift(1)}
              className="flex h-10 w-10 items-center justify-center border border-outline-variant text-foreground transition-colors hover:bg-primary/50"
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 pt-3 text-center">
            {weekdayLabels.map((weekday, index) => (
              <span
                key={`${weekday}-${index}`}
                className="py-2 text-[11px] font-semibold uppercase text-foreground/45"
              >
                {weekday}
              </span>
            ))}

            {displayedMonth.days.map((day) => {
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

function getAgendaMonthActiveDateKey(month: DashboardAgendaMonth): string {
  return (
    month.days.find((day) => day.active)?.dateKey ??
    month.days.find((day) => day.isCurrentMonth)?.dateKey ??
    month.days[0]?.dateKey ??
    '1970-01-01'
  )
}
