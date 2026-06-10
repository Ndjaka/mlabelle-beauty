import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import type { DashboardAgendaItem } from '@/types/dashboard'

type DashboardAgendaPreviewProps = {
  items: DashboardAgendaItem[]
  dateLabel: string
}

const MAX_PREVIEW_ITEMS = 4

function getBookingItems(items: DashboardAgendaItem[]): DashboardAgendaItem[] {
  return items.filter((item) => item.kind === 'booking').slice(0, MAX_PREVIEW_ITEMS)
}

export function DashboardAgendaPreview({ items, dateLabel }: DashboardAgendaPreviewProps) {
  const bookings = getBookingItems(items)

  return (
    <section className="border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-outline-variant pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-caps text-secondary">Aujourd’hui</p>
          <h2 className="mt-2 font-serif text-3xl text-foreground">Aperçu agenda</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/60">{dateLabel}</p>
        </div>
        <Button href="/agenda" variant="outline" size="sm" className="w-full md:w-auto">
          Voir tout l’agenda
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-outline-variant bg-background px-4 py-6 text-sm leading-6 text-foreground/55">
          Aucun rendez-vous prévu aujourd’hui.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((item) => (
            <article key={`${item.time}-${item.endTime}`} className="border border-outline-variant bg-background p-4">
              {item.kind === 'booking' && (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground/55">
                      {item.time} - {item.endTime}
                    </p>
                    <h3 className="mt-1 font-semibold text-foreground">{item.service}</h3>
                    <p className="mt-1 text-sm text-foreground/65">{item.client}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
