'use client'

import { AgendaMobileBookingCard } from '@/components/ui/dashboard/agenda/agenda-mobile-booking-card'
import { cn } from '@/lib/utils'
import {
  getMobileAgendaDayDurationClass,
  getMobileAgendaDayOffsetClass,
} from '@/features/dashboard/utils'
import type { DashboardAgendaHourRow, DashboardAgendaItem } from '@/types/dashboard'

type AgendaMobileListProps = {
  rows: DashboardAgendaHourRow[]
  onBookingClick?: (booking: DashboardAgendaItem) => void
}

export function AgendaMobileList({ rows, onBookingClick }: AgendaMobileListProps) {
  const hasAgendaItems = rows.some((row) => row.items.length > 0)

  if (!hasAgendaItems) {
    return (
      <div className="border border-dashed border-outline-variant bg-background px-4 py-6 text-sm leading-6 text-foreground/55 md:hidden">
        Aucun rendez-vous prévu aujourd’hui.
      </div>
    )
  }

  return (
    <div className="border border-outline-variant bg-background md:hidden">
      {rows.map((row) => (
        <div key={row.hour} className="grid h-24 grid-cols-[52px_minmax(0,1fr)]">
          <div className="border-r border-t border-outline-variant px-2 pt-3 text-[11px] font-semibold text-foreground/50">
            {row.hour}
          </div>
          <div className="relative border-t border-outline-variant bg-surface-container-low/25">
            {row.items.map((item, index) => (
              <div
                key={`${item.kind}-${item.time}-${item.endTime}-${index}`}
                className={cn(
                  'absolute left-2 right-2 z-10',
                  getMobileAgendaDayOffsetClass(item.time),
                  getMobileAgendaDayDurationClass(item.time, item.endTime)
                )}
              >
                <AgendaMobileBookingCard
                  item={item}
                  variant="day"
                  onClick={
                    item.kind === 'booking' && onBookingClick
                      ? () => onBookingClick(item)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
