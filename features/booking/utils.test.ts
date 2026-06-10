// Tests for booking utility functions
import { describe, it, expect } from 'vitest';
import {
  isDayOff,
  isOverlapping,
  parseTimeToDate,
  generateTimeSlots,
  getAvailableSlots,
  formatPrice,
  formatDuration,
  groupBookingsByDay,
  getWeekDays,
  formatMonthlyRevenue,
  groupSlotsByPeriod,
  buildBookingConfirmationPath,
} from './utils';
import type { TimeRange } from '@/types/booking';
import type { BookingWithService } from '@/types/booking';
import type { DayOff, ScheduleRule } from '@/types/schedule';

// --- isDayOff ---

describe('isDayOff', () => {
  const daysOff: DayOff[] = [
    { id: '1', date: '2025-08-15', reason: 'Assomption' },
    { id: '2', date: '2025-12-25', reason: 'Noël' },
  ];

  it('retourne true si la date est dans daysOff', () => {
    const date = new Date('2025-08-15T10:00:00');
    expect(isDayOff(date, daysOff)).toBe(true);
  });

  it("retourne false si la date n'est pas dans daysOff", () => {
    const date = new Date('2025-08-16T10:00:00');
    expect(isDayOff(date, daysOff)).toBe(false);
  });

  it("ignore l'heure (même date à des heures différentes = day off)", () => {
    const morning = new Date('2025-08-15T06:00:00');
    const evening = new Date('2025-08-15T23:59:59');
    expect(isDayOff(morning, daysOff)).toBe(true);
    expect(isDayOff(evening, daysOff)).toBe(true);
  });
});

// --- isOverlapping ---

describe('isOverlapping', () => {
  it('retourne true si overlap complet', () => {
    const a: TimeRange = {
      start: new Date('2025-08-01T09:00:00'),
      end: new Date('2025-08-01T10:00:00'),
    };
    const b: TimeRange = {
      start: new Date('2025-08-01T09:00:00'),
      end: new Date('2025-08-01T10:00:00'),
    };
    expect(isOverlapping(a, b)).toBe(true);
  });

  it('retourne true si overlap partiel', () => {
    const a: TimeRange = {
      start: new Date('2025-08-01T09:00:00'),
      end: new Date('2025-08-01T10:00:00'),
    };
    const b: TimeRange = {
      start: new Date('2025-08-01T09:30:00'),
      end: new Date('2025-08-01T10:30:00'),
    };
    expect(isOverlapping(a, b)).toBe(true);
  });

  it('retourne false si back-to-back (a.end === b.start)', () => {
    const a: TimeRange = {
      start: new Date('2025-08-01T09:00:00'),
      end: new Date('2025-08-01T10:00:00'),
    };
    const b: TimeRange = {
      start: new Date('2025-08-01T10:00:00'),
      end: new Date('2025-08-01T11:00:00'),
    };
    expect(isOverlapping(a, b)).toBe(false);
  });

  it("retourne false si pas d'overlap", () => {
    const a: TimeRange = {
      start: new Date('2025-08-01T09:00:00'),
      end: new Date('2025-08-01T10:00:00'),
    };
    const b: TimeRange = {
      start: new Date('2025-08-01T11:00:00'),
      end: new Date('2025-08-01T12:00:00'),
    };
    expect(isOverlapping(a, b)).toBe(false);
  });
});

// --- parseTimeToDate ---

describe('parseTimeToDate', () => {
  it('combine une date et un horaire HH:MM en un objet Date', () => {
    const date = new Date('2025-08-01T00:00:00');
    const result = parseTimeToDate(date, '09:30');
    expect(result.getHours()).toBe(9);
    expect(result.getMinutes()).toBe(30);
    expect(result.getSeconds()).toBe(0);
  });
});

// --- generateTimeSlots ---

describe('generateTimeSlots', () => {
  it('genere les creneaux de 15 minutes entre 09:00 et 10:00', () => {
    const slots = generateTimeSlots('09:00', '10:00', 15);
    expect(slots).toEqual(['09:00', '09:15', '09:30', '09:45']);
  });

  it("n'inclut pas closeTime dans les resultats", () => {
    const slots = generateTimeSlots('09:00', '09:30', 15);
    expect(slots).toEqual(['09:00', '09:15']);
    expect(slots).not.toContain('09:30');
  });
});

