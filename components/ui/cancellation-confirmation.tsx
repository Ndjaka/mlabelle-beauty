import { Button } from '@/components/ui/button';
import { ServiceImage } from '@/components/ui/service-image';
import { formatSalonDateLong, formatSalonTime } from '@/features/booking/salon-time';
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
  const startsAt = new Date(booking.starts_at);
  const dateLabel = formatSalonDateLong(startsAt);
  const timeLabel = formatSalonTime(startsAt);
  const priceLabel = formatPrice(booking.service.price_cents);
  const durationLabel = `${booking.service.duration_minutes}min`;

  return (
    <main className="flex-grow px-5 py-10 md:px-10 md:py-[var(--spacing-xxl,80px)]">
      <div className="mx-auto grid w-full max-w-[1040px] gap-8 animate-fade-in md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div className="rounded-[32px] border border-secondary/20 bg-surface-container p-6 shadow-[0_24px_70px_rgba(30,27,21,0.08)] md:p-10">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#ba1a1a]/20 bg-[#ffdad6]">
            <span className="material-symbols-outlined text-[30px] text-[#ba1a1a]">
              priority_high
            </span>
          </div>

          <span className="label-caps text-secondary tracking-[0.2em]">
            Annulation
          </span>

          <h1 className="mt-4 font-serif text-[38px] leading-[1.02] tracking-[-0.02em] text-foreground md:text-[58px]">
            Annuler ce rendez-vous ?
          </h1>

          <p className="mt-5 font-sans text-[16px] leading-7 text-foreground/70 md:text-[18px] md:leading-8">
            Votre rendez-vous restera actif tant que vous n’aurez pas confirmé
            l’annulation.
          </p>

          <div className="mt-7 border-l-4 border-secondary bg-background px-5 py-4">
            <p className="font-sans text-[14px] leading-6 text-foreground/70">
              Si vous gardez ce rendez-vous, aucune action n’est nécessaire :
              vous pouvez simplement revenir à l’accueil.
            </p>
          </div>
        </div>

        <section className="border border-outline-variant/70 bg-background p-5 shadow-[0_22px_60px_rgba(30,27,21,0.06)] md:p-8">
          {errorMessage ? (
            <div className="mb-5 border border-[#ba1a1a]/20 bg-[#ffdad6]/40 p-4">
              <p className="font-sans text-[15px] leading-[1.6] text-[#ba1a1a]">
                {errorMessage}
              </p>
            </div>
          ) : null}

          <div className="flex items-start gap-4 border-b border-secondary/15 pb-5">
            <ServiceImage
              imageUrl={booking.service.image_url}
              label={booking.service.name}
              variant="sm"
              className="size-16"
            />
            <div className="min-w-0 flex-1">
              <span className="label-caps text-secondary">
                Récapitulatif
              </span>
              <h2 className="mt-1 truncate font-serif text-[30px] leading-tight text-foreground">
                {booking.service.name}
              </h2>
              <p className="mt-2 font-sans text-[13px] leading-5 text-foreground/60">
                Demande liée à cette adresse e-mail.
              </p>
            </div>
            <p className="shrink-0 font-sans text-[20px] font-semibold text-foreground">
              {priceLabel}
            </p>
          </div>

          <div className="grid gap-4 border-b border-secondary/15 py-5 md:grid-cols-2">
            <div>
              <span className="label-caps mb-1 block text-secondary">
                Date
              </span>
              <span className="font-sans text-[16px] font-semibold leading-[1.6] text-foreground capitalize">
                {dateLabel}
              </span>
            </div>
            <div>
              <span className="label-caps mb-1 block text-secondary">
                Horaire
              </span>
              <span className="font-sans text-[16px] font-semibold leading-[1.6] text-foreground">
                {timeLabel} · {durationLabel}
              </span>
            </div>
          </div>

          <div className="py-5">
            <p className="font-sans text-[14px] leading-6 text-foreground/65">
              Après confirmation, le créneau sera libéré et un e-mail
              d’annulation vous sera envoyé.
            </p>
          </div>

          <form action={action} className="space-y-3">
            <Button href="/" variant="outline" className="w-full">
              CONSERVER MON RENDEZ-VOUS
            </Button>
            <Button
              type="submit"
              className="w-full bg-[#ba1a1a] hover:bg-[#9f1717]"
            >
              CONFIRMER L&apos;ANNULATION
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
