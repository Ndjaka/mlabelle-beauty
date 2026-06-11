import type { ChangeEvent } from 'react'
import { ServiceImagePreview } from '@/components/ui/dashboard/services/service-image-preview'

type ServiceImageUploadFieldProps = {
  disabled?: boolean
  imageUrl?: string | null
  selectedFileName?: string | null
  serviceName: string
  onFileChange: (file: File | null) => void
}

export function ServiceImageUploadField({
  disabled = false,
  imageUrl,
  selectedFileName,
  serviceName,
  onFileChange,
}: ServiceImageUploadFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onFileChange(event.target.files?.[0] ?? null)
  }

  return (
    <div className="border border-outline-variant bg-surface-container-low p-4">
      <div className="flex items-center gap-4">
        <ServiceImagePreview
          imageUrl={imageUrl}
          label={serviceName || 'la prestation'}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-foreground/70">
            Image de prestation
          </p>
          <p className="mt-1 text-sm leading-5 text-foreground/55">
            {selectedFileName ?? 'JPG, PNG ou WebP, 5 Mo maximum.'}
          </p>
        </div>
      </div>
      <label
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center border border-outline-variant px-4 py-3 text-xs font-semibold uppercase text-foreground transition-colors hover:border-secondary disabled:cursor-not-allowed"
      >
        {selectedFileName ? 'Changer l’image' : 'Ajouter une image'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={disabled}
          onChange={handleChange}
        />
      </label>
    </div>
  )
}
