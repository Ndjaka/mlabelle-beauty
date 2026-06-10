import Link from 'next/link'
import type { DashboardQuickAction } from '@/types/dashboard'

type DashboardQuickActionsProps = {
  actions: DashboardQuickAction[]
}

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <section className="border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <div className="mb-5">
        <p className="label-caps text-secondary">Gestion</p>
        <h2 className="mt-2 font-serif text-3xl text-foreground">Accès rapide</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group border border-outline-variant bg-background p-4 transition-colors hover:border-secondary"
          >
            <span className="material-symbols-outlined text-[24px] text-secondary" aria-hidden="true">
              {action.icon}
            </span>
            <h3 className="mt-4 font-semibold text-foreground">{action.label}</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/60">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
