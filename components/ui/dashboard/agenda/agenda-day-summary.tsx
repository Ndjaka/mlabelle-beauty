import type { DashboardAgendaSummary } from '@/types/dashboard'

type AgendaDaySummaryProps = {
  summary: DashboardAgendaSummary
}

export function AgendaDaySummary({ summary }: AgendaDaySummaryProps) {
  return (
    <aside className="hidden border border-outline-variant bg-background p-4 xl:block">
      <div className="border-b border-outline-variant pb-4">
        <p className="label-caps text-secondary">Résumé</p>
        <h3 className="mt-2 font-serif text-2xl text-foreground">Aujourd’hui</h3>
      </div>

      <div className="space-y-4 py-5">
        <SummaryLine label="Rendez-vous" value={String(summary.bookingCount)} />
        <SummaryLine label="À confirmer" value={String(summary.pendingCount)} />
        <SummaryLine label="Total estimé" value={summary.totalEstimate} />
      </div>

      <div className="border-t border-outline-variant pt-4">
        <p className="text-xs font-semibold uppercase text-foreground/45">Prochain rendez-vous</p>
        <p className="mt-3 font-serif text-xl leading-snug text-foreground">
          {summary.nextBookingTime ?? '--:--'}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/60">{summary.nextBookingLabel}</p>
      </div>
    </aside>
  )
}

type SummaryLineProps = {
  label: string
  value: string
}

function SummaryLine({ label, value }: SummaryLineProps) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-foreground/55">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}
