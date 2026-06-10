import { notFound } from 'next/navigation'
import { getBookingByIdAndCancelToken } from '@/features/booking/queries'
import { BookingConfirmationClient } from '@/components/ui/booking-confirmation-client'

interface ConfirmationPageProps {
  searchParams: Promise<{
    booking_id?: string
    token?: string
  }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { booking_id, token } = await searchParams

  if (!booking_id || !token) {
    notFound()
  }

  const booking = await getBookingByIdAndCancelToken(booking_id, token)

  if (!booking) {
    notFound()
  }

  return (
    <BookingConfirmationClient booking={booking} />
  )
}
