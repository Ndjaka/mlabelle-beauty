import { CatalogScrollButton } from '@/components/ui/services/catalog-scroll-button'

export function ServicesHero() {
  return (
    <header className="overflow-hidden border border-secondary/15 bg-white shadow-[0_24px_70px_rgba(30,27,21,0.06)]">
      <div className="flex min-h-[400px] items-center bg-background px-6 py-12 sm:min-h-[420px] sm:px-10 md:px-14 lg:px-16 lg:py-16">
        <div className="flex w-full max-w-[760px] flex-col">
          <p className="font-label-caps text-[10px] uppercase tracking-[0.24em] text-secondary">
            Réservation en ligne
          </p>
          <h1 className="mt-4 max-w-[620px] font-serif text-[44px] leading-[0.98] text-foreground sm:text-[56px] md:text-[64px] xl:text-[68px]">
            Réservez votre moment beauté.
          </h1>
          <p className="mt-5 max-w-[590px] font-sans text-[15px] leading-7 text-foreground/70 md:text-[18px] md:leading-8">
            Choisissez votre prestation, trouvez le créneau qui vous convient, puis envoyez votre demande à Mlabelle Beauty.
          </p>

          <div className="mt-7 sm:max-w-[300px]">
            <CatalogScrollButton size="lg" className="w-full">
              Choisir une prestation
            </CatalogScrollButton>
          </div>

          <p className="mt-5 max-w-[500px] font-sans text-[12px] leading-5 text-foreground/55">
            Acompte de 20,00 € demandé pour confirmer définitivement le rendez-vous. Récapitulatif envoyé par e-mail.
          </p>
        </div>
      </div>
    </header>
  )
}
