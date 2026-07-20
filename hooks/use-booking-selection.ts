'use client'

import { useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  eachDayOfInterval,
  endOfMonth,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { getSlotsForDate } from '@/features/booking/actions'
import { formatSalonDateKey } from '@/features/booking/salon-time'
import { BOOKING_SLOT_UNAVAILABLE_MESSAGE } from '@/features/booking/utils'

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

  return `/booking/${formatSalonDateKey(date)}?${params.toString()}`
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
  const unavailableSlot = searchParams.get('unavailable_slot')
  const dateRequestIdRef = useRef(0)
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate)
  const [selectedSlot, setSelectedSlot] = useState(
    initialSlot && availableSlots.includes(initialSlot) ? initialSlot : null
  )
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [slotNotice, setSlotNotice] = useState(
    unavailableSlot ? BOOKING_SLOT_UNAVAILABLE_MESSAGE : null
  )
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
    params.set('month', formatSalonDateKey(nextMonth).slice(0, 7))
    if (selectedSlot) params.set('slot', selectedSlot)
    setCurrentMonth(nextMonth)
    setSlotNotice(null)
    window.history.replaceState(
      null,
      '',
      `/booking/${formatSalonDateKey(selectedDate)}?${params.toString()}`
    )
  }

  async function handleDateSelect(date: Date) {
    if (isBefore(date, today)) return
    if (isSameDay(date, selectedDate)) return

    const requestId = dateRequestIdRef.current + 1
    dateRequestIdRef.current = requestId

    setSelectedDate(date)
    setSelectedSlot(null)
    setSlotNotice(null)
    setCurrentMonth(startOfMonth(date))
    setIsLoadingSlots(true)
    onSlotsChange(EMPTY_SLOTS)
    window.history.replaceState(null, '', buildBookingUrl(date, serviceId))

    try {
      const nextSlots = await getSlotsForDate(formatSalonDateKey(date), serviceId)
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
    setSlotNotice(null)
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
    slotNotice,
    today,
  }
}
