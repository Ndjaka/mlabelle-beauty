'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { shiftDashboardAgendaMonthDateKey } from '@/features/dashboard/agenda-navigation'
import { buildDashboardAgendaMonthForDateKeys } from '@/features/dashboard/utils'
import type { DashboardAgendaMonth } from '@/types/dashboard'

type AgendaMiniMonthProps = {
  month: DashboardAgendaMonth
  onDayClick: (dateKey: string) => void
}

const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function AgendaMiniMonth({ month, onDayClick }: AgendaMiniMonthProps) {
  const activeDateKey = getAgendaMonthActiveDateKey(month)
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
    <aside className="hidden border border-outline-variant bg-background p-4 xl:block">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="label-caps text-secondary">Mois</p>
          <h3 className="mt-2 font-serif text-2xl text-foreground">{displayedMonth.label}</h3>
        </div>
        <div className="flex shrink-0">
          <button
            type="button"
            aria-label="Mois précédent"
            onClick={() => handleMonthShift(-1)}
            className="flex h-9 w-9 items-center justify-center border border-outline-variant text-foreground transition-colors hover:bg-primary/50"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            aria-label="Mois suivant"
            onClick={() => handleMonthShift(1)}
            className="flex h-9 w-9 items-center justify-center border-y border-r border-outline-variant text-foreground transition-colors hover:bg-primary/50"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayLabels.map((weekday, index) => (
          <span key={`${weekday}-${index}`} className="py-2 text-[11px] font-semibold uppercase text-foreground/45">
            {weekday}
          </span>
        ))}

        {displayedMonth.days.map((day) => (
          <button
            key={day.dateKey}
            type="button"
            onClick={() => onDayClick(day.dateKey)}
            className={cn(
              'flex aspect-square items-center justify-center text-xs font-semibold transition-colors',
              !day.isCurrentMonth && 'text-foreground/25',
              day.isCurrentMonth && !day.active && 'text-foreground/55 hover:bg-primary/50',
              day.active && 'bg-tertiary text-white'
            )}
          >
            {day.dayNumber}
          </button>
        ))}
      </div>
    </aside>
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
