import { cn } from '@/lib/utils'
import type { DashboardAgendaMonth } from '@/types/dashboard'

type AgendaMiniMonthProps = {
  month: DashboardAgendaMonth
  onDayClick: (dateKey: string) => void
}

const weekdayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function AgendaMiniMonth({ month, onDayClick }: AgendaMiniMonthProps) {
  return (
    <aside className="hidden border border-outline-variant bg-background p-4 xl:block">
      <div className="mb-4">
        <p className="label-caps text-secondary">Mois</p>
        <h3 className="mt-2 font-serif text-2xl text-foreground">{month.label}</h3>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayLabels.map((weekday, index) => (
          <span key={`${weekday}-${index}`} className="py-2 text-[11px] font-semibold uppercase text-foreground/45">
            {weekday}
          </span>
        ))}

        {month.days.map((day) => (
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
