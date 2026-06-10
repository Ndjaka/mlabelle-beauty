import { Button } from '@/components/ui/button'
import { DashboardAgendaPreview } from '@/components/ui/dashboard/dashboard-agenda-preview'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { DashboardQuickActions } from '@/components/ui/dashboard/dashboard-quick-actions'
import { DashboardRecentBookings } from '@/components/ui/dashboard/dashboard-recent-bookings'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import { DashboardStats } from '@/components/ui/dashboard/dashboard-stats'
import type {
  DashboardData,
  DashboardQuickAction,
} from '@/types/dashboard'

const quickActions: DashboardQuickAction[] = [
  { label: 'Prestations', description: 'Prix, durées et descriptions.', href: '#quick-actions', icon: 'content_cut' },
  { label: 'Horaires', description: 'Créneaux ouverts à la réservation.', href: '#quick-actions', icon: 'schedule' },
  { label: 'Jour off', description: 'Bloquer une journée indisponible.', href: '#quick-actions', icon: 'event_busy' },
  { label: 'Portfolio', description: 'Photos visibles par les clientes.', href: '#quick-actions', icon: 'photo_library' },
]

type DashboardPreviewProps = {
  data: DashboardData
}

export function DashboardPreview({ data }: DashboardPreviewProps) {
  const navItems = getDashboardNavItems('dashboard')
  const mobileNavItems = getDashboardMobileNavItems('dashboard')

  return (
    <DashboardShell dateLabel={data.dateLabel} navItems={navItems} mobileNavItems={mobileNavItems}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 md:px-8 lg:px-10 lg:py-8">
        <section className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps text-secondary">{data.dateLabel}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Bonjour Darlene
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
              Voici le suivi de la journée, les nouvelles réservations et les accès rapides de gestion.
            </p>
          </div>
          <Button href="/agenda" className="w-full md:w-auto">
            Voir l’agenda
          </Button>
        </section>

        <DashboardStats metrics={data.metrics} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <DashboardAgendaPreview items={data.agendaItems} dateLabel={data.dateLabel} />
          <div id="recent-bookings">
            <DashboardRecentBookings bookings={data.recentBookings} />
          </div>
        </div>

        <div id="quick-actions">
          <DashboardQuickActions actions={quickActions} />
        </div>
      </div>
    </DashboardShell>
  )
}
