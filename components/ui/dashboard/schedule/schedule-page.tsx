'use client'

import { DashboardShell } from '@/components/ui/dashboard/dashboard-shell'
import {
  getDashboardMobileNavItems,
  getDashboardNavItems,
} from '@/components/ui/dashboard/dashboard-navigation'
import { formatDashboardDateLabel } from '@/features/dashboard/utils'
import { ScheduleWeek } from '@/components/ui/dashboard/schedule/schedule-week'
import { DaysOffList } from '@/components/ui/dashboard/schedule/days-off-list'
import { AddDayOffForm } from '@/components/ui/dashboard/schedule/add-day-off-form'
import type { DayOff, ScheduleRule } from '@/types/schedule'

type SchedulePageProps = {
  rules: ScheduleRule[]
  daysOff: DayOff[]
}

export function SchedulePage({ rules, daysOff }: SchedulePageProps) {
  return (
    <DashboardShell
      dateLabel={formatDashboardDateLabel(new Date())}
      navItems={getDashboardNavItems('schedule')}
      mobileNavItems={getDashboardMobileNavItems('schedule')}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 md:px-8 lg:px-10 lg:py-8">
        <section className="flex flex-col gap-5 border-b border-outline-variant pb-6">
          <div>
            <p className="label-caps text-secondary">Configuration</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Horaires & Congés
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 md:text-base">
              Gérez vos heures d'ouverture hebdomadaires et planifiez vos jours de fermeture exceptionnels.
            </p>
          </div>
        </section>

        <div className="grid gap-10 xl:grid-cols-2">
          {/* Section Horaires */}
          <section className="space-y-5">
            <h2 className="font-serif text-2xl text-foreground">Horaires d'ouverture</h2>
            <div className="border border-outline-variant bg-surface-container-low p-5 md:p-6">
              <ScheduleWeek rules={rules} />
            </div>
          </section>

          {/* Section Congés */}
          <section className="space-y-5">
            <h2 className="font-serif text-2xl text-foreground">Fermetures exceptionnelles</h2>
            <div className="flex flex-col gap-5 border border-outline-variant bg-surface-container-low p-5 md:p-6">
              <AddDayOffForm />
              <DaysOffList daysOff={daysOff} />
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}
