'use client'

import { format, isSameDay, isBefore, subMonths, addMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

interface MobileDayPickerProps {
  currentMonth: Date
  selectedDate: Date
  today: Date
  monthDays: Date[]
  onMonthChange: (date: Date) => void
  onDateSelect: (date: Date) => void
}

export function MobileDayPicker({
  currentMonth,
  selectedDate,
  today,
  monthDays,
  onMonthChange,
  onDateSelect,
}: MobileDayPickerProps) {
  return (
    <div className="mb-xl">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-secondary">
            Date du rendez-vous
          </p>
          <h2 className="mt-1 font-serif text-[28px] capitalize text-on-surface">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Voir le mois précédent"
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            className="flex size-9 items-center justify-center border border-secondary/20 text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            type="button"
            aria-label="Voir le mois suivant"
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            className="flex size-9 items-center justify-center border border-secondary/20 text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-2">
        {monthDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const isPast = isBefore(day, today)
          return (
            <button
              key={day.toISOString()}
              type="button"
              aria-pressed={isSelected}
              onClick={() => !isPast && onDateSelect(day)}
              disabled={isPast}
              className={`relative flex h-[76px] w-[58px] flex-shrink-0 snap-start flex-col items-center justify-center border transition-colors
                ${isPast ? 'opacity-50 cursor-not-allowed border-outline-variant bg-surface' : ''}
                ${isSelected ? 'border-foreground bg-foreground text-background shadow-[0_14px_30px_rgba(30,27,21,0.12)]' : !isPast ? 'border-secondary/20 bg-white hover:border-secondary/50' : ''}
              `}
            >
              <span className={`mb-1 font-label-caps text-[10px] uppercase tracking-[0.15em] ${isSelected ? 'text-background/70' : 'text-on-surface-variant'}`}>
                {format(day, 'EEE', { locale: fr })}
              </span>
              <span className={isSelected ? 'font-serif text-[26px] text-background' : 'font-serif text-[26px] text-on-background'}>
                {format(day, 'd')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
