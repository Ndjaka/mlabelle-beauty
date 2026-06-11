interface BookingFormHeaderProps {
  titleClassName: string
}

export function BookingFormHeader({ titleClassName }: BookingFormHeaderProps) {
  return (
    <div className="mb-xl">
      <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">
        Étape 2 sur 3
      </span>
      <h1 className={titleClassName}>Vos informations</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Veuillez renseigner vos coordonnées pour finaliser votre réservation
      </p>
    </div>
  )
}
