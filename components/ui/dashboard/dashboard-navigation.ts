import type { DashboardNavItem } from '@/types/dashboard'

type DashboardNavKey =
  | 'dashboard'
  | 'agenda'
  | 'bookings'
  | 'services'
  | 'schedule'
  | 'days-off'
  | 'portfolio'

const dashboardNavItems: Array<Omit<DashboardNavItem, 'active'> & { key: DashboardNavKey }> = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { key: 'agenda', label: 'Agenda', href: '/agenda', icon: 'calendar_month' },
  { key: 'bookings', label: 'Réservations', href: '/dashboard#recent-bookings', icon: 'event_available' },
  { key: 'services', label: 'Prestations', href: '/dashboard#quick-actions', icon: 'content_cut' },
  { key: 'schedule', label: 'Horaires', href: '/dashboard#quick-actions', icon: 'schedule' },
  { key: 'days-off', label: 'Jours off', href: '/dashboard#quick-actions', icon: 'event_busy' },
  { key: 'portfolio', label: 'Portfolio', href: '/dashboard#quick-actions', icon: 'photo_library' },
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
