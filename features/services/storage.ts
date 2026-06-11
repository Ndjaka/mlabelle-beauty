'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import {
  getServiceImageExtension,
  SERVICE_IMAGE_BUCKET,
  validateServiceImageFile,
} from '@/features/services/utils'

type ServiceImageUploadResult =
  | { success: true; imageUrl: string }
  | { success: false; error: string }

export async function uploadServiceImage(
  serviceId: string,
  file: File
): Promise<ServiceImageUploadResult> {
  const validationError = validateServiceImageFile(file)
  if (validationError) return { success: false, error: validationError }

  const supabase = createBrowserClient()
  const extension = getServiceImageExtension(file)
  const path = `${serviceId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(SERVICE_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return { success: false, error: `Impossible d’envoyer l’image : ${error.message}` }
  }

  const { data } = supabase.storage.from(SERVICE_IMAGE_BUCKET).getPublicUrl(path)
  return { success: true, imageUrl: data.publicUrl }
}
