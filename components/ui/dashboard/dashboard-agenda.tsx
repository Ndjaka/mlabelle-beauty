import { AgendaControls } from '@/components/ui/dashboard/agenda/agenda-controls'
import { AgendaDesktopGrid } from '@/components/ui/dashboard/agenda/agenda-desktop-grid'
import { AgendaMobileList } from '@/components/ui/dashboard/agenda/agenda-mobile-list'
import { AgendaWeekStrip } from '@/components/ui/dashboard/agenda/agenda-week-strip'
import { buildDashboardAgendaHourRows } from '@/features/dashboard/utils'
import type { DashboardAgendaDay, DashboardAgendaItem } from '@/types/dashboard'

type DashboardAgendaProps = {
  items: DashboardAgendaItem[]
  days: DashboardAgendaDay[]
  dateLabel: string
}

function countBookings(items: DashboardAgendaItem[]): number {
  return items.filter((item) => item.kind === 'booking').length
}

export function DashboardAgenda({ items, days, dateLabel }: DashboardAgendaProps) {
  const rows = buildDashboardAgendaHourRows(items)

  return (
    <section className="space-y-5 border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <AgendaControls dateLabel={dateLabel} bookingCount={countBookings(items)} />
      <AgendaWeekStrip days={days} />
      <AgendaDesktopGrid rows={rows} />
      <AgendaMobileList rows={rows} />
    </section>
  )
}
