'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toggleServiceAction } from '@/features/services/actions'
import { cn } from '@/lib/utils'

type ServiceStatusToggleProps = {
  serviceId: string
  isActive: boolean
  onError?: (message: string) => void
}

export function ServiceStatusToggle({
  serviceId,
  isActive,
  onError,
}: ServiceStatusToggleProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      const newStatus = !isActive
      const result = await toggleServiceAction(serviceId, newStatus)
      if (result.success) {
        toast.success(newStatus ? 'Prestation activée' : 'Prestation désactivée')
        router.refresh()
      } else {
        const message = result.error ?? 'Impossible de modifier le statut.'
        toast.error(message)
        onError?.(message)
      }
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2',
        isActive ? 'bg-secondary' : 'bg-outline-variant',
        isPending && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="sr-only">Statut de la prestation</span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block size-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          isActive ? 'translate-x-2' : '-translate-x-2'
        )}
      />
    </button>
  )
}
