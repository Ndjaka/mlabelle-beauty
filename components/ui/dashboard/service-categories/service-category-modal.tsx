'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  createServiceCategoryAction,
  updateServiceCategoryAction,
} from '@/features/service-categories/actions'
import type { ServiceCategory } from '@/types/service-category'

type ServiceCategoryModalProps = {
  category: ServiceCategory | null
  onClose: () => void
  onSaved: () => void
}

export function ServiceCategoryModal({
  category,
  onClose,
  onSaved,
}: ServiceCategoryModalProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEditing = category !== null

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = category
        ? await updateServiceCategoryAction(category.id, name)
        : await createServiceCategoryAction(name)

      if (!result.success) {
        setError(result.error ?? 'Une erreur est survenue.')
        return
      }

      onSaved()
    })
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40"
        aria-label="Fermer la fenêtre"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 bg-background shadow-xl"
      >
        <header className="flex items-start justify-between border-b border-outline-variant px-6 py-5">
          <div>
            <p className="label-caps text-secondary">Configuration</p>
            <h2 id="category-modal-title" className="mt-2 font-serif text-2xl text-foreground">
              {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-foreground/60">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {error && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <label className="block" htmlFor="category-name">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-foreground/65">
              Nom de la catégorie
            </span>
            <input
              id="category-name"
              value={name}
              maxLength={80}
              autoFocus
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-outline-variant bg-transparent px-3 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-secondary"
              placeholder="Ex. Tresses"
            />
          </label>
          <footer className="flex flex-col-reverse gap-3 border-t border-outline-variant pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement…' : isEditing ? 'Enregistrer' : 'Créer la catégorie'}
            </Button>
          </footer>
        </form>
      </section>
    </>
  )
}
