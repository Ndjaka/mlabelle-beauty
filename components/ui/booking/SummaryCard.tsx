'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { formatPrice, formatDuration } from '@/features/booking/utils'
import { Button } from '@/components/ui/button'

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
    <div className="sticky top-32 bg-white border border-outline-variant/20 rounded p-[49px] shadow-[0_4px_24px_rgba(30,27,21,0.02)]">
      <h3 className="font-h3 font-normal text-[24px] text-on-surface mb-8 pb-4 border-b border-outline-variant/10">Résumé</h3>

      <div className="flex flex-col gap-6 mb-12">
        <div className="flex justify-between items-baseline">
          <span className="font-body-lg text-[18px] text-on-surface">{service.name}</span>
          <span className="font-body-lg text-[18px] text-on-surface">{formatPrice(service.price_cents)}</span>
        </div>

        <div className="flex items-start gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px] mt-1">calendar_today</span>
          <div className="font-normal text-[16px]">
            <span className="capitalize block">{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
            {selectedSlot ? (
              <span className="block mt-1">{selectedSlot} ({formatDuration(service.duration_minutes)})</span>
            ) : (
              <span className="italic text-outline block mt-1">Sélectionnez un créneau</span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/10 pt-8 mb-12 flex justify-between items-center">
        <span className="font-h3 font-normal text-[24px] text-on-surface">Total</span>
        <span className="font-h3 font-normal text-[24px] text-on-surface">{formatPrice(service.price_cents)}</span>
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
        Paiement sécurisé sur place. Annulation gratuite jusqu&apos;à 24h avant.
      </p>
    </div>
  )
}
