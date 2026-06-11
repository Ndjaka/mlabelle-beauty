'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Service } from '@/types/service'
import { bookAppointment } from '@/features/booking/actions'
import { buildBookingConfirmationPath } from '@/features/booking/utils'
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

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

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
      const [hours, minutes] = slot.split(':').map(Number)
      const startsAt = new Date(date)
      startsAt.setHours(hours, minutes, 0, 0)

      const result = await bookAppointment({
        service_id: service.id,
        client_name: `${formData.firstName} ${formData.lastName}`.trim(),
        client_email: formData.email,
        client_phone: formData.phone || undefined,
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

  return (
    <>
      <div className="hidden md:flex flex-col flex-grow bg-background">
        <main className="flex-grow flex justify-center py-xxl px-xxl w-full max-w-container-max mx-auto">
          <div className="flex flex-col lg:flex-row w-full gap-xxl">
            <section className="w-full lg:w-3/5 flex flex-col">
              <BookingFormHeader titleClassName="font-h1 text-h1 text-on-background mb-sm" />

              <form onSubmit={handleSubmit} className="space-y-xl flex-grow flex flex-col">
                <ClientDetailsFields formData={formData} idSuffix="dt" onChange={handleChange} />
                {error && <p className="text-error font-body-md">{error}</p>}
                <div className="mt-auto">
                  <BookingSubmitButton
                    isFormValid={isFormValid}
                    loading={loading}
                    label="VALIDER MES INFORMATIONS"
                  />
                </div>
              </form>
            </section>

            <aside className="w-full lg:w-2/5">
              <BookingFormSummary service={service} date={date} slot={slot} />
            </aside>
          </div>
        </main>
      </div>

      <div className="flex md:hidden flex-col flex-grow bg-background selection:bg-secondary-container selection:text-on-secondary-container">
        <main className="flex-1 pt-12 pb-[250px] px-6 max-w-container-max mx-auto w-full flex flex-col gap-6">
          <BookingFormHeader titleClassName="font-h3 text-h3 text-on-surface" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-lg w-full">
            <ClientDetailsFields formData={formData} idSuffix="mob" onChange={handleChange} />
          </form>

          {error && <p className="text-error font-body-md text-center">{error}</p>}
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
    </>
  )
}
