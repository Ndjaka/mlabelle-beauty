import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ReactNode } from 'react'
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
    <div className="sticky top-[120px] flex flex-col gap-5 border border-secondary/15 bg-white p-6 shadow-[0_24px_70px_rgba(30,27,21,0.05)]">
      <div className="border-b border-outline-variant/30 pb-4">
        <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
          Récapitulatif
        </p>
        <h2 className="mt-2 font-serif text-[30px] leading-tight text-on-background">
          Votre demande
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ServiceImage imageUrl={service.image_url} label={service.name} variant="sm" />
            <div className="min-w-0">
              <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-secondary">
                Prestation
              </p>
              <span className="font-body-lg text-[17px] text-on-background font-semibold">{service.name}</span>
            </div>
          </div>
          <span className="shrink-0 font-body-lg text-[17px] font-semibold text-on-background">
            {formatPrice(service.price_cents)}
          </span>
        </div>

        <div className="grid gap-3 border-y border-outline-variant/25 py-4">
          <SummaryRow icon="calendar_today" label="Date">
            {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
          </SummaryRow>
          <SummaryRow icon="schedule" label="Heure">
            {slot} · {formatDuration(service.duration_minutes)}
          </SummaryRow>
        </div>
      </div>

      <div className="mt-auto bg-primary p-4">
        <div className="flex justify-between items-center">
          <span className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
            Total estimé
          </span>
          <span className="font-serif text-[28px] leading-none text-on-background">
            {formatPrice(service.price_cents)}
          </span>
        </div>
        <p className="mt-3 font-body-md text-[13px] leading-5 text-on-surface-variant">
          Acompte de{' '}
          <strong className="font-semibold text-on-background">{BOOKING_DEPOSIT_LABEL}</strong>{' '}
          nécessaire pour confirmer définitivement le rendez-vous.
        </p>
      </div>
    </div>
  )
}

function SummaryRow({
  children,
  icon,
  label,
}: {
  children: ReactNode
  icon: string
  label: string
}) {
  return (
    <div className="flex items-start gap-3 text-on-surface-variant">
      <span className="material-symbols-outlined mt-0.5 text-[18px] text-secondary">
        {icon}
      </span>
      <div>
        <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-1 font-body-md text-[14px] font-semibold capitalize text-on-background">
          {children}
        </p>
      </div>
    </div>
  )
}
