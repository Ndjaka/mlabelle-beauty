'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { formatDuration, formatPrice } from '@/features/booking/utils'
import { Button } from '@/components/ui/button'
import { ServiceImage } from '@/components/ui/service-image'

interface MobileStickyRecapProps {
  service: Service
  selectedDate: Date
  selectedSlot: string | null
  onConfirm: () => void
}

export function MobileStickyRecap({
  service,
  selectedDate,
  selectedSlot,
  onConfirm,
}: MobileStickyRecapProps) {
  const actionLabel = selectedSlot ? 'CONTINUER' : 'CHOISIR'

  return (
    <div className="fixed bottom-0 z-40 w-full border-t border-secondary/20 bg-surface/95 px-5 py-4 shadow-[0_-18px_45px_rgba(30,27,21,0.08)] backdrop-blur-md">
      <div className="mb-3 flex items-center gap-3">
        <ServiceImage
          imageUrl={service.image_url}
          label={service.name}
          variant="sm"
          className="size-12"
        />
        <div className="min-w-0 flex-1">
          <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-secondary">
            Prestation
          </p>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <h3 className="truncate font-serif text-[22px] leading-none text-on-background">
              {service.name}
            </h3>
            <span className="shrink-0 font-body-lg text-[16px] font-semibold text-on-background">
              {formatPrice(service.price_cents)}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 font-body-md text-[12px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[15px] text-secondary">
              schedule
            </span>
            {formatDuration(service.duration_minutes)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-secondary/15 pt-3">
        <div className="min-w-0">
          <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
            Rendez-vous
          </p>
          <p className="mt-1 truncate font-body-md text-[14px] font-semibold text-on-background">
            {format(selectedDate, 'EEE d MMM', { locale: fr })}
            {selectedSlot ? ` à ${selectedSlot}` : ' · Choisir un créneau'}
          </p>
        </div>
        <Button
          onClick={onConfirm}
          disabled={!selectedSlot}
          className="shrink-0 whitespace-nowrap px-5"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  )
}
