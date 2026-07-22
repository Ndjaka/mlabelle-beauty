import { Button } from '@/components/ui/button'

type ServicesPageHeaderProps = {
  onCreate: () => void
}

export function ServicesPageHeader({ onCreate }: ServicesPageHeaderProps) {
  return (
    <section className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="label-caps text-secondary">Configuration</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
          Prestations
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
          Gérez les services proposés par le salon : catégories, tarifs, durées et statuts d&apos;activation.
        </p>
      </div>
      <Button onClick={onCreate} className="flex w-full items-center justify-center gap-2 md:w-auto">
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
        Nouveau service
      </Button>
    </section>
  )
}
