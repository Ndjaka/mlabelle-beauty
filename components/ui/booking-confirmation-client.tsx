import type { BookingWithService } from '@/types/booking'
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit'
import { formatSalonDateLong, formatSalonTime } from '@/features/booking/salon-time'
import { formatDuration, formatPriceRange } from '@/features/booking/utils'
import { Button } from '@/components/ui/button'
import { BookingConfirmationCard } from '@/components/ui/booking/BookingConfirmationCard'
import { BookingConfirmationStickySummary } from '@/components/ui/booking/booking-confirmation-sticky-summary'
import { BookingProgressPills } from '@/components/ui/booking/booking-progress-pills'
import { ConfirmationNextSteps } from '@/components/ui/booking/confirmation-next-steps'

interface BookingConfirmationClientProps {
  booking: BookingWithService
}

export function BookingConfirmationClient({ booking }: BookingConfirmationClientProps) {
  const startsAt = new Date(booking.starts_at)
  const isPending = booking.status === 'pending'
  const isConfirmed = booking.status === 'confirmed'
  const title = isPending
    ? 'Demande bien reçue'
    : isConfirmed
      ? 'Rendez-vous confirmé'
      : 'Réservation annulée'
  const statusLabel = isPending ? 'En attente' : isConfirmed ? 'Confirmé' : 'Annulé'
  const reference = booking.id.slice(0, 8).toUpperCase()
  const dateStr = formatSalonDateLong(startsAt)
  const timeStr = formatSalonTime(startsAt)
  const durationStr = formatDuration(booking.service.duration_minutes)
  const priceStr = formatPriceRange(booking.service.price_cents, booking.service.price_max_cents)
  const description = isPending
    ? (
      <>
        Votre demande a été envoyée à Mlabelle Beauty. Le rendez-vous sera confirmé définitivement après validation de l’acompte de{' '}
        <strong className="font-semibold text-on-background">{BOOKING_DEPOSIT_LABEL}</strong>.
      </>
    )
    : isConfirmed
      ? 'Votre créneau est confirmé. Vous avez reçu le récapitulatif par e-mail.'
      : 'Cette réservation est annulée. Vous pouvez revenir à l’accueil pour choisir un nouveau créneau.'

  return (
    <div className="flex flex-grow flex-col bg-background">
      <main className="mx-auto grid w-full max-w-[1120px] flex-1 gap-8 px-5 pb-[210px] pt-8 md:grid-cols-[minmax(0,1fr)_390px] md:px-8 md:py-16 lg:gap-12 xl:px-0">
        <section className="min-w-0">
          <div className="mb-6 max-w-[520px]">
            <BookingProgressPills currentStep={3} />
          </div>

          <div className="mb-7">
            <div className="mb-5 inline-flex size-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined text-[32px]">
                {isPending ? 'mark_email_read' : 'verified'}
              </span>
            </div>
            <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
              Étape finale
            </p>
            <h1 className="mt-3 font-serif text-[38px] leading-[0.98] text-on-background md:text-[58px] md:leading-none">
              {title}
            </h1>
            <p className="mt-4 max-w-[650px] font-body-md text-[15px] leading-7 text-on-surface-variant md:text-[17px]">
              {description}
            </p>
          </div>

          <ConfirmationNextSteps email={booking.client_email} status={booking.status} />

          <div className="mt-7 hidden flex-col gap-3 md:flex md:flex-row">
            <Button href="/" size="lg" animated className="w-full sm:w-auto">
              Retour à l&apos;accueil
            </Button>
          </div>
        </section>

        <aside className="hidden md:block">
          <BookingConfirmationCard
            date={dateStr}
            duration={durationStr}
            email={booking.client_email}
            price={priceStr}
            reference={reference}
            serviceImageUrl={booking.service.image_url}
            serviceName={booking.service.name}
            statusLabel={statusLabel}
            time={timeStr}
          />
        </aside>
      </main>

      <BookingConfirmationStickySummary
        date={startsAt}
        price={priceStr}
        serviceImageUrl={booking.service.image_url}
        serviceName={booking.service.name}
        time={timeStr}
      />
    </div>
  )
}
