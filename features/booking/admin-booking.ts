import type { CreateBookingInput } from '@/types/booking'
import { buildSalonDateTimeFromSlot } from '@/features/booking/salon-time'

type AdminBookingValidationResult =
  | { success: true }
  | { success: false; error: string }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function buildAdminBookingStartsAt(dateKey: string, slot: string): Date | null {
  return buildSalonDateTimeFromSlot(dateKey, slot)
}

export function validateAdminBookingInput(
  data: CreateBookingInput,
  now: Date = new Date()
): AdminBookingValidationResult {
  if (!data.client_name.trim()) {
    return { success: false, error: 'Le nom du client est requis.' }
  }

  if (!EMAIL_REGEX.test(data.client_email)) {
    return { success: false, error: 'Adresse email invalide.' }
  }

  if (!data.service_id) {
    return { success: false, error: 'La prestation est requise.' }
  }

  if (Number.isNaN(data.starts_at.getTime())) {
    return { success: false, error: 'Date ou créneau invalide.' }
  }

  if (data.starts_at <= now) {
    return { success: false, error: 'Le créneau doit être dans le futur.' }
  }

  return { success: true }
}
