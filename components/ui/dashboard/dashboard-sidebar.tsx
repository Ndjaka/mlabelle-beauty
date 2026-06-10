import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import type { DashboardNavItem } from '@/types/dashboard'
import { cn } from '@/lib/utils'

type DashboardSidebarProps = {
  items: DashboardNavItem[]
}

export function DashboardSidebar({ items }: DashboardSidebarProps) {
  return (
    <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-outline-variant bg-surface-container-low px-6 py-8 lg:flex lg:flex-col">
      <div className="mb-10">
        <Logo />
        <p className="mt-3 text-sm leading-6 text-foreground/60">
          Espace privé coiffeuse
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Navigation dashboard">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 border border-transparent px-4 py-3 text-sm font-medium text-foreground/70 transition-colors hover:border-secondary/30 hover:text-foreground',
              item.active && 'border-secondary/40 bg-primary text-foreground'
            )}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-outline-variant pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center bg-tertiary text-sm font-semibold text-white">
            DM
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Darlene Meyer</p>
            <p className="text-xs text-foreground/55">Administratrice</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-5 flex w-full items-center gap-2 text-left text-xs font-semibold uppercase text-foreground/50 transition-colors hover:text-secondary"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            logout
          </span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
