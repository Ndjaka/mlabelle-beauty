'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { AgendaControls } from '@/components/ui/dashboard/agenda/agenda-controls'
import { AgendaDaySummary } from '@/components/ui/dashboard/agenda/agenda-day-summary'
import { AgendaDesktopGrid } from '@/components/ui/dashboard/agenda/agenda-desktop-grid'
import { AgendaMiniMonth } from '@/components/ui/dashboard/agenda/agenda-mini-month'
import { AgendaMobileList } from '@/components/ui/dashboard/agenda/agenda-mobile-list'
import { AgendaWeekStrip } from '@/components/ui/dashboard/agenda/agenda-week-strip'
import { buildDashboardAgendaHourRows } from '@/features/dashboard/utils'
import type {
  DashboardAgendaDay,
  DashboardAgendaItem,
  DashboardAgendaMonth,
  DashboardAgendaSummary,
} from '@/types/dashboard'

type DashboardAgendaProps = {
  items: DashboardAgendaItem[]
  days: DashboardAgendaDay[]
  month: DashboardAgendaMonth
  summary: DashboardAgendaSummary
  dateLabel: string
  selectedDateKey: string
}

function countBookings(items: DashboardAgendaItem[]): number {
  return items.filter((item) => item.kind === 'booking').length
}

function shiftDateKey(dateKey: string, dayOffset: number): string {
  const date = new Date(`${dateKey}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + dayOffset)
  return date.toISOString().slice(0, 10)
}

function getTodayDateKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function DashboardAgenda({
  items,
  days,
  month,
  summary,
  dateLabel,
  selectedDateKey,
}: DashboardAgendaProps) {
  const router = useRouter()
  const rows = buildDashboardAgendaHourRows(items)

  const navigateToDate = useCallback(
    (dateKey: string) => {
      router.push(`/agenda?date=${dateKey}`)
    },
    [router]
  )

  const handlePrev = useCallback(() => {
    navigateToDate(shiftDateKey(selectedDateKey, -1))
  }, [selectedDateKey, navigateToDate])

  const handleNext = useCallback(() => {
    navigateToDate(shiftDateKey(selectedDateKey, 1))
  }, [selectedDateKey, navigateToDate])

  const handleToday = useCallback(() => {
    navigateToDate(getTodayDateKey())
  }, [navigateToDate])

  return (
    <section className="space-y-5 border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <AgendaControls
        dateLabel={dateLabel}
        bookingCount={countBookings(items)}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_260px]">
        <AgendaMiniMonth month={month} onDayClick={navigateToDate} />
        <div className="space-y-5">
          <AgendaWeekStrip days={days} onDayClick={navigateToDate} />
          <AgendaDesktopGrid rows={rows} />
          <AgendaMobileList rows={rows} />
        </div>
        <AgendaDaySummary summary={summary} />
      </div>
    </section>
  )
}
