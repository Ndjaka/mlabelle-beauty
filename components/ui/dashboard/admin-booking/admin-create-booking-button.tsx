'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdminBookingModal } from '@/components/ui/dashboard/admin-booking/admin-booking-modal'
import type { Service } from '@/types/service'

type AdminCreateBookingButtonProps = {
  services: Service[]
  initialDateKey: string
  className?: string
}

export function AdminCreateBookingButton({
  services,
  initialDateKey,
  className,
}: AdminCreateBookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isDisabled = services.length === 0

  return (
    <>
      <Button
        type="button"
        disabled={isDisabled}
        onClick={() => setIsModalOpen(true)}
        className={`flex w-full items-center justify-center gap-2 md:w-auto ${className ?? ''}`}
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
        Ajouter une réservation
      </Button>

      {isModalOpen && (
        <AdminBookingModal
          services={services}
          initialDateKey={initialDateKey}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
