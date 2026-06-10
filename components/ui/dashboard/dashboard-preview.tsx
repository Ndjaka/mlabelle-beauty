import { Button } from '@/components/ui/button'
import { DashboardAgenda } from '@/components/ui/dashboard/dashboard-agenda'
import { DashboardBottomNav } from '@/components/ui/dashboard/dashboard-bottom-nav'
import { DashboardMobileHeader } from '@/components/ui/dashboard/dashboard-mobile-header'
import { DashboardQuickActions } from '@/components/ui/dashboard/dashboard-quick-actions'
import { DashboardRecentBookings } from '@/components/ui/dashboard/dashboard-recent-bookings'
import { DashboardSidebar } from '@/components/ui/dashboard/dashboard-sidebar'
import { DashboardStats } from '@/components/ui/dashboard/dashboard-stats'
import type {
  DashboardAgendaItem,
  DashboardMetric,
  DashboardNavItem,
  DashboardQuickAction,
  DashboardRecentBooking,
} from '@/components/ui/dashboard/types'

const dateLabel = 'Mercredi 10 juin 2026'

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

const metrics: DashboardMetric[] = [
  { label: 'Aujourd’hui', value: '5', detail: 'rendez-vous prévus', tone: 'neutral' },
  { label: 'Nouvelles', value: '3', detail: 'réservations cette semaine', tone: 'gold' },
  { label: 'Mois en cours', value: '1 240 €', detail: 'chiffre estimé', tone: 'dark' },
  { label: 'Remplissage', value: '72%', detail: 'sur les créneaux ouverts', tone: 'neutral' },
]

const agendaItems: DashboardAgendaItem[] = [
  { kind: 'booking', time: '09:00', endTime: '09:45', service: 'Brushing', client: 'Camille Laurent', duration: '45 min', status: 'Confirmé', price: '35,00 €' },
  { kind: 'free', time: '09:45', endTime: '10:30', label: 'Créneau libre' },
  { kind: 'booking', time: '10:30', endTime: '11:30', service: 'Coupe femme', client: 'Inès Moreau', duration: '1h', status: 'Confirmé', price: '55,00 €' },
  { kind: 'booking', time: '14:00', endTime: '16:15', service: 'Coloration', client: 'Sophie Martin', duration: '2h15', status: 'Confirmé', price: '120,00 €' },
  { kind: 'free', time: '16:15', endTime: '17:00', label: 'Disponible pour une réservation' },
]

const recentBookings: DashboardRecentBooking[] = [
  { client: 'Inès Moreau', service: 'Coupe femme', date: 'Aujourd’hui', time: '10:30', price: '55,00 €', note: 'créée hier' },
  { client: 'Nadia Benali', service: 'Soin profond', date: 'Demain', time: '13:00', price: '45,00 €', note: 'créée il y a 2h' },
]

const quickActions: DashboardQuickAction[] = [
  { label: 'Prestations', description: 'Prix, durées et descriptions.', href: '#quick-actions', icon: 'content_cut' },
  { label: 'Horaires', description: 'Créneaux ouverts à la réservation.', href: '#quick-actions', icon: 'schedule' },
  { label: 'Jour off', description: 'Bloquer une journée indisponible.', href: '#quick-actions', icon: 'event_busy' },
  { label: 'Portfolio', description: 'Photos visibles par les clientes.', href: '#quick-actions', icon: 'photo_library' },
]

export function DashboardPreview() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardMobileHeader dateLabel={dateLabel} />
      <div className="flex">
        <DashboardSidebar items={navItems} />

        <main className="w-full pb-24 lg:pb-0">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 md:px-8 lg:px-10 lg:py-8">
            <section className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label-caps text-secondary">{dateLabel}</p>
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

            <DashboardStats metrics={metrics} />

            <div id="agenda" className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <DashboardAgenda items={agendaItems} />
              <div id="recent-bookings">
                <DashboardRecentBookings bookings={recentBookings} />
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
