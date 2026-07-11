interface BookingProgressPillsProps {
  currentStep: 1 | 2 | 3
}

const BOOKING_STEPS = [
  { label: 'Créneau', step: 1 },
  { label: 'Coordonnées', step: 2 },
  { label: 'Confirmation', step: 3 },
] as const

export function BookingProgressPills({ currentStep }: BookingProgressPillsProps) {
  return (
    <ol className="grid grid-cols-3 gap-2">
      {BOOKING_STEPS.map((item) => {
        const isActive = item.step === currentStep
        const isComplete = item.step < currentStep

        return (
          <li
            key={item.step}
            aria-current={isActive ? 'step' : undefined}
            className={`border px-2 py-2 text-center transition-colors ${
              isActive
                ? 'border-foreground bg-foreground text-background'
                : isComplete
                  ? 'border-secondary/25 bg-secondary/10 text-on-surface'
                : 'border-secondary/20 bg-white text-on-surface-variant'
            }`}
          >
            <span className="block font-label-caps text-[9px] uppercase tracking-[0.18em]">
              Étape {item.step}
            </span>
            <span className="mt-1 block truncate font-body-md text-[12px] font-semibold">
              {item.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
