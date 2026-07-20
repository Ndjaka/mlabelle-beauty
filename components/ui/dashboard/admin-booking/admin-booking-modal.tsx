'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { AdminBookingClientFields } from '@/components/ui/dashboard/admin-booking/admin-booking-client-fields'
import { AdminBookingModalFooter } from '@/components/ui/dashboard/admin-booking/admin-booking-modal-footer'
import { AdminBookingModalHeader } from '@/components/ui/dashboard/admin-booking/admin-booking-modal-header'
import { AdminBookingServiceFields } from '@/components/ui/dashboard/admin-booking/admin-booking-service-fields'
import { AdminBookingSlotPicker } from '@/components/ui/dashboard/admin-booking/admin-booking-slot-picker'
import { createBookingByAdmin, getSlotsForDate } from '@/features/booking/actions'
import { buildAdminBookingStartsAt } from '@/features/booking/admin-booking'
import type { Service } from '@/types/service'

type AdminBookingModalProps = {
  services: Service[]
  initialDateKey: string
  onClose: () => void
}

const inputClassName = 'w-full border border-outline-variant bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary'

export function AdminBookingModal({ services, initialDateKey, onClose }: AdminBookingModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const initialServiceId = services[0]?.id ?? ''
  const [serviceId, setServiceId] = useState(initialServiceId)
  const [dateKey, setDateKey] = useState(initialDateKey)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [morningSlots, setMorningSlots] = useState<string[]>([])
  const [afternoonSlots, setAfternoonSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(Boolean(initialServiceId && initialDateKey))
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!serviceId || !dateKey) return
    let ignoreResult = false
    getSlotsForDate(dateKey, serviceId)
      .then((slots) => {
        if (ignoreResult) return
        setMorningSlots(slots.morning)
        setAfternoonSlots(slots.afternoon)
      })
      .catch(() => {
        if (ignoreResult) return
        setError('Impossible de charger les créneaux.')
        setMorningSlots([])
        setAfternoonSlots([])
      })
      .finally(() => {
        if (!ignoreResult) setIsLoadingSlots(false)
      })

    return () => {
      ignoreResult = true
    }
  }, [dateKey, serviceId])
  function handleServiceChange(nextServiceId: string) {
    setServiceId(nextServiceId)
    setSelectedSlot('')
    setError(null)
    setIsLoadingSlots(Boolean(nextServiceId && dateKey))
  }
  function handleDateChange(nextDateKey: string) {
    setDateKey(nextDateKey)
    setSelectedSlot('')
    setError(null)
    setIsLoadingSlots(Boolean(serviceId && nextDateKey))
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const startsAt = buildAdminBookingStartsAt(dateKey, selectedSlot)
    if (!startsAt) {
      setError('Sélectionnez une date et un créneau valides.')
      return
    }

    startTransition(async () => {
      const result = await createBookingByAdmin({
        service_id: serviceId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone.trim() || undefined,
        starts_at: startsAt,
      })

      if (!result.success) {
        setError(result.error ?? 'Impossible de créer la réservation.')
        return
      }

      toast.success('Réservation ajoutée à l’agenda')
      router.refresh()
      onClose()
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 transition-opacity" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="admin-booking-title" className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-background shadow-xl">
        <AdminBookingModalHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {error && <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <AdminBookingServiceFields
            services={services}
            serviceId={serviceId}
            dateKey={dateKey}
            inputClassName={inputClassName}
            onServiceChange={handleServiceChange}
            onDateChange={handleDateChange}
          />

          <AdminBookingSlotPicker
            morningSlots={morningSlots}
            afternoonSlots={afternoonSlots}
            selectedSlot={selectedSlot}
            isLoading={isLoadingSlots}
            onSlotSelect={setSelectedSlot}
          />

          <AdminBookingClientFields
            clientName={clientName}
            clientEmail={clientEmail}
            clientPhone={clientPhone}
            inputClassName={inputClassName}
            onClientNameChange={setClientName}
            onClientEmailChange={setClientEmail}
            onClientPhoneChange={setClientPhone}
          />

          <AdminBookingModalFooter
            isPending={isPending}
            isDisabled={isPending || isLoadingSlots || !selectedSlot}
            onClose={onClose}
          />
        </form>
      </div>
    </>
  )
}
