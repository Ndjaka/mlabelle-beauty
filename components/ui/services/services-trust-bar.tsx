const trustItems = [
  { icon: 'calendar_month', title: 'Réservation 24/7', text: 'Choisissez votre créneau en ligne' },
  { icon: 'verified_user', title: 'Acompte clair', text: '20,00 € à régler pour confirmer' },
  { icon: 'schedule', title: 'Lien d’annulation', text: 'Disponible dans votre e-mail récapitulatif' },
  { icon: 'favorite', title: 'Soin personnalisé', text: 'Chaque prestation est adaptée' },
]

export function ServicesTrustBar() {
  return (
    <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-[8px] border border-secondary/15 bg-white shadow-[0_14px_34px_rgba(30,27,21,0.04)] sm:grid-cols-2 md:grid-cols-4">
      {trustItems.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-3 border-b border-secondary/10 p-4 last:border-b-0 sm:border-r sm:even:border-r-0 md:border-b-0 md:even:border-r md:last:border-r-0 xl:p-5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-secondary/20 text-secondary">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {item.icon}
            </span>
          </span>
          <div className="min-w-0">
            <p className="font-sans text-[12px] font-semibold text-foreground">
              {item.title}
            </p>
            <p className="mt-1 line-clamp-2 font-sans text-[11px] leading-4 text-foreground/55">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
