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

function buildAgendaUrl(dateKey: string, view: AgendaViewMode): string {
  const params = new URLSearchParams()
  params.set('date', dateKey)
  if (view === 'week') params.set('view', 'week')
  return `/agenda?${params.toString()}`
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
      router.push(buildAgendaUrl(dateKey, targetView))
    },
    [router, view]
  )

  const handlePrev = useCallback(() => {
    const offset = view === 'week' ? -7 : -1
    navigateToDate(shiftDateKey(selectedDateKey, offset))
  }, [selectedDateKey, view, navigateToDate])

  const handleNext = useCallback(() => {
    const offset = view === 'week' ? 7 : 1
    navigateToDate(shiftDateKey(selectedDateKey, offset))
  }, [selectedDateKey, view, navigateToDate])

  const handleToday = useCallback(() => {
    navigateToDate(getTodayDateKey())
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
    if (item.kind === 'booking') {
      setSelectedBooking({
        id: item.id,
        client: item.client,
        service: item.service,
        date: item.date,
        time: item.time,
        duration: item.duration,
        price: item.price,
        status: item.status,
        email: item.email,
        phone: item.phone,
        note: '',
      })
    }
  }, [])

  return (
    <section className="space-y-5 border border-outline-variant bg-surface-container-low p-5 md:p-6">
      <AgendaControls
        dateLabel={dateLabel}
        bookingCount={countBookings(items)}
        view={view}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
      />
      <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_260px]">
        <AgendaMiniMonth month={month} onDayClick={handleDayClick} />
        
        <div className="space-y-5">
          {/* Always show day view on mobile */}
          <div className="md:hidden space-y-5">
            <AgendaWeekStrip days={days} onDayClick={handleDayClick} />
            <AgendaMobileList rows={rows} onBookingClick={handleBookingClick} />
          </div>

          {/* Desktop views */}
          <div className="hidden md:block space-y-5">
            {view === 'day' ? (
              <>
                <AgendaWeekStrip days={days} onDayClick={handleDayClick} />
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
