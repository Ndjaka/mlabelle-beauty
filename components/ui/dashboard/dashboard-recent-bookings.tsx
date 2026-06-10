import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import type { DashboardRecentBooking } from '@/types/dashboard'

type DashboardRecentBookingsProps = {
  bookings: DashboardRecentBooking[]
}

export function DashboardRecentBookings({ bookings }: DashboardRecentBookingsProps) {
  return (
    <section className="border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <div className="mb-5">
        <p className="label-caps text-secondary">Suivi</p>
        <h2 className="mt-2 font-serif text-3xl text-foreground">Nouvelles réservations</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-outline-variant bg-background px-4 py-6 text-sm leading-6 text-foreground/55">
          Aucune nouvelle réservation cette semaine.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={`${booking.client}-${booking.time}`} className="border border-outline-variant bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{booking.client}</h3>
                  <p className="mt-1 text-sm text-foreground/65">{booking.service}</p>
                </div>
                <StatusBadge status="Confirmé" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-foreground/65">
                <p>{booking.date}</p>
                <p className="text-right">{booking.time}</p>
                <p className="font-semibold text-foreground">{booking.price}</p>
                <p className="text-right text-xs">{booking.note}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" className="bg-tertiary px-3 py-3 text-xs font-semibold uppercase text-white">
                  Voir détail
                </button>
                <button type="button" className="border border-outline-variant px-3 py-3 text-xs font-semibold uppercase text-foreground">
                  Annuler
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
