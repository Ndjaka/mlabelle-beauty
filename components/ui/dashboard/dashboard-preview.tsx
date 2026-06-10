import { Button } from '@/components/ui/button'
import { DashboardAgenda } from '@/components/ui/dashboard/dashboard-agenda'
import { DashboardBottomNav } from '@/components/ui/dashboard/dashboard-bottom-nav'
import { DashboardMobileHeader } from '@/components/ui/dashboard/dashboard-mobile-header'
import { DashboardQuickActions } from '@/components/ui/dashboard/dashboard-quick-actions'
import { DashboardRecentBookings } from '@/components/ui/dashboard/dashboard-recent-bookings'
import { DashboardSidebar } from '@/components/ui/dashboard/dashboard-sidebar'
import { DashboardStats } from '@/components/ui/dashboard/dashboard-stats'
import type {
  DashboardData,
  DashboardNavItem,
  DashboardQuickAction,
} from '@/types/dashboard'

const navItems: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', active: true },
  { label: 'Agenda', href: '#agenda', icon: 'calendar_month' },
  { label: 'Réservations', href: '#recent-bookings', icon: 'event_available' },
  { label: 'Prestations', href: '#quick-actions', icon: 'content_cut' },
  { label: 'Horaires', href: '#quick-actions', icon: 'schedule' },
  { label: 'Jours off', href: '#quick-actions', icon: 'event_busy' },
  { label: 'Portfolio', href: '#quick-actions', icon: 'photo_library' },
]

const mobileNavItems = navItems.slice(0, 4)

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardMobileHeader dateLabel={data.dateLabel} />
      <div className="flex">
        <DashboardSidebar items={navItems} />

        <main className="w-full pb-24 lg:pb-0">
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
              <Button href="#agenda" className="w-full md:w-auto">
                Bloquer un créneau
              </Button>
            </section>

            <DashboardStats metrics={data.metrics} />

            <div id="agenda" className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <DashboardAgenda
                items={data.agendaItems}
                days={data.agendaDays}
                dateLabel={data.dateLabel}
              />
              <div id="recent-bookings">
                <DashboardRecentBookings bookings={data.recentBookings} />
              </div>
            </div>

            <div id="quick-actions">
              <DashboardQuickActions actions={quickActions} />
            </div>
          </div>
        </main>
      </div>
      <DashboardBottomNav items={mobileNavItems} />
    </div>
  )
}
