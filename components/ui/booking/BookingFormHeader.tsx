import { BookingProgressPills } from '@/components/ui/booking/booking-progress-pills'

export function BookingFormHeader() {
  return (
    <div className="mb-6 md:mb-8">
      <div className="mb-5 max-w-[520px] md:mb-6">
        <BookingProgressPills currentStep={2} />
      </div>
      <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
        Demande de réservation
      </p>
      <h1 className="mt-3 font-serif text-[34px] leading-[0.98] text-on-background md:text-[56px] md:leading-none">
        Vos coordonnées
      </h1>
      <p className="mt-4 max-w-[620px] font-body-md text-[14px] leading-6 text-on-surface-variant md:font-body-lg md:text-[17px] md:leading-7">
        Renseignez vos informations pour recevoir le récapitulatif par e-mail. Le rendez-vous sera confirmé définitivement après validation de l’acompte.
      </p>
    </div>
  )
}
