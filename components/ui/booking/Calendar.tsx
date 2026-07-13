'use client'

import { format, startOfMonth, getDay, isBefore, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CalendarProps {
  currentMonth: Date
  selectedDate: Date
  today: Date
  monthDays: Date[]
  onMonthChange: (date: Date) => void
  onDateSelect: (date: Date) => void
}

export function Calendar({
  currentMonth,
  selectedDate,
  today,
  monthDays,
  onMonthChange,
  onDateSelect,
}: CalendarProps) {
  return (
    <div className="h-fit border border-secondary/20 bg-white p-5 shadow-[0_18px_50px_rgba(30,27,21,0.04)]">
      <div className="flex justify-between items-center mb-4">
        <button 
          type="button"
          aria-label="Voir le mois précédent"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))} 
          className="flex size-9 items-center justify-center border border-secondary/20 text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
        >
          <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
        </button>
        <span className="font-serif text-[24px] capitalize text-on-surface">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </span>
        <button 
          type="button"
          aria-label="Voir le mois suivant"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))} 
          className="flex size-9 items-center justify-center border border-secondary/20 text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
        >
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </button>
      </div>

      <div className="mb-4 grid grid-cols-7 gap-y-sm text-center font-label-caps text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
        <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-body-md text-body-md">
        {Array.from({ length: (getDay(startOfMonth(currentMonth)) + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {monthDays.map((day) => {
          const isPast = isBefore(day, today)
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          return (
            <button
              key={day.toISOString()}
              type="button"
              aria-pressed={isSelected}
              onClick={() => !isPast && onDateSelect(day)}
              disabled={isPast || !isCurrentMonth}
              className={`mx-auto flex size-9 items-center justify-center transition-colors
                ${isPast ? 'text-outline hover:border hover:border-outline-variant cursor-not-allowed' : ''}
                ${isSelected ? 'bg-foreground text-background' : ''}
                ${!isPast && !isSelected ? 'text-on-surface hover:bg-primary' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
