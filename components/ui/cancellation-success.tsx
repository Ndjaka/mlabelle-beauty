// components/ui/cancellation-success.tsx
// DNA: Booking - Cancellation (Desktop + Mobile) — Stitch ID 5165bd983f9f440cab1f8d1c11f4c592 / c6e8cc4ca08d4673bb91a932ffc0ce3c

import { Button } from '@/components/ui/button';
import { formatSalonDateLong, formatSalonTime } from '@/features/booking/salon-time';
import type { BookingWithService } from '@/types/booking';

interface CancellationSuccessProps {
  booking: BookingWithService;
}

export function CancellationSuccess({ booking }: CancellationSuccessProps) {
  const startsAt = new Date(booking.starts_at);
  const dateLabel = formatSalonDateLong(startsAt);
  const timeLabel = formatSalonTime(startsAt);
  const duration = booking.service.duration_minutes;

  return (
    <main className="flex-grow flex items-center justify-center px-6 py-[var(--spacing-xxl,80px)]">
      <div className="w-full max-w-[600px] text-center animate-fade-in">

        {/* Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full border border-[var(--secondary)]/30">
          <span className="material-symbols-outlined text-4xl text-[var(--secondary)]">close</span>
        </div>

        {/* Gold label */}
        <div className="mb-4">
          <span className="label-caps text-[var(--secondary)] tracking-[0.2em]">ANNULATION</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-[36px] md:text-[48px] leading-[1.2] md:leading-[1.2] tracking-[-0.02em] text-[var(--foreground)] mb-4">
          Réservation Annulée
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-[18px] leading-[1.6] text-[var(--outline)] mb-[48px]">
          Votre rendez-vous a bien été annulé
        </p>

        {/* Booking summary card */}
        <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)] p-[48px] mb-6 text-left">
          <div className="border-b border-[var(--outline-variant)] pb-4 mb-4 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
            <span className="label-caps text-[var(--secondary)]">PRESTATION</span>
            <span className="font-serif text-[24px] leading-[1.4] text-[var(--foreground)]">
              {booking.service.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="label-caps text-[var(--secondary)] block mb-1">DATE</span>
              <span className="font-sans text-[16px] leading-[1.6] text-[var(--foreground)] capitalize">
                {dateLabel}
              </span>
            </div>
            <div>
              <span className="label-caps text-[var(--secondary)] block mb-1">HORAIRE</span>
              <span className="font-sans text-[16px] leading-[1.6] text-[var(--foreground)]">
                {timeLabel} ({duration} min)
              </span>
            </div>
          </div>
        </div>

        {/* Email note */}
        <div className="flex items-center justify-center gap-2 mb-[80px]">
          <span className="material-symbols-outlined text-[18px] text-[var(--outline)]">mail</span>
          <p className="font-sans text-[16px] leading-[1.6] text-[var(--outline)] italic">
            Un email de confirmation d&apos;annulation vous a été envoyé
          </p>
        </div>

        {/* CTA */}
        <Button href="/" className="w-full">
          RETOUR À L&apos;ACCUEIL
        </Button>

        {/* Decorative separator */}
        <div className="mt-[80px] opacity-20">
          <div className="h-px w-1/4 bg-[var(--secondary)] mx-auto" />
        </div>
      </div>
    </main>
  );
}
