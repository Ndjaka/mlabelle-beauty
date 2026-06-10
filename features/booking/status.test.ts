import { describe, expect, it } from 'vitest';
import {
  BOOKING_STATUS_COUNTED_AS_REVENUE,
  BOOKING_STATUSES_BLOCKING_AVAILABILITY,
  CLIENT_CREATED_BOOKING_STATUS,
  isBookingBlockingAvailability,
} from '@/features/booking/status';

describe('booking status rules', () => {
  it('creates client bookings as confirmed', () => {
    expect(CLIENT_CREATED_BOOKING_STATUS).toBe('confirmed');
  });

  it('keeps pending bookings blocking availability for existing data', () => {
    expect(BOOKING_STATUSES_BLOCKING_AVAILABILITY).toEqual([
      'pending',
      'confirmed',
    ]);
    expect(isBookingBlockingAvailability('pending')).toBe(true);
    expect(isBookingBlockingAvailability('confirmed')).toBe(true);
    expect(isBookingBlockingAvailability('cancelled')).toBe(false);
  });

  it('counts only confirmed bookings as revenue', () => {
    expect(BOOKING_STATUS_COUNTED_AS_REVENUE).toBe('confirmed');
  });
});
