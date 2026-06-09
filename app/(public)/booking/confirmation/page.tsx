import { notFound } from 'next/navigation'
import { getBookingById } from '@/features/booking/queries'
import { BookingConfirmationClient } from '@/components/ui/booking-confirmation-client'

interface ConfirmationPageProps {
  searchParams: Promise<{
    booking_id?: string
  }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { booking_id } = await searchParams

  if (!booking_id) {
    notFound()
  }

  const booking = await getBookingById(booking_id)

  if (!booking) {
    notFound()
  }

  return (
    <BookingConfirmationClient booking={booking} />
  )
}
