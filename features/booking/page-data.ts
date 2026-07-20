import type { Service } from '@/types/service';
import { getAvailableSlots, groupSlotsByPeriod } from '@/features/booking/utils';
import {
  getActiveServiceById,
  getBookingsForDate,
  getDaysOff,
  getScheduleRule,
} from '@/features/booking/queries';
import { getSalonDayOfWeek, parseSalonDateKey } from '@/features/booking/salon-time';

interface BookingSelectionData {
  service: Service;
  date: Date;
  initialSlots: { morning: string[]; afternoon: string[] };
}

interface BookingFormData {
  service: Service;
  date: Date;
  slot: string;
}

export async function getBookingSelectionData({
  dateStr,
  serviceId,
}: {
  dateStr: string;
  serviceId: string;
}): Promise<BookingSelectionData | null> {
  const service = await getActiveServiceById(serviceId);
  if (!service) return null;

  const date = parseBookingDate(dateStr);
  if (!date) return null;

  const initialSlots = await getGroupedSlotsForService(date, service.duration_minutes);

  return {
    service,
    date,
    initialSlots,
  };
}

export async function getBookingFormData({
  dateStr,
  serviceId,
  slot,
}: {
  dateStr: string;
  serviceId: string;
  slot: string;
}): Promise<BookingFormData | null> {
  const service = await getActiveServiceById(serviceId);
  if (!service) return null;

  const date = parseBookingDate(dateStr);
  if (!date) return null;

  const slots = await getGroupedSlotsForService(date, service.duration_minutes);
  if (!normalizeSelectedSlot(slot, slots)) return null;

  return { service, date, slot };
}

async function getGroupedSlotsForService(
  date: Date,
  serviceDurationMinutes: number
): Promise<{ morning: string[]; afternoon: string[] }> {
  const dayOfWeek = getSalonDayOfWeek(date);
  const [scheduleRule, bookings, daysOff] = await Promise.all([
    getScheduleRule(dayOfWeek),
    getBookingsForDate(date),
    getDaysOff(),
  ]);

  return groupSlotsByPeriod(
    getAvailableSlots(date, scheduleRule, bookings, serviceDurationMinutes, daysOff)
  );
}

function parseBookingDate(dateStr: string): Date | null {
  return parseSalonDateKey(dateStr);
}

function normalizeSelectedSlot(
  slot: string | null | undefined,
  slots: { morning: string[]; afternoon: string[] }
): string | null {
  if (!slot) return null;
  return [...slots.morning, ...slots.afternoon].includes(slot) ? slot : null;
}
