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
        <h2 className="font-label-caps text-label-caps text-on-surface uppercase">
          {format(currentMonth, 'MMMM', { locale: fr })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 snap-x">
        {monthDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const isPast = isBefore(day, today)
          return (
            <button
              key={day.toISOString()}
              onClick={() => !isPast && onDateSelect(day)}
              disabled={isPast}
              className={`snap-start flex-shrink-0 w-[64px] h-[80px] border flex flex-col items-center justify-center transition-colors relative
                ${isPast ? 'opacity-50 cursor-not-allowed border-outline-variant bg-surface' : ''}
                ${isSelected ? 'border-secondary bg-surface shadow-[0_0_15px_rgba(184,151,74,0.15)]' : !isPast ? 'border-outline-variant bg-surface hover:border-secondary/50' : ''}
              `}
            >
              {isSelected && <div className="absolute top-0 w-full h-[2px] bg-secondary" />}
              <span className={`font-label-caps text-label-caps uppercase mb-1 ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {format(day, 'EEE', { locale: fr })}
              </span>
              <span className="font-h3 text-h3 text-on-background">
                {format(day, 'd')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
