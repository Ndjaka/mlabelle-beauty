'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Service } from '@/types/service'
import { bookAppointment } from '@/features/booking/actions'
import { buildSalonDateTimeFromSlot, formatSalonDateKey } from '@/features/booking/salon-time'
import {
  buildBookingConfirmationPath,
  buildBookingUnavailableSlotPath,
  isBookingSlotUnavailableError,
} from '@/features/booking/utils'
import { BookingFormHeader } from '@/components/ui/booking/BookingFormHeader'
import { BookingFormSummary } from '@/components/ui/booking/BookingFormSummary'
import { BookingFormStickySummary } from '@/components/ui/booking/BookingFormStickySummary'
import { BookingSubmitButton } from '@/components/ui/booking/BookingSubmitButton'
import { ClientDetailsFields } from '@/components/ui/booking/ClientDetailsFields'

interface BookingFormClientProps {
  service: Service
  date: Date
  slot: string
}

const INITIAL_FORM_DATA = { firstName: '', lastName: '', email: '', phone: '' }

export function BookingFormClient({ service, date, slot }: BookingFormClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const dateKey = formatSalonDateKey(date)
      const startsAt = buildSalonDateTimeFromSlot(dateKey, slot)
      if (!startsAt) {
        setError('Le créneau sélectionné est invalide.')
        return
      }

      const result = await bookAppointment({
        service_id: service.id,
        client_name: `${formData.firstName} ${formData.lastName}`.trim(),
        client_email: formData.email,
        client_phone: formData.phone.trim(),
        starts_at: startsAt,
      })

      if (result.success && result.bookingId && result.cancelToken) {
        router.push(buildBookingConfirmationPath(result.bookingId, result.cancelToken))
        return
      }

      if (result.success) {
        setError('La réservation a été créée, mais le lien de confirmation est incomplet.')
        return
      }

      if (isBookingSlotUnavailableError(result.error)) {
        router.replace(buildBookingUnavailableSlotPath(dateKey, service.id, slot))
        return
      }

      setError(result.error || 'Une erreur est survenue.')
    } catch {
      setError('Une erreur est survenue lors de la réservation.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.firstName.trim() !== ''
    && formData.lastName.trim() !== ''
    && formData.email.trim() !== ''
    && formData.email.includes('@')
    && formData.phone.trim() !== ''

  return (
    <div className="flex flex-grow flex-col bg-background selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="mx-auto grid w-full max-w-[1180px] flex-1 gap-8 px-5 pb-[230px] pt-6 md:grid-cols-[minmax(0,1fr)_360px] md:px-8 md:py-14 lg:gap-12 xl:px-0">
        <section className="min-w-0">
          <BookingFormHeader />

          <form
            onSubmit={handleSubmit}
            className="border border-secondary/15 bg-surface/70 p-5 shadow-[0_18px_45px_rgba(30,27,21,0.04)] md:p-7"
          >
            <div className="mb-5 border-b border-outline-variant/25 pb-4">
              <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
                Informations personnelles
              </p>
              <p className="mt-2 font-body-md text-[13px] leading-5 text-on-surface-variant">
                Les champs marqués d’un astérisque sont nécessaires pour envoyer la demande.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <ClientDetailsFields formData={formData} idSuffix="booking" onChange={handleChange} />

              <div className="border border-secondary/15 bg-white p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    lock
                  </span>
                  <p className="font-body-md text-[13px] leading-5 text-on-surface-variant">
                    Vos informations servent uniquement à traiter cette demande de rendez-vous.
                  </p>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="border border-error/25 bg-error/5 p-4 font-body-md text-[14px] text-error"
                >
                  {error}
                </p>
              )}

              <div className="hidden md:block">
                <BookingSubmitButton
                  isFormValid={isFormValid}
                  loading={loading}
                  label="ENVOYER MA DEMANDE"
                />
              </div>
            </div>
          </form>
        </section>

        <aside className="hidden md:block">
          <BookingFormSummary service={service} date={date} slot={slot} />
        </aside>
      </main>

      <BookingFormStickySummary
        date={date}
        isFormValid={isFormValid}
        loading={loading}
        onSubmit={() => {
          void handleSubmit()
        }}
        service={service}
        slot={slot}
      />
    </div>
  )
}
