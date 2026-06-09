'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'

interface MobileStickyRecapProps {
  selectedDate: Date
  selectedSlot: string | null
  onConfirm: () => void
}

export function MobileStickyRecap({
  selectedDate,
  selectedSlot,
  onConfirm,
}: MobileStickyRecapProps) {
  return (
    <div className="fixed bottom-0 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant px-6 py-4 flex items-center justify-between z-40">
      <div>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
          {format(selectedDate, 'EEE d MMM', { locale: fr })}
        </p>
        <p className="font-h3 text-h3 text-on-background">
          {selectedSlot ?? '—'}
        </p>
      </div>
      <Button
        onClick={onConfirm}
        disabled={!selectedSlot}
        className="whitespace-nowrap px-7"
      >
        CONFIRMER
      </Button>
    </div>
  )
}
