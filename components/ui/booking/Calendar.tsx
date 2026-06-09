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
    <div className="border border-outline-variant/50 p-gutter rounded h-fit bg-white shadow-[0_4px_24px_rgba(30,27,21,0.02)]">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => onMonthChange(subMonths(currentMonth, 1))} 
          className="p-2 hover:bg-surface-container rounded-full transition-colors w-8 h-8 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
        </button>
        <span className="font-body-lg text-body-lg text-on-surface capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </span>
        <button 
          onClick={() => onMonthChange(addMonths(currentMonth, 1))} 
          className="p-2 hover:bg-surface-container rounded-full transition-colors  w-8 h-8 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-sm text-center mb-4 font-label-caps text-label-caps text-on-surface-variant">
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
              onClick={() => !isPast && onDateSelect(day)}
              disabled={isPast || !isCurrentMonth}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors
                ${isPast ? 'text-outline hover:border hover:border-outline-variant cursor-not-allowed' : ''}
                ${isSelected ? 'bg-secondary text-background' : ''}
                ${!isPast && !isSelected ? 'text-on-surface hover:bg-surface' : ''}
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
