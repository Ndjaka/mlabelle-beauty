import type { CreateServiceInput } from '@/types/service'

export const SERVICE_IMAGE_BUCKET = 'service-images'
export const SERVICE_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024
export const SERVICE_IMAGE_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

type ServiceFormValues = {
  name: string
  description: string
  duration: string
  price: string
}

type ServiceFormResult =
  | { success: true; data: CreateServiceInput }
  | { success: false; error: string }

type ServiceImageFileLike = {
  name: string
  size: number
  type: string
}

export function parseServiceDurationMinutes(value: string): number | null {
  const durationMinutes = Number.parseInt(value, 10)
  if (Number.isNaN(durationMinutes) || durationMinutes < 5) return null

  return durationMinutes
}

export function parseServicePriceCents(value: string): number | null {
  const parsedPrice = Number.parseFloat(value.replace(',', '.'))
  if (Number.isNaN(parsedPrice) || parsedPrice < 0) return null

  return Math.round(parsedPrice * 100)
}

export function formatServiceDurationHint(value: string): string {
  const durationMinutes = Number.parseInt(value, 10)
  if (Number.isNaN(durationMinutes) || durationMinutes <= 0) return ''

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  if (hours === 0) return `(${minutes} min)`

  return `(${hours}h${minutes > 0 ? String(minutes).padStart(2, '0') : '00'})`
}

export function buildServiceInputFromFormValues(
  values: ServiceFormValues
): ServiceFormResult {
  const name = values.name.trim()
  if (!name) return { success: false, error: 'Le nom est requis' }

  const durationMinutes = parseServiceDurationMinutes(values.duration)
  if (!durationMinutes) {
    return { success: false, error: 'La durée minimum est de 5 minutes' }
  }

  const priceCents = parseServicePriceCents(values.price)
  if (priceCents === null) {
    return { success: false, error: 'Le prix doit être un nombre valide (ex: 45 ou 45.50)' }
  }

  return {
    success: true,
    data: {
      name,
      description: values.description.trim() || null,
      duration_minutes: durationMinutes,
      price_cents: priceCents,
    },
  }
}

export function validateServiceImageFile(file: ServiceImageFileLike): string | null {
  if (!SERVICE_IMAGE_ACCEPTED_TYPES.includes(file.type as typeof SERVICE_IMAGE_ACCEPTED_TYPES[number])) {
    return 'Formats acceptés : JPG, PNG ou WebP.'
  }

  if (file.size > SERVICE_IMAGE_MAX_SIZE_BYTES) {
    return 'L’image ne doit pas dépasser 5 Mo.'
  }

  return null
}

export function getServiceImageExtension(file: ServiceImageFileLike): string {
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}
