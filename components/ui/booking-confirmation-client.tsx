'use client'

import { useRouter } from 'next/navigation'
import type { BookingWithService } from '@/types/booking'
import { formatPrice, formatDuration } from '@/features/booking/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { BookingConfirmationCard } from '@/components/ui/booking/BookingConfirmationCard'

interface BookingConfirmationClientProps {
  booking: BookingWithService
}

export function BookingConfirmationClient({ booking }: BookingConfirmationClientProps) {
  const router = useRouter()

  const serviceName = booking.service.name
  const dateStr = format(new Date(booking.starts_at), 'EEEE d MMMM yyyy', { locale: fr })
  const timeStr = format(new Date(booking.starts_at), 'HH:mm')
  const durationStr = formatDuration(booking.service.duration_minutes)
  const priceStr = formatPrice(booking.service.price_cents)

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:flex min-h-[819px] items-center justify-center py-xxl px-gutter relative">
        <div className="w-full max-w-[600px] text-center animate-fade-in relative z-10 mx-auto">
          {/* Step Indicator */}
          <div className="flex flex-col items-center mb-md">
            <span className="material-symbols-outlined text-secondary mb-sm text-3xl">stars</span>
            <span className="font-label-caps text-secondary uppercase text-[10px] tracking-[0.25em]">Étape 3 sur 3</span>
          </div>

          {/* Titles */}
          <h1 className="font-serif text-h1 text-on-surface mb-md">Réservation Confirmée</h1>
          <p className="font-sans text-body-lg text-on-surface-variant mb-xl max-w-md mx-auto">
            Votre moment d&apos;exception est désormais réservé chez Mlabelle Beauty.
          </p>

          <BookingConfirmationCard
            date={dateStr}
            duration={durationStr}
            price={priceStr}
            serviceName={serviceName}
            time={timeStr}
          />

          {/* Main CTA */}
          <Button
            size="lg"
            animated
            onClick={() => router.push('/')}
            className="w-full mt-xl"
          >
            RETOUR À L&apos;ACCUEIL
          </Button>

          {/* Email Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">mail</span>
            <p className="font-sans text-body-md text-[14px]">Un e-mail de confirmation a été envoyé à {booking.client_email}.</p>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden pt-24 pb-32 px-gutter max-w-md mx-auto flex flex-col items-center text-center">
        {/* Step Indicator & Icon */}
        <div className="mb-xl flex flex-col items-center">
          <div className="animate-fade-in-up mb-md text-secondary">
            <span className="material-symbols-outlined text-[48px]">auto_awesome</span>
          </div>
          <span className="font-label-caps text-secondary tracking-[0.2em] mb-sm uppercase">ÉTAPE 3 SUR 3</span>
        </div>

        {/* Success Message */}
        <h2 className="font-serif text-h2 text-on-surface mb-md">Réservation Confirmée</h2>
        <p className="font-sans text-body-lg text-on-surface-variant mb-xl italic">
          Votre moment d&apos;exception est désormais réservé
        </p>

        <BookingConfirmationCard
          date={dateStr}
          duration={durationStr}
          price={priceStr}
          serviceName={serviceName}
          time={timeStr}
        />

        {/* Confirmation Note */}
        <div className="mt-xl px-md">
          <p className="font-sans text-body-md text-on-surface-variant flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">mail</span>
            Un e-mail de confirmation vient de vous être envoyé.
          </p>
        </div>

        {/* Footer Action - Fixed to bottom */}
        <div className="fixed bottom-0 left-0 w-full px-gutter pb-gutter pt-4 bg-surface/80 backdrop-blur-md z-50">
          <Button
            onClick={() => router.push('/')}
            className="w-full py-md active:scale-95 shadow-lg"
          >
            RETOUR À L&apos;ACCUEIL
          </Button>
        </div>
      </div>
    </>
  )
}
