'use client'

import { useMemo, useState } from 'react'
import type { Service } from '@/types/service'
import { useBookingSelection } from '@/hooks/use-booking-selection'
import { BookingDesktopView } from '@/components/ui/booking/BookingDesktopView'
import { BookingMobileView } from '@/components/ui/booking/BookingMobileView'

interface BookingClientProps {
  service: Service
  initialDate: Date
  initialSlots: { morning: string[]; afternoon: string[] }
}

export function BookingClient({
  service,
  initialDate,
  initialSlots,
}: BookingClientProps) {
  const [slots, setSlots] = useState(initialSlots)
  const availableSlots = useMemo(
    () => [...slots.morning, ...slots.afternoon],
    [slots]
  )
  const bookingSelection = useBookingSelection({
    availableSlots,
    initialDate,
    onSlotsChange: setSlots,
    serviceId: service.id,
  })
  const allSlotsCount = availableSlots.length

  return (
    <>
      <BookingMobileView
        allSlotsCount={allSlotsCount}
        currentMonth={bookingSelection.currentMonth}
        monthDays={bookingSelection.monthDays}
        onDateSelect={bookingSelection.handleDateSelect}
        onMonthChange={bookingSelection.handleMonthChange}
        onSlotSelect={bookingSelection.handleSlotSelect}
        isLoadingSlots={bookingSelection.isLoadingSlots}
        selectedDate={bookingSelection.selectedDate}
        selectedSlot={bookingSelection.selectedSlot}
        service={service}
        slots={slots}
        today={bookingSelection.today}
      />

      <BookingDesktopView
        allSlotsCount={allSlotsCount}
        currentMonth={bookingSelection.currentMonth}
        monthDays={bookingSelection.monthDays}
        onDateSelect={bookingSelection.handleDateSelect}
        onMonthChange={bookingSelection.handleMonthChange}
        onSlotSelect={bookingSelection.handleSlotSelect}
        isLoadingSlots={bookingSelection.isLoadingSlots}
        selectedDate={bookingSelection.selectedDate}
        selectedSlot={bookingSelection.selectedSlot}
        service={service}
        slots={slots}
        today={bookingSelection.today}
      />
    </>
  )
}
