import { notFound } from 'next/navigation'
import { BookingFormClient } from '@/components/ui/booking-form-client'
import { getBookingFormData } from '@/features/booking/page-data'

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
    notFound()
  }

  return (
    <BookingFormClient 
      service={bookingData.service}
      date={bookingData.date}
      slot={bookingData.slot}
    />
  )
}
