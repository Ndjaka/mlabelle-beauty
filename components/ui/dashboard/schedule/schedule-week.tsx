'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateMultipleScheduleRulesAction } from '@/features/schedule/actions'
import type { ScheduleRule } from '@/types/schedule'
import { Button } from '@/components/ui/button'

type ScheduleWeekProps = {
  rules: ScheduleRule[]
}

const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0]
const DAY_NAMES: Record<number, string> = {
  1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 0: 'Dimanche'
}

export function ScheduleWeek({ rules }: ScheduleWeekProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [draftRules, setDraftRules] = useState<Record<string, ScheduleRule>>(() => {
    const acc: Record<string, ScheduleRule> = {}
    for (const r of rules) {
      acc[r.id] = { ...r }
    }
    return acc
  })

  // Compare draftRules with original rules
  const hasChanges = rules.some((rule) => {
    const draft = draftRules[rule.id]
    if (!draft) return false
    return (
      draft.is_active !== rule.is_active ||
      draft.open_time !== rule.open_time ||
      draft.close_time !== rule.close_time
    )
  })

  function handleUpdateRule(id: string, updates: Partial<ScheduleRule>) {
    setDraftRules((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }))
  }

  function handleSave() {
    // Only send the ones that changed
    const updates = rules.reduce((acc, rule) => {
      const draft = draftRules[rule.id]
      if (
        draft &&
        (draft.is_active !== rule.is_active ||
        draft.open_time !== rule.open_time ||
        draft.close_time !== rule.close_time)
      ) {
        acc.push({
          id: rule.id,
          data: {
            is_active: draft.is_active,
            open_time: draft.open_time,
            close_time: draft.close_time,
          }
        })
      }
      return acc
    }, [] as { id: string; data: Partial<Omit<ScheduleRule, 'id'>> }[])

    if (updates.length === 0) return

    startTransition(async () => {
      const result = await updateMultipleScheduleRulesAction(updates)
      if (result.success) {
        toast.success('Horaires mis à jour avec succès')
        router.refresh()
      } else {
        toast.error(result.error ?? 'Impossible de mettre à jour les horaires')
      }
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3">
        {ORDERED_DAYS.map((dayOfWeek) => {
          const originalRule = rules.find((r) => r.day_of_week === dayOfWeek)
          if (!originalRule) return null
          
          const rule = draftRules[originalRule.id]
          if (!rule) return null
          
          return (
            <div 
              key={rule.id} 
              className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md p-3 transition-colors ${rule.is_active ? 'bg-white shadow-sm border border-outline-variant/30' : 'bg-transparent border border-transparent'}`}
            >
              <div className="flex items-center gap-3 sm:w-1/3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={rule.is_active}
                  onClick={() => handleUpdateRule(rule.id, { is_active: !rule.is_active })}
                  disabled={isPending}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
                    rule.is_active ? 'bg-secondary' : 'bg-outline-variant'
                  } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="sr-only">Statut du jour</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block size-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      rule.is_active ? 'translate-x-2' : '-translate-x-2'
                    }`}
                  />
                </button>
                <span className={`font-medium ${rule.is_active ? 'text-foreground' : 'text-foreground/50'}`}>
                  {DAY_NAMES[dayOfWeek]}
                </span>
              </div>
              
              <div className="flex items-center gap-2 sm:w-2/3 sm:justify-end">
                {rule.is_active ? (
                  <>
                    <input
                      type="time"
                      value={rule.open_time.substring(0, 5)}
                      onChange={(e) => handleUpdateRule(rule.id, { open_time: e.target.value + ':00' })}
                      disabled={isPending}
                      className="rounded-md border border-outline-variant bg-transparent px-3 py-1.5 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
                    />
                    <span className="text-foreground/60">-</span>
                    <input
                      type="time"
                      value={rule.close_time.substring(0, 5)}
                      onChange={(e) => handleUpdateRule(rule.id, { close_time: e.target.value + ':00' })}
                      disabled={isPending}
                      className="rounded-md border border-outline-variant bg-transparent px-3 py-1.5 text-sm text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
                    />
                  </>
                ) : (
                  <span className="text-sm font-medium text-foreground/45 italic">Fermé</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {hasChanges && (
        <div className="flex justify-end border-t border-outline-variant pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isPending}
            className="flex items-center gap-2"
          >
            {isPending && (
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
            )}
            Enregistrer les modifications
          </Button>
        </div>
      )}
    </div>
  )
}
