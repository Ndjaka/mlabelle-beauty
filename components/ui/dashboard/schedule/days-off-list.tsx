'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { removeDayOffAction } from '@/features/schedule/actions'
import type { DayOff } from '@/types/schedule'

type DaysOffListProps = {
  daysOff: DayOff[]
}

export function DaysOffList({ daysOff }: DaysOffListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await removeDayOffAction(id)
      if (result.success) {
        toast.success('Congé supprimé avec succès')
        router.refresh()
      } else {
        toast.error(result.error ?? 'Impossible de supprimer ce congé')
      }
    })
  }

  if (daysOff.length === 0) {
    return (
      <div className="border border-dashed border-outline-variant bg-transparent px-4 py-6 text-center text-sm text-foreground/55">
        Aucune fermeture exceptionnelle prévue.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {daysOff.map((day) => {
        const dateObj = new Date(day.date)
        const dateFormatted = new Intl.DateTimeFormat('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(dateObj)

        return (
          <div 
            key={day.id} 
            className="flex items-center justify-between rounded-md bg-white border border-outline-variant/30 p-3 shadow-sm"
          >
            <div className="flex flex-col">
              <span className="font-medium text-foreground capitalize">{dateFormatted}</span>
              {day.reason && (
                <span className="text-xs text-foreground/60 mt-0.5">{day.reason}</span>
              )}
            </div>
            <button
              onClick={() => handleDelete(day.id)}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              title="Supprimer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                delete
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
