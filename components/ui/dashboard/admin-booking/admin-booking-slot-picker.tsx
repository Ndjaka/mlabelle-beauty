type AdminBookingSlotPickerProps = {
  morningSlots: string[]
  afternoonSlots: string[]
  selectedSlot: string
  isLoading: boolean
  onSlotSelect: (slot: string) => void
}

export function AdminBookingSlotPicker({
  morningSlots,
  afternoonSlots,
  selectedSlot,
  isLoading,
  onSlotSelect,
}: AdminBookingSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="border border-outline-variant bg-surface-container-low p-4 text-sm text-foreground/60">
        Chargement des créneaux disponibles...
      </div>
    )
  }

  if (morningSlots.length === 0 && afternoonSlots.length === 0) {
    return (
      <div className="border border-outline-variant bg-surface-container-low p-4 text-sm text-foreground/60">
        Aucun créneau disponible pour cette date.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SlotGroup title="Matin" slots={morningSlots} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />
      <SlotGroup
        title="Après-midi"
        slots={afternoonSlots}
        selectedSlot={selectedSlot}
        onSlotSelect={onSlotSelect}
      />
    </div>
  )
}

function SlotGroup({
  title,
  slots,
  selectedSlot,
  onSlotSelect,
}: {
  title: string
  slots: string[]
  selectedSlot: string
  onSlotSelect: (slot: string) => void
}) {
  if (slots.length === 0) return null

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
        {title}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onSlotSelect(slot)}
            className={`border px-3 py-3 text-sm transition-colors ${
              selectedSlot === slot
                ? 'border-tertiary bg-tertiary text-white'
                : 'border-outline-variant bg-background text-foreground hover:border-secondary'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  )
}
