'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { ServiceFormField } from '@/components/ui/dashboard/services/service-form-field'
import { ServiceImageUploadField } from '@/components/ui/dashboard/services/service-image-upload-field'
import { ServiceModalFooter } from '@/components/ui/dashboard/services/service-modal-footer'
import { ServiceModalHeader } from '@/components/ui/dashboard/services/service-modal-header'
import { saveServiceWithImage } from '@/features/services/save-service-with-image'
import {
  buildServiceInputFromFormValues,
  formatServiceDurationHint,
} from '@/features/services/utils'
import { useServiceImageUpload } from '@/hooks/use-service-image-upload'
import type { Service } from '@/types/service'

type ServiceModalProps = {
  service: Service | null
  onClose: () => void
}

const inputClassName = 'w-full border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary'

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [name, setName] = useState(service?.name ?? '')
  const [description, setDescription] = useState(service?.description ?? '')
  const [duration, setDuration] = useState(service?.duration_minutes?.toString() ?? '60')
  const [price, setPrice] = useState(service ? (service.price_cents / 100).toString() : '')
  const serviceImage = useServiceImageUpload(service?.image_url)
  const isEditing = Boolean(service)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMsg(null)

    const input = buildServiceInputFromFormValues({ name, description, duration, price })
    if (!input.success) {
      setErrorMsg(input.error)
      return
    }

    startTransition(async () => {
      const result = await saveServiceWithImage({
        data: input.data,
        service,
        uploadSelectedImage: serviceImage.uploadSelectedImage,
      })
      handleActionResult(result)
    })
  }

  function handleActionResult(result: { success: boolean; error?: string }) {
    if (!result.success) {
      toast.error(result.error ?? 'Une erreur est survenue')
      return
    }

    closeAfterSave()
  }

  function closeAfterSave() {
    toast.success(isEditing ? 'Prestation modifiée avec succès' : 'Prestation créée avec succès')
    router.refresh()
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-background shadow-xl">
        <ServiceModalHeader isEditing={isEditing} onClose={onClose} />

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {errorMsg && (
            <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
          <ServiceImageUploadField
            disabled={isPending}
            imageUrl={serviceImage.imageUrl}
            selectedFileName={serviceImage.selectedFileName}
            serviceName={name}
            onFileChange={(file) => {
              const imageError = serviceImage.selectImageFile(file)
              setErrorMsg(imageError)
            }}
          />
          <ServiceFormField label="Nom de la prestation" htmlFor="name">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
            />
          </ServiceFormField>
          <ServiceFormField label="Description" htmlFor="description" hint="Optionnel">
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={inputClassName}
            />
          </ServiceFormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <ServiceFormField
              label="Durée (minutes)"
              htmlFor="duration"
              hint={formatServiceDurationHint(duration)}
            >
              <input
                id="duration"
                type="text"
                placeholder="ex: 90"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className={inputClassName}
              />
            </ServiceFormField>
            <ServiceFormField label="Prix (€)" htmlFor="price">
              <input
                id="price"
                type="text"
                placeholder="ex: 45 ou 45.50"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={inputClassName}
              />
            </ServiceFormField>
          </div>
          <ServiceModalFooter isPending={isPending} onClose={onClose} />
        </form>
      </div>
    </>
  )
}
