import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createServiceAction, updateServiceAction } from '@/features/services/actions'
import { saveServiceWithImage } from '@/features/services/save-service-with-image'
import type { CreateServiceInput, Service } from '@/types/service'

vi.mock('@/features/services/actions', () => ({
  createServiceAction: vi.fn(),
  updateServiceAction: vi.fn(),
}))

const SERVICE_INPUT: CreateServiceInput = {
  name: 'Brushing',
  description: 'Mise en forme',
  duration_minutes: 45,
  price_cents: 3500,
}

const SAVED_SERVICE: Service = {
  id: 'service-id',
  name: 'Brushing',
  description: 'Mise en forme',
  image_url: null,
  duration_minutes: 45,
  price_cents: 3500,
  is_active: true,
}

describe('saveServiceWithImage', () => {
  const createServiceActionMock = vi.mocked(createServiceAction)
  const updateServiceActionMock = vi.mocked(updateServiceAction)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates an existing service with the uploaded image URL', async () => {
    const uploadSelectedImage = vi.fn().mockResolvedValue({
      error: null,
      imageUrl: 'https://storage.example/brushing.webp',
    })
    updateServiceActionMock.mockResolvedValue({ success: true, service: SAVED_SERVICE })

    const result = await saveServiceWithImage({
      data: SERVICE_INPUT,
      service: SAVED_SERVICE,
      uploadSelectedImage,
    })

    expect(result).toEqual({ success: true, service: SAVED_SERVICE })
    expect(uploadSelectedImage).toHaveBeenCalledWith('service-id')
    expect(updateServiceActionMock).toHaveBeenCalledWith('service-id', {
      ...SERVICE_INPUT,
      image_url: 'https://storage.example/brushing.webp',
    })
  })

  it('creates a new service without updating it when no image is selected', async () => {
    const uploadSelectedImage = vi.fn().mockResolvedValue({
      error: null,
      imageUrl: null,
    })
    createServiceActionMock.mockResolvedValue({ success: true, service: SAVED_SERVICE })

    const result = await saveServiceWithImage({
      data: SERVICE_INPUT,
      service: null,
      uploadSelectedImage,
    })

    expect(result).toEqual({ success: true })
    expect(uploadSelectedImage).toHaveBeenCalledWith('service-id')
    expect(updateServiceActionMock).not.toHaveBeenCalled()
  })

  it('creates then updates a new service when an image is selected', async () => {
    const uploadSelectedImage = vi.fn().mockResolvedValue({
      error: null,
      imageUrl: 'https://storage.example/brushing.webp',
    })
    createServiceActionMock.mockResolvedValue({ success: true, service: SAVED_SERVICE })
    updateServiceActionMock.mockResolvedValue({ success: true, service: SAVED_SERVICE })

    const result = await saveServiceWithImage({
      data: SERVICE_INPUT,
      service: null,
      uploadSelectedImage,
    })

    expect(result).toEqual({ success: true, service: SAVED_SERVICE })
    expect(updateServiceActionMock).toHaveBeenCalledWith('service-id', {
      image_url: 'https://storage.example/brushing.webp',
    })
  })

  it('returns the upload error without updating the service', async () => {
    const uploadSelectedImage = vi.fn().mockResolvedValue({
      error: 'Image invalide',
      imageUrl: null,
    })

    const result = await saveServiceWithImage({
      data: SERVICE_INPUT,
      service: SAVED_SERVICE,
      uploadSelectedImage,
    })

    expect(result).toEqual({ success: false, error: 'Image invalide' })
    expect(updateServiceActionMock).not.toHaveBeenCalled()
  })
})
