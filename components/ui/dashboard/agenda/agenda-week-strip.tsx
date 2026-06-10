import { cn } from '@/lib/utils'
import type { DashboardAgendaDay } from '@/types/dashboard'

type AgendaWeekStripProps = {
  days: DashboardAgendaDay[]
  onDayClick: (dateKey: string) => void
}

export function AgendaWeekStrip({ days, onDayClick }: AgendaWeekStripProps) {
  return (
    <div className="grid grid-cols-7 border border-outline-variant bg-background" aria-label="Semaine affichée">
      {days.map((day) => (
        <button
          key={day.dateKey}
          type="button"
          aria-pressed={day.active}
          onClick={() => onDayClick(day.dateKey)}
          className={cn(
            'flex min-h-20 flex-col items-center justify-center gap-1 border-r border-outline-variant px-1 text-center last:border-r-0',
            'transition-colors hover:bg-primary',
            day.active && 'bg-tertiary text-white hover:bg-tertiary'
          )}
        >
          <span className={cn('text-[11px] font-semibold uppercase text-foreground/50', day.active && 'text-white/60')}>
            {day.weekdayLabel}
          </span>
          <span className="font-serif text-2xl leading-none">{day.dayNumber}</span>
        </button>
      ))}
    </div>
  )
}
