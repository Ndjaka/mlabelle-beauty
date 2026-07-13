'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit'
import { formatPrice } from '@/features/booking/utils'
import { BookingSubmitButton } from '@/components/ui/booking/BookingSubmitButton'
import { ServiceImage } from '@/components/ui/service-image'

interface BookingFormStickySummaryProps {
  date: Date
  isFormValid: boolean
  loading: boolean
  onSubmit: () => void
  service: Service
  slot: string
}

export function BookingFormStickySummary({
  date,
  isFormValid,
  loading,
  onSubmit,
  service,
  slot,
}: BookingFormStickySummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-secondary/20 bg-surface/95 px-5 py-3 shadow-[0_-18px_45px_rgba(30,27,21,0.08)] backdrop-blur-md pb-safe md:hidden">
      <div className="mb-2 flex items-center gap-3">
        <ServiceImage
          imageUrl={service.image_url}
          label={service.name}
          variant="sm"
          className="size-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-secondary">
              Récapitulatif
            </p>
            <span className="shrink-0 font-body-lg text-[16px] font-semibold text-on-background">
              {formatPrice(service.price_cents)}
            </span>
          </div>
          <h3 className="mt-1 truncate font-serif text-[21px] leading-none text-on-background">
            {service.name}
          </h3>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 border-t border-secondary/15 pt-2 text-on-surface-variant">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="material-symbols-outlined text-[17px] text-secondary">
            calendar_today
          </span>
          <span className="truncate font-body-md text-[13px] font-semibold capitalize text-on-background">
            {format(date, 'EEE d MMM', { locale: fr })}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="material-symbols-outlined text-[17px] text-secondary">
            schedule
          </span>
          <span className="font-body-md text-[13px] font-semibold text-on-background">
            {slot}
          </span>
        </div>
        <span className="col-span-2 font-body-md text-[12px] text-on-surface-variant">
          Acompte{' '}
          <strong className="font-semibold text-on-background">{BOOKING_DEPOSIT_LABEL}</strong>{' '}
          avant confirmation définitive
        </span>
      </div>

      <BookingSubmitButton
        isFormValid={isFormValid}
        loading={loading}
        label="ENVOYER MA DEMANDE"
        type="button"
        onClick={onSubmit}
      />
    </div>
  )
}
