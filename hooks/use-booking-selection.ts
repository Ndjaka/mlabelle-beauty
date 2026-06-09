'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { eachDayOfInterval, endOfMonth, format, isBefore, startOfDay, startOfMonth } from 'date-fns'

interface UseBookingSelectionOptions {
  availableSlots: string[]
  initialDate: Date
  serviceId: string
}

function buildBookingUrl(date: Date, serviceId: string, slot?: string | null) {
  const params = new URLSearchParams({ service_id: serviceId })
  if (slot) params.set('slot', slot)

  return `/booking/${format(date, 'yyyy-MM-dd')}?${params.toString()}`
}

function readDateFromBookingPath(pathname: string) {
  const match = pathname.match(/^\/booking\/(\d{4}-\d{2}-\d{2})$/)
  if (!match) return null

  const date = new Date(match[1])
  return isNaN(date.getTime()) ? null : date
}

function readMonthParam(month: string | null) {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return null

  const date = new Date(`${month}-01`)
  return isNaN(date.getTime()) ? null : startOfMonth(date)
}

export function useBookingSelection({
  availableSlots,
  initialDate,
  serviceId,
}: UseBookingSelectionOptions) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const today = startOfDay(new Date())

  const selectedDate = readDateFromBookingPath(pathname) ?? initialDate
  const slotParam = searchParams.get('slot')
  const selectedSlot = slotParam && availableSlots.includes(slotParam) ? slotParam : null
  const currentMonth = readMonthParam(searchParams.get('month')) ?? startOfMonth(selectedDate)

  const monthDays = useMemo(
    () => eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    }),
    [currentMonth]
  )

  function handleMonthChange(month: Date) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('service_id', serviceId)
    params.set('month', format(startOfMonth(month), 'yyyy-MM'))
    window.history.replaceState(null, '', `${pathname}?${params.toString()}`)
  }

  function handleDateSelect(date: Date) {
    if (isBefore(date, today)) return
    router.push(buildBookingUrl(date, serviceId))
  }

  function handleSlotSelect(slot: string) {
    window.history.replaceState(null, '', buildBookingUrl(selectedDate, serviceId, slot))
  }

  function handleConfirm() {
    if (!selectedSlot) return

    router.push(
      `/booking/${format(selectedDate, 'yyyy-MM-dd')}/confirm?service_id=${serviceId}&slot=${encodeURIComponent(selectedSlot)}`
    )
  }

  return {
    currentMonth,
    handleConfirm,
    handleDateSelect,
    handleMonthChange,
    handleSlotSelect,
    monthDays,
    selectedDate,
    selectedSlot,
    today,
  }
}
