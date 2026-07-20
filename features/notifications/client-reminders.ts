import { markClientReminderSent } from '@/features/booking/mutations';
import { getConfirmedBookingsDueForClientReminder } from '@/features/booking/queries';
import { formatSalonDateLong, formatSalonTime } from '@/features/booking/salon-time';
import {
  formatDuration,
  formatPrice,
  getClientReminderWindow,
} from '@/features/booking/utils';
import { sendBookingReminder, type BookingEmailData } from '@/features/notifications/email';
import type { BookingWithService, ClientReminderKind } from '@/types/booking';

interface ReminderRunResult {
  matched: number;
  sent: number;
  failed: number;
}

export interface ClientReminderJobResult {
  dayBefore: ReminderRunResult;
  twoHoursBefore: ReminderRunResult;
}

export async function runClientReminderJob(
  now: Date = new Date()
): Promise<ClientReminderJobResult> {
  const [dayBefore, twoHoursBefore] = await Promise.all([
    sendClientRemindersForKind('day_before', now),
    sendClientRemindersForKind('two_hours_before', now),
  ]);

  return { dayBefore, twoHoursBefore };
}

async function sendClientRemindersForKind(
  kind: ClientReminderKind,
  now: Date
): Promise<ReminderRunResult> {
  const window = getClientReminderWindow(kind, now);
  const bookings = await getConfirmedBookingsDueForClientReminder(
    kind,
    window.start,
    window.end
  );
  const result: ReminderRunResult = {
    matched: bookings.length,
    sent: 0,
    failed: 0,
  };

  for (const booking of bookings) {
    try {
      await sendBookingReminder(buildBookingEmailData(booking), kind);
      await markClientReminderSent(booking.id, kind, new Date());
      result.sent += 1;
    } catch (error) {
      result.failed += 1;
      console.error('Failed to send client reminder', {
        bookingId: booking.id,
        kind,
        error,
      });
    }
  }

  return result;
}

function buildBookingEmailData(booking: BookingWithService): BookingEmailData {
  const startsAt = new Date(booking.starts_at);

  return {
    clientName: booking.client_name,
    clientEmail: booking.client_email,
    clientPhone: booking.client_phone,
    serviceName: booking.service.name,
    date: formatSalonDateLong(startsAt),
    slot: formatSalonTime(startsAt),
    duration: formatDuration(booking.service.duration_minutes),
    price: formatPrice(booking.service.price_cents),
    cancelToken: booking.cancel_token,
  };
}
