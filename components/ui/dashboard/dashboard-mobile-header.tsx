import { Logo } from '@/components/ui/logo'

type DashboardMobileHeaderProps = {
  dateLabel: string
}

export function DashboardMobileHeader({ dateLabel }: DashboardMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-outline-variant bg-background/95 px-5 py-4 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Logo />
          <p className="mt-1 text-xs text-foreground/55">{dateLabel}</p>
        </div>
        <button
          type="button"
          className="flex size-11 items-center justify-center border border-outline-variant bg-surface-container-low text-foreground"
          aria-label="Ouvrir le menu"
        >
          <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
            menu
          </span>
        </button>
      </div>
    </header>
  )
}
