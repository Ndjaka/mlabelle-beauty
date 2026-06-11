'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createServiceAction, updateServiceAction } from '@/features/services/actions'
import type { Service, CreateServiceInput } from '@/types/service'
import { Button } from '@/components/ui/button'

type ServiceModalProps = {
  service: Service | null
  onClose: () => void
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isEditing = !!service

  const formatDurationHint = (minsStr: string) => {
    const m = parseInt(minsStr, 10)
    if (isNaN(m) || m <= 0) return ''
    const hours = Math.floor(m / 60)
    const mins = m % 60
    if (hours > 0) {
      return `(${hours}h${mins > 0 ? mins.toString().padStart(2, '0') : '00'})`
    }
    return `(${mins} min)`
  }

  const [name, setName] = useState(service?.name ?? '')
  const [description, setDescription] = useState(service?.description ?? '')
  const [durationStr, setDurationStr] = useState(service?.duration_minutes?.toString() ?? '60')
  const [priceText, setPriceText] = useState(service ? (service.price_cents / 100).toString() : '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg('Le nom est requis')
      return
    }

    const durationMinutes = parseInt(durationStr, 10)
    if (isNaN(durationMinutes) || durationMinutes < 5) {
      setErrorMsg('La durée minimum est de 5 minutes')
      return
    }

    const parsedPrice = parseFloat(priceText.replace(',', '.'))
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMsg('Le prix doit être un nombre valide (ex: 45 ou 45.50)')
      return
    }

    startTransition(async () => {
      // Convert euros back to cents for the API
      const inputData: CreateServiceInput = {
        name: name.trim(),
        description: description.trim() || null,
        duration_minutes: durationMinutes,
        price_cents: Math.round(parsedPrice * 100),
      }

      const result = isEditing
        ? await updateServiceAction(service.id, inputData)
        : await createServiceAction(inputData)

      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setErrorMsg(result.error || 'Une erreur est survenue')
      }
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h2 className="font-serif text-2xl text-foreground">
            {isEditing ? 'Modifier la prestation' : 'Nouvelle prestation'}
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/65 hover:text-foreground p-2"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {errorMsg && (
            <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold uppercase text-foreground/70">
              Nom de la prestation
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-semibold uppercase text-foreground/70">
              Description <span className="text-foreground/45 normal-case font-normal">(Optionnel)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="duration" className="flex items-center gap-2 text-xs font-semibold uppercase text-foreground/70">
                Durée (minutes)
                <span className="text-foreground/50 lowercase normal-case">{formatDurationHint(durationStr)}</span>
              </label>
              <input
                id="duration"
                type="text"
                placeholder="ex: 90"
                value={durationStr}
                onChange={(e) => setDurationStr(e.target.value)}
                className="w-full border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="price" className="text-xs font-semibold uppercase text-foreground/70">
                Prix (€)
              </label>
              <input
                id="price"
                type="text"
                placeholder="ex: 45 ou 45.50"
                value={priceText}
                onChange={(e) => setPriceText(e.target.value)}
                className="w-full border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-secondary px-6 py-2 text-sm font-semibold uppercase text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
            >
              {isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
