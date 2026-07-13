import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/features/booking/utils';
import type { BookingWithService } from '@/types/booking';

interface CancellationConfirmationProps {
  booking: BookingWithService;
  action: () => Promise<void>;
  errorMessage?: string;
}

export function CancellationConfirmation({
  booking,
  action,
  errorMessage,
}: CancellationConfirmationProps) {
  const startsAt = parseISO(booking.starts_at);
  const dateLabel = format(startsAt, 'EEEE d MMMM yyyy', { locale: fr });
  const timeLabel = format(startsAt, 'HH:mm');
  const priceLabel = formatPrice(booking.service.price_cents);

  return (
    <main className="flex-grow flex items-center justify-center px-6 py-[var(--spacing-xxl,80px)]">
      <div className="w-full max-w-[620px] text-center animate-fade-in">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#ba1a1a]/20 bg-[#ffdad6]">
          <span className="material-symbols-outlined text-4xl text-[#ba1a1a]">
            warning
          </span>
        </div>

        <div className="mb-4">
          <span className="label-caps text-[var(--secondary)] tracking-[0.2em]">
            ANNULATION
          </span>
        </div>

        <h1 className="font-serif text-[36px] leading-[1.15] tracking-[-0.02em] text-[var(--foreground)] mb-4 md:text-[48px]">
          Annuler ce rendez-vous ?
        </h1>

        <p className="font-sans text-[18px] leading-[1.6] text-[var(--outline)] mb-8">
          Votre rendez-vous ne sera annulé qu’après confirmation.
        </p>

        {errorMessage ? (
          <div className="mb-6 border border-[#ba1a1a]/20 bg-[#ffdad6]/40 p-4 text-left">
            <p className="font-sans text-[15px] leading-[1.6] text-[#ba1a1a]">
              {errorMessage}
            </p>
          </div>
        ) : null}

        <div className="bg-[var(--surface-container)] border border-[var(--outline-variant)] p-6 mb-8 text-left md:p-10">
          <div className="flex flex-col gap-3 border-b border-[var(--outline-variant)] pb-5 mb-5 md:flex-row md:items-baseline md:justify-between">
            <div>
              <span className="label-caps text-[var(--secondary)]">
                PRESTATION
              </span>
              <p className="font-serif text-[28px] leading-[1.3] text-[var(--foreground)] mt-1">
                {booking.service.name}
              </p>
            </div>
            <p className="font-sans text-[22px] font-semibold text-[var(--foreground)]">
              {priceLabel}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <span className="label-caps text-[var(--secondary)] block mb-1">
                DATE
              </span>
              <span className="font-sans text-[16px] leading-[1.6] text-[var(--foreground)] capitalize">
                {dateLabel}
              </span>
            </div>
            <div>
              <span className="label-caps text-[var(--secondary)] block mb-1">
                HORAIRE
              </span>
              <span className="font-sans text-[16px] leading-[1.6] text-[var(--foreground)]">
                {timeLabel} · {booking.service.duration_minutes}min
              </span>
            </div>
          </div>
        </div>

        <form action={action} className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#ba1a1a] hover:bg-[#9f1717]"
          >
            CONFIRMER L&apos;ANNULATION
          </Button>
          <Button href="/" variant="outline" className="w-full">
            CONSERVER MON RENDEZ-VOUS
          </Button>
        </form>
      </div>
    </main>
  );
}
