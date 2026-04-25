// Pure functions for booking logic — slot calculation, validation, etc.
// No Supabase calls here — only pure logic.

import type { TimeRange } from '@/types/booking';
import type { BookingWithService } from '@/types/booking';
import type { DayOff, ScheduleRule } from '@/types/schedule';

export const SLOT_INTERVAL_MINUTES = 15;
export const MAX_ADVANCE_BOOKING_DAYS = 60;

/**
 * Returns true if the given date is a day off.
 * Compares only the date part (ignores time).
 */
export function isDayOff(date: Date, daysOff: DayOff[]): boolean {
  const dateStr = formatDateToISO(date);
  return daysOff.some((dayOff) => dayOff.date === dateStr);
}

/**
 * Returns true if two time ranges overlap.
 * Back-to-back is allowed: a.end === b.start returns false.
 */
export function isOverlapping(a: TimeRange, b: TimeRange): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Combines a date and a "HH:MM" time string into a Date object.
 */
export function parseTimeToDate(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Generates all time slots between openTime and closeTime at the given interval.
 * Does NOT include closeTime in the results.
 * Returns an array of "HH:MM" strings.
 */
export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  intervalMinutes: number
): string[] {
  const slots: string[] = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);

  const openTotalMinutes = openH * 60 + openM;
  const closeTotalMinutes = closeH * 60 + closeM;

  for (let m = openTotalMinutes; m < closeTotalMinutes; m += intervalMinutes) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }

  return slots;
}

/**
 * Returns available time slots for a given date, schedule, and existing bookings.
 * See booking-logic skill for the full algorithm.
 */
export function getAvailableSlots(
  date: Date,
  scheduleRule: ScheduleRule | null,
  existingBookings: TimeRange[],
  serviceDurationMinutes: number,
  daysOff: DayOff[]
): string[] {
  // 1. Check day off
  if (isDayOff(date, daysOff)) return [];

  // 2. Check schedule rule exists and is active
  if (!scheduleRule || !scheduleRule.is_active) return [];

  // 3. Generate all possible slots
  const slots = generateTimeSlots(
    scheduleRule.open_time,
    scheduleRule.close_time,
    SLOT_INTERVAL_MINUTES
  );

  // 4. Filter slots that fit the service duration without overlap
  return slots.filter((slot) => {
    const slotStart = parseTimeToDate(date, slot);
    const slotEnd = addMinutes(slotStart, serviceDurationMinutes);

    // Must end before or at closing time
    const closingTime = parseTimeToDate(date, scheduleRule.close_time);
    if (slotEnd > closingTime) return false;

    // Must not overlap existing bookings
    return !existingBookings.some((booking) =>
      isOverlapping(
        { start: slotStart, end: slotEnd },
        { start: booking.start, end: booking.end }
      )
    );
  });
}

/**
 * Formats a price in cents to a human-readable string.
 * 4500 → "45,00 €"
 */
export function formatPrice(cents: number): string {
  const euros = (cents / 100).toFixed(2).replace('.', ',');
  return `${euros} €`;
}

/**
 * Formats a duration in minutes to a human-readable string.
 * 30 → "30min", 60 → "1h", 90 → "1h30"
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}`;
}

/**
 * Groups bookings by their date (YYYY-MM-DD key).
 */
export function groupBookingsByDay(
  bookings: BookingWithService[]
): Record<string, BookingWithService[]> {
  const groups: Record<string, BookingWithService[]> = {};

  for (const booking of bookings) {
    const dateKey = booking.starts_at.split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(booking);
  }

  return groups;
}

/**
 * Returns the 7 days of the week (Monday → Sunday) containing the given date.
 */
export function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    return dayDate;
  });
}

/**
 * Formats monthly revenue from cents to a display string with thousands separator.
 * 150000 → "1 500,00 €"
 */
export function formatMonthlyRevenue(cents: number): string {
  const euros = cents / 100;
  const formatted = euros.toFixed(2).replace('.', ',');
  // Add thousands separator (space)
  const parts = formatted.split(',');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${parts.join(',')} €`;
}

/**
 * Groups a list of time slots ("HH:MM") into morning (09:00 → 12:45) and afternoon (13:00 → 18:00).
 */
export function groupSlotsByPeriod(slots: string[]): { morning: string[]; afternoon: string[] } {
  const morning: string[] = [];
  const afternoon: string[] = [];

  for (const slot of slots) {
    const [h] = slot.split(':').map(Number);
    if (h < 13) {
      morning.push(slot);
    } else {
      afternoon.push(slot);
    }
  }

  return { morning, afternoon };
}

// --- Internal helpers ---

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
