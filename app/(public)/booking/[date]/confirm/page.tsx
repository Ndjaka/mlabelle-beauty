import { notFound, redirect } from 'next/navigation'
import { BookingFormClient } from '@/components/ui/booking-form-client'
import { getBookingFormData } from '@/features/booking/page-data'
import { buildBookingUnavailableSlotPath } from '@/features/booking/utils'

interface ConfirmPageProps {
  params: Promise<{
    date: string
  }>
  searchParams: Promise<{
    service_id?: string
    slot?: string
  }>
}

export default async function ConfirmPage({ 
  params, 
  searchParams 
}: ConfirmPageProps) {
  const { date } = await params
  const { service_id, slot } = await searchParams

  if (!service_id || !slot) {
    notFound()
  }

  const bookingData = await getBookingFormData({
    dateStr: date,
    serviceId: service_id,
    slot,
  })

  if (!bookingData) {
    redirect(buildBookingUnavailableSlotPath(date, service_id, slot))
  }

  return (
    <BookingFormClient 
      service={bookingData.service}
      date={bookingData.date}
      slot={bookingData.slot}
    />
  )
}
