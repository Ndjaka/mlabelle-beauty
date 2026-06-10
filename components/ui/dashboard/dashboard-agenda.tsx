import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import type { DashboardAgendaItem } from '@/types/dashboard'

type DashboardAgendaProps = {
  items: DashboardAgendaItem[]
}

export function DashboardAgenda({ items }: DashboardAgendaProps) {
  return (
    <section className="border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="label-caps text-secondary">Aujourd’hui</p>
          <h2 className="mt-2 font-serif text-3xl text-foreground">Agenda du jour</h2>
        </div>
        <button
          type="button"
          className="hidden border border-secondary/40 px-4 py-3 text-xs font-semibold uppercase text-foreground transition-colors hover:border-secondary md:inline-flex"
        >
          Vue semaine
        </button>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-outline-variant bg-background px-4 py-6 text-sm leading-6 text-foreground/55">
          Aucun rendez-vous prévu aujourd’hui.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.time}-${item.endTime}`} className="grid grid-cols-[72px_1fr] gap-3 md:grid-cols-[96px_1fr]">
              <div className="pt-4 text-xs font-semibold text-foreground/55">
                <p>{item.time}</p>
                <p className="mt-1">{item.endTime}</p>
              </div>

              {item.kind === 'free' ? (
                <div className="border border-dashed border-outline-variant bg-background px-4 py-4 text-sm text-foreground/45">
                  {item.label}
                </div>
              ) : (
                <article className="border border-secondary/30 bg-background p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{item.service}</h3>
                      <p className="mt-1 text-sm text-foreground/65">{item.client}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground/55">
                    <span>{item.duration}</span>
                    <span className="font-semibold text-foreground">{item.price}</span>
                  </div>
                </article>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
