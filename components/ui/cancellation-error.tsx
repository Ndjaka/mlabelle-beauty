// components/ui/cancellation-error.tsx
// DNA: Booking - Error (Desktop + Mobile) — Stitch ID 169cb77d17914cf08791224ef7614937 / 0203dc659ae847469390f17fc7e7616a

import { Button } from '@/components/ui/button';

interface CancellationErrorProps {
  message: string;
}

export function CancellationError({ message }: CancellationErrorProps) {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 py-[var(--spacing-xxl,80px)]">
      <div className="w-full max-w-[600px] text-center animate-fade-in space-y-[48px]">

        {/* Error icon */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#ba1a1a]/5 blur-2xl rounded-full scale-150 transition-transform group-hover:scale-[1.8]" />
            <div className="relative w-24 h-24 rounded-full bg-[#ffdad6] flex items-center justify-center border border-[#ba1a1a]/10">
              <span className="material-symbols-outlined text-[48px] text-[#ba1a1a]">error</span>
            </div>
          </div>
        </div>

        {/* Error messaging */}
        <div className="space-y-4">
          <h1 className="font-serif text-[48px] leading-[1.2] tracking-[-0.02em] text-[var(--foreground)]">
            Lien invalide
          </h1>
          <div className="h-px w-4/5 mx-auto bg-gradient-to-r from-transparent via-neutral to-transparent" />
          <p className="font-sans text-[18px] leading-[1.6] text-[var(--outline)] max-w-[480px] mx-auto">
            {message}
          </p>
        </div>

        {/* Help card */}
        <div className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)] p-6 text-left space-y-3">
          <p className="label-caps text-[var(--foreground)] tracking-[0.15em]">BESOIN D&apos;AIDE ?</p>
          <p className="font-sans text-[16px] leading-[1.6] text-[var(--outline)]">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter directement notre atelier.
          </p>
        </div>

        {/* CTA */}
        <div className="w-full pt-2">
          <Button href="/" className="w-full">
            RETOUR À L&apos;ACCUEIL
          </Button>
        </div>

      </div>
    </main>
  );
}