// --- getAvailableSlots ---

describe('getAvailableSlots', () => {
  const date = new Date('2025-08-04T00:00:00'); // Monday
  const scheduleRule: ScheduleRule = {
    id: '1',
    day_of_week: 1,
    open_time: '09:00',
    close_time: '10:00',
    is_active: true,
  };

  it('retourne [] si jour off', () => {
    const daysOff: DayOff[] = [{ id: '1', date: '2025-08-04' }];
    const slots = getAvailableSlots(date, scheduleRule, [], 30, daysOff);
    expect(slots).toEqual([]);
  });

  it('retourne [] si scheduleRule est null', () => {
    const slots = getAvailableSlots(date, null, [], 30, []);
    expect(slots).toEqual([]);
  });

  it('retourne [] si scheduleRule inactive', () => {
    const inactiveRule = { ...scheduleRule, is_active: false };
    const slots = getAvailableSlots(date, inactiveRule, [], 30, []);
    expect(slots).toEqual([]);
  });

  it('exclut les creneaux dont ends_at depasse close_time', () => {
    // Service de 30min, fermeture a 10:00
    // 09:00 → 09:30 OK, 09:15 → 09:45 OK, 09:30 → 10:00 OK (<=), 09:45 → 10:15 exclu
    const slots = getAvailableSlots(date, scheduleRule, [], 30, []);
    expect(slots).toContain('09:00');
    expect(slots).toContain('09:15');
    expect(slots).toContain('09:30');
    expect(slots).not.toContain('09:45');
  });

  it('exclut les creneaux qui chevauchent une reservation existante', () => {
    const existingBookings: TimeRange[] = [
      {
        start: new Date('2025-08-04T09:00:00'),
        end: new Date('2025-08-04T09:30:00'),
      },
    ];
    // Service de 15min: 09:00 et 09:15 overlappent la reservation 09:00-09:30
    const slots = getAvailableSlots(date, scheduleRule, existingBookings, 15, []);
    expect(slots).not.toContain('09:00');
    expect(slots).not.toContain('09:15');
    expect(slots).toContain('09:30');
  });

  it('autorise les creneaux back-to-back avec une reservation existante', () => {
    const existingBookings: TimeRange[] = [
      {
        start: new Date('2025-08-04T09:00:00'),
        end: new Date('2025-08-04T09:30:00'),
      },
    ];
    // Service de 30min, creneau 09:30 → finit a 10:00, pas d overlap avec 09:00-09:30
    const slots = getAvailableSlots(date, scheduleRule, existingBookings, 30, []);
    expect(slots).toContain('09:30');
  });

  it('retourne les creneaux valides correctement', () => {
    // Service de 15min, pas de reservations, ouvert 09:00-10:00
    const slots = getAvailableSlots(date, scheduleRule, [], 15, []);
    expect(slots).toEqual(['09:00', '09:15', '09:30', '09:45']);
  });
});

// --- formatPrice ---

describe('formatPrice', () => {
  it('4500 -> "45,00 €"', () => {
    expect(formatPrice(4500)).toBe('45,00 €');
  });

  it('2500 -> "25,00 €"', () => {
    expect(formatPrice(2500)).toBe('25,00 €');
  });

  it('0 -> "0,00 €"', () => {
    expect(formatPrice(0)).toBe('0,00 €');
  });
});

// --- formatDuration ---

describe('formatDuration', () => {
  it('30 -> "30min"', () => {
    expect(formatDuration(30)).toBe('30min');
  });

  it('60 -> "1h"', () => {
    expect(formatDuration(60)).toBe('1h');
  });

  it('90 -> "1h30"', () => {
    expect(formatDuration(90)).toBe('1h30');
  });
});

// --- groupBookingsByDay ---

