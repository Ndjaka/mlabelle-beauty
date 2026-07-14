import { ReservationCard } from '@/components/ui/dashboard/reservations/reservation-card'
import type { DashboardRecentBooking } from '@/types/dashboard'

type ReservationListProps = {
  reservations: DashboardRecentBooking[]
  onOpen: (reservation: DashboardRecentBooking) => void
}

export function ReservationList({ reservations, onOpen }: ReservationListProps) {
  if (reservations.length === 0) {
    return (
      <div className="border border-dashed border-outline-variant bg-background px-4 py-8 text-sm leading-6 text-foreground/55">
        Aucune réservation ne correspond à ces critères.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} onOpen={onOpen} />
      ))}
    </div>
  )
}
