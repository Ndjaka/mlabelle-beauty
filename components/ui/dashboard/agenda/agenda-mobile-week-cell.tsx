'use client'

import { AgendaMobileBookingCard } from '@/components/ui/dashboard/agenda/agenda-mobile-booking-card'
import { cn } from '@/lib/utils'
import {
  getMobileAgendaWeekDurationClass,
  getMobileAgendaWeekOffsetClass,
} from '@/features/dashboard/utils'
import type { DashboardAgendaItem, DashboardAgendaWeekColumn } from '@/types/dashboard'

type AgendaMobileWeekCellProps = {
  column: DashboardAgendaWeekColumn
  hour: string
  selected: boolean
  className?: string
  onBookingClick?: (booking: DashboardAgendaItem) => void
}

export function AgendaMobileWeekCell({
  column,
  hour,
  selected,
  className,
  onBookingClick,
}: AgendaMobileWeekCellProps) {
  const hourItems = column.items.filter((item) => {
    const [itemHour] = item.time.split(':')
    return `${itemHour?.padStart(2, '0')}:00` === hour
  })

  return (
    <div
      className={cn(
        'relative h-full border-r border-t border-outline-variant last:border-r-0',
        selected && 'bg-tertiary/5',
        className
      )}
    >
      {hourItems.map((item, index) => (
        <div
          key={`${item.kind}-${item.time}-${item.endTime}-${index}`}
          className={cn(
            'absolute left-0.5 right-0.5 z-10 min-w-0 max-w-full',
            getMobileAgendaWeekOffsetClass(item.time),
            getMobileAgendaWeekDurationClass(item.time, item.endTime)
          )}
        >
          <AgendaMobileBookingCard
            item={item}
            variant="week"
            onClick={
              item.kind === 'booking' && onBookingClick ? () => onBookingClick(item) : undefined
            }
          />
        </div>
      ))}
    </div>
  )
}
