'use client'

import { useState } from 'react'
import { uploadServiceImage } from '@/features/services/storage'
import { validateServiceImageFile } from '@/features/services/utils'

export function useServiceImageUpload(initialImageUrl?: string | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  function selectImageFile(file: File | null): string | null {
    if (!file) {
      setImageFile(null)
      setSelectedFileName(null)
      return null
    }

    const validationError = validateServiceImageFile(file)
    if (validationError) return validationError

    setImageFile(file)
    setSelectedFileName(file.name)
    return null
  }

  async function uploadSelectedImage(serviceId: string): Promise<{
    error: string | null
    imageUrl: string | null
  }> {
    if (!imageFile) return { error: null, imageUrl }

    const result = await uploadServiceImage(serviceId, imageFile)
    if (!result.success) return { error: result.error, imageUrl }

    setImageUrl(result.imageUrl)
    setImageFile(null)
    setSelectedFileName(null)
    return { error: null, imageUrl: result.imageUrl }
  }

  return {
    imageUrl,
    selectedFileName,
    selectImageFile,
    uploadSelectedImage,
  }
}
