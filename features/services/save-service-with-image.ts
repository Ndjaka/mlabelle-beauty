'use client'

import { createServiceAction, updateServiceAction } from '@/features/services/actions'
import type { ActionResult } from '@/types/action'
import type { CreateServiceInput, Service } from '@/types/service'

type ImageUploadResult = {
  error: string | null
  imageUrl: string | null
}

type SaveServiceWithImageParams = {
  data: CreateServiceInput
  service: Service | null
  uploadSelectedImage: (serviceId: string) => Promise<ImageUploadResult>
}

export async function saveServiceWithImage({
  data,
  service,
  uploadSelectedImage,
}: SaveServiceWithImageParams): Promise<ActionResult> {
  if (service) {
    const imageUpload = await uploadSelectedImage(service.id)
    if (imageUpload.error) return { success: false, error: imageUpload.error }

    return updateServiceAction(service.id, {
      ...data,
      image_url: imageUpload.imageUrl,
    })
  }

  const createResult = await createServiceAction(data)
  if (!createResult.success || !createResult.service) {
    return {
      success: false,
      error: createResult.error ?? 'Une erreur est survenue',
    }
  }

  const imageUpload = await uploadSelectedImage(createResult.service.id)
  if (imageUpload.error) return { success: false, error: imageUpload.error }
  if (!imageUpload.imageUrl) return { success: true }

  return updateServiceAction(createResult.service.id, {
    image_url: imageUpload.imageUrl,
  })
}
