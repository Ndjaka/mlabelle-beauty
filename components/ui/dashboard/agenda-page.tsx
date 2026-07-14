import { Button } from '@/components/ui/button'
import { DashboardAgenda } from '@/components/ui/dashboard/dashboard-agenda'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import type { DashboardData } from '@/types/dashboard'

type AgendaPageProps = {
  data: DashboardData
}

export function AgendaPage({ data }: AgendaPageProps) {
  const navItems = getDashboardNavItems('agenda')
  const mobileNavItems = getDashboardMobileNavItems('agenda')

  return (
    <DashboardShell dateLabel={data.dateLabel} navItems={navItems} mobileNavItems={mobileNavItems}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 md:px-8 lg:px-10 lg:py-8">
        <section className="flex flex-col gap-5 border-b border-outline-variant pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps text-secondary">{data.dateLabel}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Agenda
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
              Vue complète des rendez-vous, avec repères jour/semaine et planning horaire.
            </p>
          </div>
          <Button href="/dashboard" variant="outline" className="w-full md:w-auto">
            Retour dashboard
          </Button>
        </section>

        <DashboardAgenda
          items={data.agendaItems}
          days={data.agendaDays}
          month={data.agendaMonth}
          summary={data.agendaSummary}
          weekColumns={data.agendaWeekColumns}
          mobileWeekColumns={data.agendaMobileWeekColumns}
          dateLabel={data.dateLabel}
          selectedDateKey={data.selectedDateKey}
          view={data.view}
        />
      </div>
    </DashboardShell>
  )
}
