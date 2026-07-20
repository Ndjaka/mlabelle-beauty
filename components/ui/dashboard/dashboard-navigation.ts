import type { DashboardNavItem, DashboardQuickAction } from '@/types/dashboard'

type DashboardNavKey =
  | 'dashboard'
  | 'agenda'
  | 'bookings'
  | 'services'
  | 'schedule'

const dashboardNavItems: Array<Omit<DashboardNavItem, 'active'> & { key: DashboardNavKey }> = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { key: 'agenda', label: 'Agenda', href: '/agenda', icon: 'calendar_month' },
  { key: 'bookings', label: 'Réservations', href: '/reservations', icon: 'event_available' },
  { key: 'services', label: 'Prestations', href: '/services', icon: 'content_cut' },
  { key: 'schedule', label: 'Horaires & jours off', href: '/schedule', icon: 'schedule' },
]

export const dashboardQuickActions: DashboardQuickAction[] = [
  {
    label: 'Prestations',
    description: 'Prix, durées et descriptions.',
    href: '/services',
    icon: 'content_cut',
  },
  {
    label: 'Horaires',
    description: 'Créneaux ouverts à la réservation.',
    href: '/schedule#opening-hours',
    icon: 'schedule',
  },
  {
    label: 'Jour off',
    description: 'Bloquer une journée indisponible.',
    href: '/schedule#days-off',
    icon: 'event_busy',
  },
  {
    label: 'Portfolio',
    description: 'Photos visibles par les clientes.',
    icon: 'photo_library',
    badge: 'Bientôt',
  },
]

export function getDashboardNavItems(activeKey: DashboardNavKey): DashboardNavItem[] {
  return dashboardNavItems.map((item) => ({
    label: item.label,
    href: item.href,
    icon: item.icon,
    active: item.key === activeKey,
  }))
}

export function getDashboardMobileNavItems(activeKey: DashboardNavKey): DashboardNavItem[] {
  return getDashboardNavItems(activeKey).slice(0, 4)
}
