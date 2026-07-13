const PROCESS_STEPS = [
  {
    title: 'Choisissez une prestation',
    text: 'Parcourez les services et sélectionnez celui qui vous correspond.',
  },
  {
    title: 'Sélectionnez un créneau',
    text: 'Choisissez une date et une heure disponible en ligne.',
  },
  {
    title: 'Envoyez votre demande',
    text: 'Recevez votre récapitulatif par e-mail après validation du formulaire.',
  },
] as const

export function ServicesProcess() {
  return (
    <section className="mt-8 rounded-[18px] border border-secondary/15 bg-white p-5 shadow-[0_18px_44px_rgba(30,27,21,0.05)] md:mt-10 md:p-7">
      <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
        Comment ça marche
      </p>
      <h2 className="mt-2 font-serif text-[30px] leading-tight text-foreground md:text-[38px]">
        Votre demande en 3 étapes
      </h2>

      <ol className="mt-6 grid gap-5 md:grid-cols-3">
        {PROCESS_STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4 md:block">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary/10 font-serif text-[24px] text-secondary">
              {index + 1}
            </span>
            <div className="md:mt-4">
              <h3 className="font-sans text-[14px] font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-[13px] leading-6 text-foreground/60">
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
