import { Button } from '@/components/ui/button'
import { AdminCreateBookingButton } from '@/components/ui/dashboard/admin-booking/admin-create-booking-button'
import type { Service } from '@/types/service'

type ReservationsPageHeaderProps = {
  services: Service[]
  initialDateKey: string
}

export function ReservationsPageHeader({
  services,
  initialDateKey,
}: ReservationsPageHeaderProps) {
  return (
    <section className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="label-caps text-secondary">Suivi admin</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
          Réservations
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
          Retrouvez toutes les demandes, les rendez-vous confirmés et les annulations du salon.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
        <AdminCreateBookingButton services={services} initialDateKey={initialDateKey} />
        <Button href="/agenda" variant="outline" className="w-full md:w-auto">
          Voir l’agenda
        </Button>
      </div>
    </section>
  )
}
