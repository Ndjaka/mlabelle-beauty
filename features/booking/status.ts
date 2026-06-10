import type { BookingStatus } from '@/types/booking';

export const CLIENT_CREATED_BOOKING_STATUS: BookingStatus = 'confirmed';

export const BOOKING_STATUSES_BLOCKING_AVAILABILITY: BookingStatus[] = [
  'pending',
  'confirmed',
];

export const BOOKING_STATUS_COUNTED_AS_REVENUE: BookingStatus = 'confirmed';

export function isBookingBlockingAvailability(status: BookingStatus): boolean {
  return BOOKING_STATUSES_BLOCKING_AVAILABILITY.includes(status);
}
