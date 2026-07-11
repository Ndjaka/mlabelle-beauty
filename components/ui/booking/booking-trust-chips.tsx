const TRUST_CHIPS = [
  { icon: 'event_available', label: 'Créneaux en direct' },
  { icon: 'mail', label: 'Récapitulatif par e-mail' },
  { icon: 'payments', label: 'Acompte expliqué avant validation' },
] as const

export function BookingTrustChips() {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {TRUST_CHIPS.map((chip) => (
        <span
          key={chip.label}
          className="inline-flex items-center gap-1.5 border border-secondary/20 bg-white/70 px-3 py-2 font-body-md text-[12px] font-semibold text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary" aria-hidden="true">
            {chip.icon}
          </span>
          {chip.label}
        </span>
      ))}
    </div>
  )
}
