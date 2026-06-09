'use client'

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
  const availableSlots = [...initialSlots.morning, ...initialSlots.afternoon]
  const bookingSelection = useBookingSelection({
    availableSlots,
    initialDate,
    serviceId: service.id,
  })
  const allSlotsCount = availableSlots.length

  return (
    <>
      <BookingMobileView
        allSlotsCount={allSlotsCount}
        currentMonth={bookingSelection.currentMonth}
        monthDays={bookingSelection.monthDays}
        onConfirm={bookingSelection.handleConfirm}
        onDateSelect={bookingSelection.handleDateSelect}
        onMonthChange={bookingSelection.handleMonthChange}
        onSlotSelect={bookingSelection.handleSlotSelect}
        selectedDate={bookingSelection.selectedDate}
        selectedSlot={bookingSelection.selectedSlot}
        service={service}
        slots={initialSlots}
        today={bookingSelection.today}
      />

      <BookingDesktopView
        allSlotsCount={allSlotsCount}
        currentMonth={bookingSelection.currentMonth}
        monthDays={bookingSelection.monthDays}
        onConfirm={bookingSelection.handleConfirm}
        onDateSelect={bookingSelection.handleDateSelect}
        onMonthChange={bookingSelection.handleMonthChange}
        onSlotSelect={bookingSelection.handleSlotSelect}
        selectedDate={bookingSelection.selectedDate}
        selectedSlot={bookingSelection.selectedSlot}
        service={service}
        slots={initialSlots}
        today={bookingSelection.today}
      />
    </>
  )
}
