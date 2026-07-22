import { describe, expect, it } from 'vitest'
import {
  dashboardQuickActions,
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'

describe('dashboard navigation', () => {
  it('exposes every implemented admin section in the full navigation', () => {
    const items = getDashboardNavItems('dashboard')

    expect(items.map((item) => item.href)).toEqual([
      '/dashboard',
      '/agenda',
      '/reservations',
      '/services',
      '/categories',
      '/schedule',
    ])
  })

  it('keeps the mobile bottom bar limited to four primary destinations', () => {
    const items = getDashboardMobileNavItems('services')

    expect(items).toHaveLength(4)
    expect(items.find((item) => item.href === '/services')?.active).toBe(true)
  })

  it('links dashboard shortcuts to their real destinations', () => {
    expect(dashboardQuickActions).toMatchObject([
      { label: 'Prestations', href: '/services' },
      { label: 'Horaires', href: '/schedule#opening-hours' },
      { label: 'Jour off', href: '/schedule#days-off' },
      { label: 'Portfolio', badge: 'Bientôt' },
    ])
    expect(dashboardQuickActions.at(-1)?.href).toBeUndefined()
  })
})
