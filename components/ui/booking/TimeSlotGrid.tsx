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
  const headerMargin = variant === 'mobile' ? 'mb-3' : 'mb-4'
  const sectionMargin = variant === 'desktop' && title === 'Après-midi' ? 'mt-gutter' : variant === 'mobile' && title === 'Après-midi' ? 'mt-xl' : ''

  return (
    <div className={sectionMargin}>
      <div className={`flex items-center gap-3 ${headerMargin}`}>
        <span className="material-symbols-outlined text-[20px] text-secondary">{icon}</span>
        <h3 className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-on-surface">
          {title}
        </h3>
      </div>
      <div className={`grid ${gridColsClass} gap-3 ${containerMargin}`}>
        {slots.map(slot => (
          <button
            key={slot}
            onClick={() => onSlotSelect(slot)}
            className={`border py-3 text-center transition-all
              ${variant === 'mobile' ? 'font-body-md text-body-md' : 'font-body-lg text-body-lg'}
              ${selectedSlot === slot
                ? 'border-foreground bg-foreground text-background shadow-[0_14px_30px_rgba(30,27,21,0.12)]'
                : variant === 'mobile'
                  ? 'border-secondary/20 bg-white text-on-background hover:border-secondary'
                  : 'border-secondary/20 bg-white text-on-surface hover:border-secondary hover:bg-primary'
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
