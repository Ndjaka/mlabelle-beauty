'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit'
import { confirmBookingByAdmin } from '@/features/booking/actions'

type ConfirmBookingModalProps = {
  bookingId: string
  clientName: string
  serviceName: string
  onClose: () => void
  onConfirmed: () => void
}

export function ConfirmBookingModal({
  bookingId,
  clientName,
  serviceName,
  onClose,
  onConfirmed,
}: ConfirmBookingModalProps) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      onClose()
    }
  }

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await confirmBookingByAdmin(bookingId)

      if (result.success) {
        toast.success('Réservation confirmée')
        router.refresh()
        onConfirmed()
        return
      }

      const message = result.error ?? 'Une erreur est survenue.'
      setError(message)
      toast.error(message)
    })
  }

  return (
    <dialog
      ref={dialogRef}
      open
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[60] m-0 flex h-full w-full items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-md border border-outline-variant bg-background p-6 shadow-xl">
        <p className="label-caps text-secondary">Validation acompte</p>
        <h2 className="mt-2 font-serif text-2xl text-foreground">
          Confirmer ce rendez-vous ?
        </h2>

        <div className="mt-5 space-y-1 border border-outline-variant bg-surface-container-low p-4 text-sm">
          <p className="font-semibold text-foreground">{clientName}</p>
          <p className="text-foreground/65">{serviceName}</p>
        </div>

        <p className="mt-4 text-sm leading-6 text-foreground/65">
          Assurez-vous que l&apos;acompte de {BOOKING_DEPOSIT_LABEL} a bien été reçu. La cliente recevra ensuite un email de confirmation.
        </p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="border border-outline-variant px-4 py-3 text-xs font-semibold uppercase text-foreground transition-colors hover:border-secondary disabled:opacity-50"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-foreground px-4 py-3 text-xs font-semibold uppercase text-background transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? 'En cours...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </dialog>
  )
}