describe('groupBookingsByDay', () => {
  const makeBooking = (id: string, startsAt: string): BookingWithService => ({
    id,
    client_name: 'Test',
    client_email: 'test@test.fr',
    starts_at: startsAt,
    ends_at: startsAt,
    status: 'confirmed',
    cancel_token: 'token',
    service: { name: 'Coupe', duration_minutes: 30, price_cents: 3000 },
  });

  it('groupe les réservations par date ISO', () => {
    const bookings = [
      makeBooking('1', '2025-08-04T09:00:00'),
      makeBooking('2', '2025-08-04T10:00:00'),
      makeBooking('3', '2025-08-05T09:00:00'),
    ];
    const grouped = groupBookingsByDay(bookings);
    expect(Object.keys(grouped)).toEqual(['2025-08-04', '2025-08-05']);
    expect(grouped['2025-08-04']).toHaveLength(2);
    expect(grouped['2025-08-05']).toHaveLength(1);
  });

  it('retourne un objet vide si aucune réservation', () => {
    const grouped = groupBookingsByDay([]);
    expect(grouped).toEqual({});
  });
});

// --- getWeekDays ---

describe('getWeekDays', () => {
  it('retourne 7 jours commençant par lundi', () => {
    // 2025-08-06 is a Wednesday
    const days = getWeekDays(new Date('2025-08-06T12:00:00'));
    expect(days).toHaveLength(7);
    // Monday = Aug 4
    expect(days[0].getDate()).toBe(4);
    expect(days[0].getDay()).toBe(1); // Monday
    // Sunday = Aug 10
    expect(days[6].getDate()).toBe(10);
    expect(days[6].getDay()).toBe(0); // Sunday
  });

  it('gère le dimanche correctement (recule à lundi)', () => {
    // 2025-08-10 is a Sunday
    const days = getWeekDays(new Date('2025-08-10T12:00:00'));
    expect(days[0].getDate()).toBe(4); // Monday Aug 4
    expect(days[6].getDate()).toBe(10); // Sunday Aug 10
  });

  it('gère le lundi correctement', () => {
    // 2025-08-04 is a Monday
    const days = getWeekDays(new Date('2025-08-04T12:00:00'));
    expect(days[0].getDate()).toBe(4);
    expect(days[0].getDay()).toBe(1); // Monday
  });
});

// --- formatMonthlyRevenue ---

describe('formatMonthlyRevenue', () => {
  it('150000 -> "1 500,00 €"', () => {
    expect(formatMonthlyRevenue(150000)).toBe('1 500,00 €');
  });

  it('0 -> "0,00 €"', () => {
    expect(formatMonthlyRevenue(0)).toBe('0,00 €');
  });

  it('4500 -> "45,00 €"', () => {
    expect(formatMonthlyRevenue(4500)).toBe('45,00 €');
  });

  it('1000000 -> "10 000,00 €"', () => {
    expect(formatMonthlyRevenue(1000000)).toBe('10 000,00 €');
  });

  it('99 -> "0,99 €"', () => {
    expect(formatMonthlyRevenue(99)).toBe('0,99 €');
  });
});

// --- groupSlotsByPeriod ---

describe('groupSlotsByPeriod', () => {
  it('sépare correctement matin et après-midi', () => {
    const slots = ['09:00', '10:30', '12:45', '13:00', '14:15', '17:30'];
    const result = groupSlotsByPeriod(slots);
    expect(result.morning).toEqual(['09:00', '10:30', '12:45']);
    expect(result.afternoon).toEqual(['13:00', '14:15', '17:30']);
  });

  it('gère les tableaux vides', () => {
    const result = groupSlotsByPeriod([]);
    expect(result.morning).toEqual([]);
    expect(result.afternoon).toEqual([]);
  });

  it('gère uniquement le matin', () => {
    const slots = ['09:00', '10:00'];
    const result = groupSlotsByPeriod(slots);
    expect(result.morning).toEqual(['09:00', '10:00']);
    expect(result.afternoon).toEqual([]);
  });
});

// --- buildBookingConfirmationPath ---

describe('buildBookingConfirmationPath', () => {
  it('inclut le booking id et le token d annulation', () => {
    const bookingId = 'booking-123';
    const cancelToken = 'cancel-token-456';

    const result = buildBookingConfirmationPath(bookingId, cancelToken);

    expect(result).toBe('/booking/confirmation?booking_id=booking-123&token=cancel-token-456');
  });

  it('encode les paramètres d URL', () => {
    const bookingId = 'booking 123';
    const cancelToken = 'token/456';

    const result = buildBookingConfirmationPath(bookingId, cancelToken);

    expect(result).toBe('/booking/confirmation?booking_id=booking+123&token=token%2F456');
  });
});
