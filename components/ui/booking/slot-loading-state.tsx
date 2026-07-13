'use client'

interface SlotLoadingStateProps {
  variant: 'mobile' | 'desktop'
}

const PLACEHOLDER_SLOTS = ['1', '2', '3', '4', '5', '6']

export function SlotLoadingState({ variant }: SlotLoadingStateProps) {
  const columnsClass = variant === 'mobile' ? 'grid-cols-3' : 'grid-cols-2'
  const paddingClass = variant === 'mobile' ? 'p-5' : 'p-6'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`border border-secondary/15 bg-white ${paddingClass} shadow-[0_14px_34px_rgba(30,27,21,0.04)]`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] text-secondary">
          hourglass_top
        </span>
        <div>
          <p className="font-body-lg text-[16px] font-semibold text-on-surface">
            Recherche des créneaux…
          </p>
          <p className="mt-1 font-body-md text-[13px] text-on-surface-variant">
            Nous vérifions les disponibilités pour cette date.
          </p>
        </div>
      </div>
      <div className={`grid ${columnsClass} gap-3`}>
        {PLACEHOLDER_SLOTS.map((slot) => (
          <div
            key={slot}
            className="h-12 animate-pulse border border-secondary/10 bg-primary/60"
          />
        ))}
      </div>
    </div>
  )
}
