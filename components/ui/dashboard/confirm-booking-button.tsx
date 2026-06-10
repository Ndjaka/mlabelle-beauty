'use client'

import type { DashboardBookingStatus } from '@/types/dashboard'

type ConfirmBookingButtonProps = {
  onClick: () => void
  status: DashboardBookingStatus
}

export function ConfirmBookingButton({
  onClick,
  status,
}: ConfirmBookingButtonProps) {
  if (status !== 'À confirmer') return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-tertiary px-4 py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-tertiary/90"
    >
      Confirmer le rendez-vous
    </button>
  )
}
