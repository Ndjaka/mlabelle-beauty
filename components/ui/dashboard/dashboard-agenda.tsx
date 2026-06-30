'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { AgendaControls } from '@/components/ui/dashboard/agenda/agenda-controls'
import { AgendaDaySummary } from '@/components/ui/dashboard/agenda/agenda-day-summary'
import { AgendaDesktopGrid } from '@/components/ui/dashboard/agenda/agenda-desktop-grid'
import { AgendaMiniMonth } from '@/components/ui/dashboard/agenda/agenda-mini-month'
import { AgendaMobileList } from '@/components/ui/dashboard/agenda/agenda-mobile-list'
import { AgendaWeekGrid } from '@/components/ui/dashboard/agenda/agenda-week-grid'
import { AgendaWeekStrip } from '@/components/ui/dashboard/agenda/agenda-week-strip'
import { BookingDetailPanel } from '@/components/ui/dashboard/booking-detail-panel'
import {
  buildDashboardAgendaUrl,
  countDashboardAgendaViewBookings,
  getTodayDashboardAgendaDateKey,
  mapAgendaItemToRecentBooking,
  shiftDashboardAgendaDateKey,
} from '@/features/dashboard/agenda-navigation'
import { buildDashboardAgendaHourRows } from '@/features/dashboard/utils'
import type {
  AgendaViewMode,
  DashboardAgendaDay,
  DashboardAgendaItem,
  DashboardAgendaMonth,
  DashboardAgendaSummary,
  DashboardAgendaWeekColumn,
  DashboardRecentBooking,
} from '@/types/dashboard'

type DashboardAgendaProps = {
  items: DashboardAgendaItem[]
  days: DashboardAgendaDay[]
  month: DashboardAgendaMonth
  summary: DashboardAgendaSummary
  weekColumns: DashboardAgendaWeekColumn[]
  dateLabel: string
  selectedDateKey: string
  view: AgendaViewMode
}

export function DashboardAgenda({
  items,
  days,
  month,
  summary,
  weekColumns,
  dateLabel,
  selectedDateKey,
  view,
}: DashboardAgendaProps) {
  const router = useRouter()
  const rows = buildDashboardAgendaHourRows(items)
  const [selectedBooking, setSelectedBooking] = useState<DashboardRecentBooking | null>(null)

  const navigateToDate = useCallback(
    (dateKey: string, targetView: AgendaViewMode = view) => {
      router.push(buildDashboardAgendaUrl(dateKey, targetView))
    },
    [router, view]
  )

  const handlePrev = useCallback(() => {
    const offset = view === 'week' ? -7 : -1
    navigateToDate(shiftDashboardAgendaDateKey(selectedDateKey, offset))
  }, [selectedDateKey, view, navigateToDate])

  const handleNext = useCallback(() => {
    const offset = view === 'week' ? 7 : 1
    navigateToDate(shiftDashboardAgendaDateKey(selectedDateKey, offset))
  }, [selectedDateKey, view, navigateToDate])

  const handleToday = useCallback(() => {
    navigateToDate(getTodayDashboardAgendaDateKey())
  }, [navigateToDate])

  const handleViewChange = useCallback(
    (newView: AgendaViewMode) => {
      navigateToDate(selectedDateKey, newView)
    },
    [selectedDateKey, navigateToDate]
  )

  const handleDayClick = useCallback(
    (dateKey: string) => {
      navigateToDate(dateKey, 'day')
    },
    [navigateToDate]
  )

  const handleBookingClick = useCallback((item: DashboardAgendaItem) => {
    setSelectedBooking(mapAgendaItemToRecentBooking(item))
  }, [])

  return (
    <section className="space-y-5 border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <AgendaControls
        dateLabel={dateLabel}
        bookingCount={countDashboardAgendaViewBookings(view, items, weekColumns)}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />
      <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_260px]">
        <AgendaMiniMonth month={month} onDayClick={handleDayClick} />
        <div className="min-w-0 space-y-5">
          {view === 'day' ? (
            <>
              <AgendaWeekStrip days={days} onDayClick={handleDayClick} />
              <AgendaMobileList rows={rows} onBookingClick={handleBookingClick} />
              <AgendaDesktopGrid rows={rows} onBookingClick={handleBookingClick} />
            </>
          ) : (
            <AgendaWeekGrid
              columns={weekColumns}
              selectedDateKey={selectedDateKey}
              onDayClick={handleDayClick}
              onBookingClick={handleBookingClick}
            />
          )}
        </div>

        <AgendaDaySummary summary={summary} />
      </div>

      {selectedBooking && (
        <BookingDetailPanel
          booking={selectedBooking}
          isOpen
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </section>
  )
}
