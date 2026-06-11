import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import { cn } from '@/lib/utils'
import type { DashboardAgendaItem, DashboardBookingStatus } from '@/types/dashboard'

type AgendaBookingBlockProps = {
  item: DashboardAgendaItem
  compact?: boolean
  onClick?: () => void
  className?: string
}

const statusClassNames: Record<DashboardBookingStatus, string> = {
  'À confirmer': 'border-l-amber-300 bg-amber-50/80',
  Confirmé: 'border-l-secondary bg-primary',
  Annulé: 'border-l-red-300 bg-red-50/80',
}

export function AgendaBookingBlock({ item, compact = false, onClick, className }: AgendaBookingBlockProps) {
  if (item.kind === 'free') {
    return (
      <div className="border border-dashed border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-foreground/50">
        {item.label}
      </div>
    )
  }

  const Component = onClick ? 'button' : 'article'
  const interactiveClasses = onClick
    ? 'cursor-pointer text-left w-full transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
    : ''

  if (compact) {
    return (
      <Component
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={cn(
          'block border border-l-4 border-outline-variant p-2 shadow-sm text-xs',
          interactiveClasses,
          statusClassNames[item.status],
          className
        )}
      >
        <p className="font-semibold text-foreground/55">{item.time}</p>
        <p className="mt-0.5 font-serif text-sm leading-tight text-foreground truncate">{item.service}</p>
        <p className="mt-0.5 text-foreground/55 truncate">{item.client}</p>
      </Component>
    )
  }

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'block border border-l-4 border-outline-variant px-3 py-2 shadow-sm flex flex-col',
        interactiveClasses,
        statusClassNames[item.status],
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-semibold text-foreground/55">
              {item.time} - {item.endTime}
            </p>
            <span className="text-[10px] text-foreground/45">•</span>
            <span className="text-[10px] text-foreground/55">{item.duration}</span>
          </div>
          <h3 className="mt-0.5 truncate font-serif text-base leading-tight text-foreground">{item.service}</h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <p className="truncate text-[11px] text-foreground/65">{item.client}</p>
            <span className="text-[10px] text-foreground/45">•</span>
            <span className="text-[11px] font-semibold text-foreground">{item.price}</span>
          </div>
        </div>
        <div className="shrink-0 mt-0.5">
          <StatusBadge status={item.status} />
        </div>
      </div>
    </Component>
  )
}
