import { ServiceImage } from '@/components/ui/service-image'

interface BookingConfirmationCardProps {
  date: string
  duration: string
  price: string
  serviceImageUrl?: string | null
  serviceName: string
  time: string
}

export function BookingConfirmationCard({
  date,
  duration,
  price,
  serviceImageUrl,
  serviceName,
  time,
}: BookingConfirmationCardProps) {
  return (
    <div className="w-full bg-surface border border-neutral p-xl rounded-none shadow-sm text-left relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-6xl">auto_awesome</span>
      </div>
      <div className="space-y-6 relative z-10">
        <div>
          <span className="font-label-caps text-on-surface-variant uppercase text-[10px] tracking-widest block mb-1">Prestation</span>
          <div className="mt-3 flex items-center gap-4">
            <ServiceImage imageUrl={serviceImageUrl} label={serviceName} variant="md" />
            <p className="font-serif text-h3 text-on-surface">{serviceName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 border-t border-neutral pt-6">
          <div>
            <span className="font-label-caps text-on-surface-variant uppercase text-[10px] tracking-widest block mb-1">Date</span>
            <p className="font-sans text-body-md text-on-surface capitalize">{date}</p>
          </div>
          <div>
            <span className="font-label-caps text-on-surface-variant uppercase text-[10px] tracking-widest block mb-1">Heure & Durée</span>
            <p className="font-sans text-body-md text-on-surface">{time} ({duration})</p>
          </div>
        </div>
        <div className="border-t border-neutral pt-6 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-on-surface-variant uppercase text-[10px] tracking-widest block mb-1">Total</span>
            <p className="font-serif text-h3 text-secondary">{price}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
