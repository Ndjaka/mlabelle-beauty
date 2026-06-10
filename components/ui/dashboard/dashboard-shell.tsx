import { DashboardBottomNav } from '@/components/ui/dashboard/dashboard-bottom-nav'
import { DashboardMobileHeader } from '@/components/ui/dashboard/dashboard-mobile-header'
import { DashboardSidebar } from '@/components/ui/dashboard/dashboard-sidebar'
import type { DashboardNavItem } from '@/types/dashboard'

type DashboardShellProps = {
  dateLabel: string
  navItems: DashboardNavItem[]
  mobileNavItems: DashboardNavItem[]
  children: React.ReactNode
}

export function DashboardShell({
  dateLabel,
  navItems,
  mobileNavItems,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardMobileHeader dateLabel={dateLabel} />
      <div className="flex">
        <DashboardSidebar items={navItems} />
        <main className="w-full pb-24 lg:pb-0">{children}</main>
      </div>
      <DashboardBottomNav items={mobileNavItems} />
    </div>
  )
}
