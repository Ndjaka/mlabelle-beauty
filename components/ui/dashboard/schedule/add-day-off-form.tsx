'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { addDayOffAction } from '@/features/schedule/actions'
import { Button } from '@/components/ui/button'

export function AddDayOffForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (!date) {
      toast.error('Veuillez sélectionner une date')
      return
    }

    startTransition(async () => {
      const result = await addDayOffAction(date, reason || undefined)
      if (result.success) {
        toast.success('Congé ajouté avec succès')
        setDate('')
        setReason('')
        router.refresh()
      } else {
        toast.error(result.error ?? 'Impossible d\'ajouter ce congé')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-md bg-white border border-outline-variant/30 p-4 shadow-sm">
      <h3 className="font-sans text-sm font-semibold text-foreground">Ajouter une fermeture</h3>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="date" className="text-xs font-medium text-foreground/70">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="reason" className="text-xs font-medium text-foreground/70">
            Motif (optionnel)
          </label>
          <input
            id="reason"
            type="text"
            placeholder="Ex: Vacances d'été"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isPending || !date} 
          className="mt-2 w-full sm:mt-0 sm:w-auto"
        >
          Ajouter
        </Button>
      </div>
    </form>
  )
}
