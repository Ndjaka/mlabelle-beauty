import { BookingProgressPills } from '@/components/ui/booking/booking-progress-pills'

interface BookingFormHeaderProps {
  titleClassName: string
}

export function BookingFormHeader({ titleClassName }: BookingFormHeaderProps) {
  return (
    <div className="mb-xl">
      <div className="mb-5 max-w-[520px]">
        <BookingProgressPills currentStep={2} />
      </div>
      <h1 className={titleClassName}>Vos coordonnées</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Dernière étape avant d’envoyer votre demande de réservation. Le récapitulatif reste visible pour vérifier votre choix.
      </p>
    </div>
  )
}
