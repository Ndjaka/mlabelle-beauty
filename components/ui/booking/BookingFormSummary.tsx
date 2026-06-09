import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { formatDuration, formatPrice } from '@/features/booking/utils'

interface BookingFormSummaryProps {
  compact?: boolean
  date: Date
  service: Service
  slot: string
}

export function BookingFormSummary({
  compact = false,
  date,
  service,
  slot,
}: BookingFormSummaryProps) {
  if (compact) {
    return (
      <div className="mt-md border border-outline-variant rounded-none p-6 bg-white flex flex-col gap-md">
        <h3 className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">Récapitulatif</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline gap-4">
            <span className="font-h3 text-h3 text-on-surface">{service.name}</span>
            <span className="font-body-lg text-body-lg text-on-surface-variant whitespace-nowrap">{formatPrice(service.price_cents)}</span>
          </div>
          <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md border-t border-outline-variant/30 pt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span className="capitalize">{format(date, 'EEE d MMMM', { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              <span>{slot}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-[120px] bg-white p-xl flex flex-col gap-5 border border-neutral">
      <h2 className="font-h3 text-h3 text-on-background pb-2 border-b border-outline-variant/30">
        Votre Réservation
      </h2>
      <div className="flex flex-col gap-4 py-sm">
        <div className="flex justify-between items-start">
          <span className="font-body-lg text-body-lg text-on-background font-semibold">{service.name}</span>
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
          Paiement sur place
        </p>
      </div>
    </div>
  )
}
