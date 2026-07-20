type AdminBookingModalHeaderProps = {
  onClose: () => void
}

export function AdminBookingModalHeader({ onClose }: AdminBookingModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
      <h2 id="admin-booking-title" className="font-serif text-2xl text-foreground">Ajouter une réservation</h2>
      <button
        type="button"
        onClick={onClose}
        className="p-2 text-foreground/65 hover:text-foreground"
        aria-label="Fermer"
      >
        <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
          close
        </span>
      </button>
    </div>
  )
}
