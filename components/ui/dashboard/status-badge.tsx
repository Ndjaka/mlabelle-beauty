import { cn } from '@/lib/utils'
import type { DashboardBookingStatus } from '@/types/dashboard'

type StatusBadgeProps = {
  status: DashboardBookingStatus
}

const statusClassNames: Record<DashboardBookingStatus, string> = {
  Confirmé: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Annulé: 'border-red-200 bg-red-50 text-red-700',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center border px-2.5 py-1 text-[11px] font-semibold uppercase',
        statusClassNames[status]
      )}
    >
      {status}
    </span>
  )
}
