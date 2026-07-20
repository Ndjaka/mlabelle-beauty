import Link from 'next/link'
import { DashboardMobileMenu } from '@/components/ui/dashboard/dashboard-mobile-menu'
import { Logo } from '@/components/ui/logo'
import type { DashboardNavItem } from '@/types/dashboard'

type DashboardMobileHeaderProps = {
  dateLabel: string
  items: DashboardNavItem[]
}

export function DashboardMobileHeader({ dateLabel, items }: DashboardMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-[86px] border-b border-outline-variant bg-background/95 px-5 backdrop-blur lg:hidden">
      <div className="flex h-full items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" aria-label="Retour au dashboard" className="inline-flex">
            <Logo size="sm" priority />
          </Link>
          <p className="mt-1 text-xs text-foreground/55">{dateLabel}</p>
        </div>
        <DashboardMobileMenu items={items} />
      </div>
    </header>
  )
}
