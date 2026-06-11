'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit'
import { formatPrice, formatDuration } from '@/features/booking/utils'
import { Button } from '@/components/ui/button'
import { ServiceImage } from '@/components/ui/service-image'

interface SummaryCardProps {
  service: Service
  selectedDate: Date
  selectedSlot: string | null
  onConfirm: () => void
}

export function SummaryCard({
  service,
  selectedDate,
  selectedSlot,
  onConfirm,
}: SummaryCardProps) {
  return (
    <div className="sticky top-28 border border-secondary/20 bg-white p-8 shadow-[0_24px_70px_rgba(30,27,21,0.06)]">
      <p className="font-label-caps text-label-caps uppercase tracking-[0.22em] text-secondary">
        Votre réservation
      </p>
      <h3 className="mt-2 border-b border-secondary/15 pb-5 font-serif text-[30px] leading-tight text-on-surface">
        Récapitulatif
      </h3>

      <div className="mb-10 mt-7 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <ServiceImage imageUrl={service.image_url} label={service.name} variant="sm" />
            <span className="font-body-lg text-[18px] font-semibold text-on-surface">
              {service.name}
            </span>
          </div>
          <span className="font-body-lg text-[18px] font-semibold text-on-surface">
            {formatPrice(service.price_cents)}
          </span>
        </div>
        <Button
          href="/#prestations"
          variant="ghost"
          size="sm"
          className="w-fit px-0 py-0 text-[10px] text-secondary hover:text-foreground"
        >
          Changer de prestation
        </Button>

        <div className="flex items-start gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined mt-1 text-[20px] text-secondary">
            calendar_today
          </span>
          <div className="font-body-md text-[16px]">
            <span className="capitalize block">{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
            {selectedSlot ? (
              <span className="mt-1 block font-semibold text-on-surface">
                {selectedSlot} ({formatDuration(service.duration_minutes)})
              </span>
            ) : (
              <span className="mt-1 block italic text-outline">Sélectionnez un créneau</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10 flex items-center justify-between border-t border-secondary/15 pt-6">
        <span className="font-serif text-[26px] text-on-surface">Total</span>
        <span className="font-serif text-[28px] text-on-surface">{formatPrice(service.price_cents)}</span>
      </div>

      <Button
        onClick={onConfirm}
        disabled={!selectedSlot}
        size="lg"
        className="w-full"
      >
        CONFIRMER MON RENDEZ-VOUS
      </Button>

      <p className="text-center mt-6 font-normal text-[12px] text-outline leading-relaxed px-4">
        Acompte de {BOOKING_DEPOSIT_LABEL} nécessaire pour confirmer. Solde à régler sur place.
      </p>
    </div>
  )
}
