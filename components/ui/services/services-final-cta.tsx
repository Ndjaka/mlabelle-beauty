import { CatalogScrollButton } from '@/components/ui/services/catalog-scroll-button'

export function ServicesFinalCta() {
  return (
    <section className="mt-8 overflow-hidden rounded-[18px] border border-secondary/15 bg-secondary/10 p-5 shadow-[0_18px_44px_rgba(30,27,21,0.05)] md:mt-10 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-[620px]">
          <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
            Prête à réserver ?
          </p>
          <h2 className="mt-2 font-serif text-[30px] leading-tight text-foreground md:text-[38px]">
            Choisissez votre moment beauté.
          </h2>
          <p className="mt-2 font-sans text-[14px] leading-6 text-foreground/65">
            Sélectionnez une prestation, puis trouvez le créneau qui vous convient en quelques clics.
          </p>
        </div>
        <CatalogScrollButton size="lg" className="w-full md:w-auto">
          Choisir une prestation
        </CatalogScrollButton>
      </div>
    </section>
  )
}
