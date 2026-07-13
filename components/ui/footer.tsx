import Link from 'next/link';

import { Logo } from '@/components/ui/logo';

export function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-neutral bg-background md:mt-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-5 px-6 py-8 text-center md:flex-row md:px-20 md:py-10 md:text-left">
        <Link
          href="/"
          aria-label="Retour à l’accueil Mlabelle Beauty"
          className="inline-flex transition-opacity hover:opacity-80"
        >
          <Logo tone="copper" size="sm" priority={false} />
        </Link>

        <div className="font-sans text-sm leading-[1.7] text-foreground/60 md:text-right">
          <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
            Coiffure & Esthétique
          </p>
          <p>© {new Date().getFullYear()} Mlabelle Beauty. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
