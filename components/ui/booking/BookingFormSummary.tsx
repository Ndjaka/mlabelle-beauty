import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit'
import { formatDuration, formatPrice } from '@/features/booking/utils'
import { ServiceImage } from '@/components/ui/service-image'

interface BookingFormSummaryProps {
  date: Date
  service: Service
  slot: string
}

export function BookingFormSummary({
  date,
  service,
  slot,
}: BookingFormSummaryProps) {
  return (
    <div className="sticky top-[120px] bg-white p-xl flex flex-col gap-5 border border-neutral">
      <h2 className="font-h3 text-h3 text-on-background pb-2 border-b border-outline-variant/30">
        Votre Réservation
      </h2>
      <div className="flex flex-col gap-4 py-sm">
        <div className="flex justify-between items-start gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ServiceImage imageUrl={service.image_url} label={service.name} variant="sm" />
            <span className="font-body-lg text-body-lg text-on-background font-semibold">{service.name}</span>
          </div>
          <span className="font-body-lg text-body-lg text-on-background">{formatPrice(service.price_cents)}</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span className="font-body-md text-body-md capitalize">
            {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span className="font-body-md text-body-md">
            {slot} ({formatDuration(service.duration_minutes)})
          </span>
        </div>
      </div>
      <div className="pt-4 border-t border-outline-variant/30 mt-auto">
        <div className="flex justify-between items-center mb-xs">
          <span className="font-h3 text-h3 text-on-background">Total</span>
          <span className="font-h3 text-h3 text-on-background">{formatPrice(service.price_cents)}</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm">
          Acompte de {BOOKING_DEPOSIT_LABEL} à régler pour confirmer le rendez-vous.
        </p>
      </div>
    </div>
  )
}
