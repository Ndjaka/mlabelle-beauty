import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import { cn } from '@/lib/utils'
import type { DashboardAgendaItem, DashboardBookingStatus } from '@/types/dashboard'

type AgendaBookingBlockProps = {
  item: DashboardAgendaItem
  compact?: boolean
}

const statusClassNames: Record<DashboardBookingStatus, string> = {
  'À confirmer': 'border-l-amber-300 bg-amber-50/80',
  Confirmé: 'border-l-secondary bg-primary',
  Annulé: 'border-l-red-300 bg-red-50/80',
}

export function AgendaBookingBlock({ item, compact = false }: AgendaBookingBlockProps) {
  if (item.kind === 'free') {
    return (
      <div className="border border-dashed border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-foreground/50">
        {item.label}
      </div>
    )
  }

  if (compact) {
    return (
      <article className={cn('border border-l-4 border-outline-variant p-2 shadow-sm text-xs', statusClassNames[item.status])}>
        <p className="font-semibold text-foreground/55">{item.time}</p>
        <p className="mt-0.5 font-serif text-sm leading-tight text-foreground truncate">{item.service}</p>
        <p className="mt-0.5 text-foreground/55 truncate">{item.client}</p>
      </article>
    )
  }

  return (
    <article className={cn('border border-l-4 border-outline-variant p-4 shadow-sm', statusClassNames[item.status])}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-foreground/55">
            {item.time} - {item.endTime}
          </p>
          <h3 className="mt-1 font-serif text-xl text-foreground">{item.service}</h3>
          <p className="mt-1 text-sm text-foreground/65">{item.client}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground/55">
        <span>{item.duration}</span>
        <span className="font-semibold text-foreground">{item.price}</span>
      </div>
    </article>
  )
}
