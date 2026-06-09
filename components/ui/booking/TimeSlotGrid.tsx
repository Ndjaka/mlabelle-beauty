'use client'

interface TimeSlotGridProps {
  title: string
  slots: string[]
  selectedSlot: string | null
  onSlotSelect: (slot: string) => void
  icon: string
  columns?: number
  variant?: 'mobile' | 'desktop'
}

export function TimeSlotGrid({
  title,
  slots,
  selectedSlot,
  onSlotSelect,
  icon,
  columns = 3,
  variant = 'mobile'
}: TimeSlotGridProps) {
  if (slots.length === 0) return null

  const gridColsClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-2'
  const containerMargin = variant === 'mobile' ? 'mb-lg' : 'mb-gutter'
  const headerMargin = variant === 'mobile' ? 'mb-4' : 'mb-gutter'
  const sectionMargin = variant === 'desktop' && title === 'Après-midi' ? 'mt-gutter' : variant === 'mobile' && title === 'Après-midi' ? 'mt-xl' : ''

  return (
    <div className={sectionMargin}>
      <div className={`flex items-center gap-3 ${headerMargin}`}>
        <span className="material-symbols-outlined text-secondary">{icon}</span>
        <h3 className="font-label-caps text-label-caps text-on-surface uppercase">{title}</h3>
      </div>
      <div className={`grid ${gridColsClass} gap-3 ${containerMargin}`}>
        {slots.map(slot => (
          <button
            key={slot}
            onClick={() => onSlotSelect(slot)}
            className={`py-3 border text-center transition-all
              ${variant === 'mobile' ? 'font-body-md text-body-md' : 'font-body-lg text-body-lg rounded'}
              ${selectedSlot === slot
                ? 'border-secondary bg-surface text-on-background shadow-[0_0_10px_rgba(184,151,74,0.1)]'
                : variant === 'mobile'
                  ? 'border-outline-variant bg-surface text-on-background hover:border-secondary'
                  : 'border-surface-dim text-secondary hover:border-secondary hover:bg-surface'
              }
            `}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  )
}
