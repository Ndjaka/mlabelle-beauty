import type { CreateBookingInput } from '@/types/booking'

type AdminBookingValidationResult =
  | { success: true }
  | { success: false; error: string }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SLOT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/
const DATE_KEY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

export function buildAdminBookingStartsAt(dateKey: string, slot: string): Date | null {
  const dateMatch = DATE_KEY_REGEX.exec(dateKey)
  const slotMatch = SLOT_REGEX.exec(slot)
  if (!dateMatch || !slotMatch) return null

  const year = Number(dateMatch[1])
  const monthIndex = Number(dateMatch[2]) - 1
  const day = Number(dateMatch[3])
  const date = new Date(
    year,
    monthIndex,
    day,
    Number(slotMatch[1]),
    Number(slotMatch[2]),
    0,
    0
  )

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
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
