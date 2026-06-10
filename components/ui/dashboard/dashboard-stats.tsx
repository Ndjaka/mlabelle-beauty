import type { DashboardMetric } from '@/types/dashboard'
import { cn } from '@/lib/utils'

type DashboardStatsProps = {
  metrics: DashboardMetric[]
}

const toneClassNames: Record<DashboardMetric['tone'], string> = {
  neutral: 'bg-surface-container-low',
  gold: 'bg-secondary/10',
  dark: 'bg-tertiary text-white',
}

export function DashboardStats({ metrics }: DashboardStatsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Résumé du dashboard">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className={cn(
            'border border-outline-variant p-4 md:p-5',
            toneClassNames[metric.tone]
          )}
        >
          <p className={cn('text-xs font-semibold uppercase text-foreground/55', metric.tone === 'dark' && 'text-white/65')}>
            {metric.label}
          </p>
          <p className="mt-3 font-serif text-3xl leading-none md:text-4xl">{metric.value}</p>
          <p className={cn('mt-3 text-xs leading-5 text-foreground/60', metric.tone === 'dark' && 'text-white/70')}>
            {metric.detail}
          </p>
        </article>
      ))}
    </section>
  )
}
