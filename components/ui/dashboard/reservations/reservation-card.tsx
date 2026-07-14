import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import type { DashboardRecentBooking } from '@/types/dashboard'

type ReservationCardProps = {
  reservation: DashboardRecentBooking
  onOpen: (reservation: DashboardRecentBooking) => void
}

export function ReservationCard({ reservation, onOpen }: ReservationCardProps) {
  return (
    <article className="border border-outline-variant bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-serif text-2xl leading-tight text-foreground">{reservation.client}</p>
          <p className="mt-1 text-sm text-foreground/65">{reservation.service}</p>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="mt-5 grid gap-3 border-y border-outline-variant py-4 text-sm text-foreground/70 sm:grid-cols-4">
        <ReservationMeta icon="calendar_today" label="Date" value={reservation.date} />
        <ReservationMeta icon="schedule" label="Heure" value={reservation.time} />
        <ReservationMeta icon="timer" label="Durée" value={reservation.duration} />
        <ReservationMeta icon="payments" label="Prix" value={reservation.price} strong />
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm text-foreground/70 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-1">
          <a href={`mailto:${reservation.email}`} className="block truncate hover:underline">
            {reservation.email}
          </a>
          {reservation.phone && (
            <a href={`tel:${reservation.phone}`} className="block truncate hover:underline">
              {reservation.phone}
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={() => onOpen(reservation)}
          className="bg-tertiary px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-tertiary/90 md:w-auto"
        >
          Voir détail
        </button>
      </div>
    </article>
  )
}

type ReservationMetaProps = {
  icon: string
  label: string
  value: string
  strong?: boolean
}

function ReservationMeta({ icon, label, value, strong }: ReservationMetaProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="material-symbols-outlined mt-0.5 text-[18px] text-secondary" aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
          {label}
        </span>
        <span className={`mt-1 block ${strong ? 'font-semibold text-foreground' : ''}`}>{value}</span>
      </span>
    </div>
  )
}
