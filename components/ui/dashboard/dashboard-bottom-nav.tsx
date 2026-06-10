import Link from 'next/link'
import type { DashboardNavItem } from '@/types/dashboard'
import { cn } from '@/lib/utils'

type DashboardBottomNavProps = {
  items: DashboardNavItem[]
}

export function DashboardBottomNav({ items }: DashboardBottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-outline-variant bg-background/95 px-3 py-2 backdrop-blur lg:hidden" aria-label="Navigation mobile">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex min-h-14 flex-col items-center justify-center gap-1 px-2 text-[11px] font-semibold text-foreground/55',
              item.active && 'bg-primary text-foreground'
            )}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
