'use client'

import { useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { getSlotsForDate } from '@/features/booking/actions'

interface UseBookingSelectionOptions {
  availableSlots: string[]
  initialDate: Date
  onSlotsChange: (slots: { morning: string[]; afternoon: string[] }) => void
  serviceId: string
}

const EMPTY_SLOTS = { morning: [], afternoon: [] }

function buildBookingUrl(date: Date, serviceId: string, slot?: string | null) {
  const params = new URLSearchParams({ service_id: serviceId })
  if (slot) params.set('slot', slot)

  return `/booking/${format(date, 'yyyy-MM-dd')}?${params.toString()}`
}

function readDateFromBookingPath(pathname: string) {
  const match = pathname.match(/^\/booking\/(\d{4}-\d{2}-\d{2})$/)
  if (!match) return null

  const [year, month, day] = match[1].split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return isNaN(date.getTime()) ? null : date
}

function readMonthParam(month: string | null) {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return null

  const [year, monthNumber] = month.split('-').map(Number)
  const date = new Date(year, monthNumber - 1, 1)
  return isNaN(date.getTime()) ? null : startOfMonth(date)
}

export function useBookingSelection({
  availableSlots,
  initialDate,
  onSlotsChange,
  serviceId,
}: UseBookingSelectionOptions) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const today = startOfDay(new Date())

  const initialSelectedDate = readDateFromBookingPath(pathname) ?? initialDate
  const initialSlot = searchParams.get('slot')
  const dateRequestIdRef = useRef(0)
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate)
  const [selectedSlot, setSelectedSlot] = useState(
    initialSlot && availableSlots.includes(initialSlot) ? initialSlot : null
  )
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(
    readMonthParam(searchParams.get('month')) ?? startOfMonth(initialSelectedDate)
  )

  const monthDays = useMemo(
    () => eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    }),
    [currentMonth]
  )

  function handleMonthChange(month: Date) {
    const nextMonth = startOfMonth(month)
    const params = new URLSearchParams({ service_id: serviceId })
    params.set('month', format(nextMonth, 'yyyy-MM'))
    if (selectedSlot) params.set('slot', selectedSlot)
    setCurrentMonth(nextMonth)
    window.history.replaceState(
      null,
      '',
      `/booking/${format(selectedDate, 'yyyy-MM-dd')}?${params.toString()}`
    )
  }

  async function handleDateSelect(date: Date) {
    if (isBefore(date, today)) return
    if (isSameDay(date, selectedDate)) return

    const requestId = dateRequestIdRef.current + 1
    dateRequestIdRef.current = requestId

    setSelectedDate(date)
    setSelectedSlot(null)
    setCurrentMonth(startOfMonth(date))
    setIsLoadingSlots(true)
    onSlotsChange(EMPTY_SLOTS)
    window.history.replaceState(null, '', buildBookingUrl(date, serviceId))

    try {
      const nextSlots = await getSlotsForDate(format(date, 'yyyy-MM-dd'), serviceId)
      if (dateRequestIdRef.current === requestId) {
        onSlotsChange(nextSlots)
        setIsLoadingSlots(false)
      }
    } catch (error) {
      console.error('Failed to load booking slots', error)
      if (dateRequestIdRef.current === requestId) {
        onSlotsChange(EMPTY_SLOTS)
        setIsLoadingSlots(false)
      }
    }
  }

  function handleSlotSelect(slot: string) {
    setSelectedSlot(slot)
    window.history.replaceState(null, '', buildBookingUrl(selectedDate, serviceId, slot))
  }

  return {
    currentMonth,
    handleDateSelect,
    handleMonthChange,
    handleSlotSelect,
    isLoadingSlots,
    monthDays,
    selectedDate,
    selectedSlot,
    today,
  }
}
