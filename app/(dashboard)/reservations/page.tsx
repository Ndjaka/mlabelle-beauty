import { ReservationsPage } from '@/components/ui/dashboard/reservations-page'
import { getDashboardReservations } from '@/features/dashboard/queries'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const reservations = await getDashboardReservations()

  return <ReservationsPage reservations={reservations} />
}
