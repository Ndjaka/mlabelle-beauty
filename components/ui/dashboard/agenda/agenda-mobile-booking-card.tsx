'use client'

import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import { cn } from '@/lib/utils'
import type { DashboardAgendaItem, DashboardBookingStatus } from '@/types/dashboard'

type AgendaMobileBookingCardProps = {
  item: DashboardAgendaItem
  variant: 'day' | 'week'
  onClick?: () => void
  className?: string
}

const bookingStatusClassNames: Record<DashboardBookingStatus, string> = {
  'À confirmer': 'border-l-amber-300 bg-amber-50/95',
  Confirmé: 'border-l-secondary bg-primary',
  Annulé: 'border-l-red-300 bg-red-50/95',
}

export function AgendaMobileBookingCard({
  item,
  variant,
  onClick,
  className,
}: AgendaMobileBookingCardProps) {
  if (item.kind === 'free') {
    return (
      <div
        className={cn(
          'block h-full w-full min-w-0 max-w-full border border-dashed border-outline-variant bg-surface-container-low px-2 py-2 text-xs text-foreground/55',
          className
        )}
      >
        {item.label}
      </div>
    )
  }

  const cardClassName = cn(
    'block h-full w-full min-w-0 max-w-full overflow-hidden border border-l-4 border-outline-variant shadow-sm',
    'text-left transition-all',
    variant === 'day' ? 'px-3 py-2' : 'px-2 py-1.5',
    onClick && 'cursor-pointer hover:shadow-md active:scale-[0.99]',
    bookingStatusClassNames[item.status],
    className
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClassName}>
        <AgendaMobileBookingContent item={item} variant={variant} />
      </button>
    )
  }

  return (
    <article className={cardClassName}>
      <AgendaMobileBookingContent item={item} variant={variant} />
    </article>
  )
}

function AgendaMobileBookingContent({
  item,
  variant,
}: {
  item: Extract<DashboardAgendaItem, { kind: 'booking' }>
  variant: 'day' | 'week'
}) {
  if (variant === 'week') {
    return (
      <div className="w-full min-w-0 max-w-full">
        <p className="truncate text-[10px] font-semibold leading-tight text-foreground/55">
          {item.time}
        </p>
        <p className="mt-0.5 truncate font-serif text-sm leading-tight text-foreground">
          {item.service}
        </p>
        <p className="mt-0.5 truncate text-[11px] leading-tight text-foreground/55">
          {item.client}
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-w-0 flex-col justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground/55">
          <span>{item.time}</span>
          <span>-</span>
          <span>{item.endTime}</span>
          <span className="text-foreground/35">•</span>
          <span>{item.duration}</span>
        </div>
        <h3 className="mt-1 truncate font-serif text-lg leading-tight text-foreground">
          {item.service}
        </h3>
        <p className="mt-0.5 truncate text-xs text-foreground/60">{item.client}</p>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">{item.price}</span>
        <StatusBadge status={item.status} />
      </div>
    </div>
  )
}
