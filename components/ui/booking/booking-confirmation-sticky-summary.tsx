import { Button } from '@/components/ui/button'
import { ServiceImage } from '@/components/ui/service-image'
import { formatSalonDateShort } from '@/features/booking/salon-time'

interface BookingConfirmationStickySummaryProps {
  date: Date
  price: string
  serviceImageUrl?: string | null
  serviceName: string
  time: string
}

export function BookingConfirmationStickySummary({
  date,
  price,
  serviceImageUrl,
  serviceName,
  time,
}: BookingConfirmationStickySummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-secondary/20 bg-surface/95 px-5 py-3 shadow-[0_-18px_45px_rgba(30,27,21,0.08)] backdrop-blur-md pb-safe md:hidden">
      <div className="mb-2 flex items-center gap-3">
        <ServiceImage
          imageUrl={serviceImageUrl}
          label={serviceName}
          variant="sm"
          className="size-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-secondary">
              Récapitulatif
            </p>
            <span className="shrink-0 font-body-lg text-[16px] font-semibold text-on-background">
              {price}
            </span>
          </div>
          <h3 className="mt-1 truncate font-serif text-[21px] leading-none text-on-background">
            {serviceName}
          </h3>
        </div>
      </div>

      <div className="mb-3 border-t border-secondary/15 pt-2 text-on-surface-variant">
        <div className="min-w-0">
          <p className="font-label-caps text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
            Rendez-vous
          </p>
          <p className="mt-1 truncate font-body-md text-[13px] font-semibold capitalize text-on-background">
            {formatSalonDateShort(date)} · {time}
          </p>
        </div>
      </div>

      <Button href="/" className="w-full">
        Retour à l&apos;accueil
      </Button>
    </div>
  )
}
