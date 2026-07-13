import type { ReactNode } from 'react'
import { ServiceImage } from '@/components/ui/service-image'

interface BookingConfirmationCardProps {
  date: string
  duration: string
  email: string
  price: string
  reference: string
  serviceImageUrl?: string | null
  serviceName: string
  statusLabel: string
  time: string
}

export function BookingConfirmationCard({
  date,
  duration,
  email,
  price,
  reference,
  serviceImageUrl,
  serviceName,
  statusLabel,
  time,
}: BookingConfirmationCardProps) {
  return (
    <div className="w-full border border-secondary/15 bg-white p-5 text-left shadow-[0_24px_70px_rgba(30,27,21,0.05)] md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
            Récapitulatif
          </p>
          <h2 className="mt-2 font-serif text-[30px] leading-tight text-on-background">
            Votre demande
          </h2>
        </div>
        <span className="shrink-0 border border-secondary/20 bg-secondary/10 px-3 py-2 font-label-caps text-[9px] uppercase tracking-[0.14em] text-secondary">
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <ServiceImage imageUrl={serviceImageUrl} label={serviceName} variant="sm" />
          <div className="min-w-0">
            <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-secondary">
              Prestation
            </p>
            <p className="font-body-lg text-[17px] font-semibold text-on-background">
              {serviceName}
            </p>
          </div>
        </div>
        <p className="shrink-0 font-body-lg text-[17px] font-semibold text-on-background">
          {price}
        </p>
      </div>

      <div className="mt-5 grid gap-3 border-y border-outline-variant/25 py-4">
        <ConfirmationRow icon="calendar_today" label="Date">
          {date}
        </ConfirmationRow>
        <ConfirmationRow icon="schedule" label="Heure">
          {time} · {duration}
        </ConfirmationRow>
        <ConfirmationRow icon="mail" label="E-mail">
          {email}
        </ConfirmationRow>
        <ConfirmationRow icon="tag" label="Référence">
          {reference}
        </ConfirmationRow>
      </div>

      <div className="mt-5 bg-primary p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-label-caps text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
            Total estimé
          </span>
          <span className="font-serif text-[28px] leading-none text-on-background">
            {price}
          </span>
        </div>
      </div>
    </div>
  )
}

function ConfirmationRow({
  children,
  icon,
  label,
}: {
  children: ReactNode
  icon: string
  label: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="material-symbols-outlined mt-0.5 text-[18px] text-secondary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-1 break-words font-body-md text-[14px] font-semibold text-on-background">
          {children}
        </p>
      </div>
    </div>
  )
}
