'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { Calendar } from '@/components/ui/booking/Calendar'
import { SummaryCard } from '@/components/ui/booking/SummaryCard'
import { TimeSlotGrid } from '@/components/ui/booking/TimeSlotGrid'
import { BookingProgressPills } from '@/components/ui/booking/booking-progress-pills'
import { BookingTrustChips } from '@/components/ui/booking/booking-trust-chips'

interface BookingDesktopViewProps {
  allSlotsCount: number
  currentMonth: Date
  monthDays: Date[]
  onConfirm: () => void
  onDateSelect: (date: Date) => void
  onMonthChange: (date: Date) => void
  onSlotSelect: (slot: string) => void
  selectedDate: Date
  selectedSlot: string | null
  service: Service
  slots: { morning: string[]; afternoon: string[] }
  today: Date
}

export function BookingDesktopView({
  allSlotsCount,
  currentMonth,
  monthDays,
  onConfirm,
  onDateSelect,
  onMonthChange,
  onSlotSelect,
  selectedDate,
  selectedSlot,
  service,
  slots,
  today,
}: BookingDesktopViewProps) {
  return (
    <div className="hidden w-full flex-grow md:block">
      <main className="mx-auto w-full max-w-[1280px] px-8 py-14 xl:px-10 xl:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_370px] xl:gap-10">
          <section className="flex flex-col gap-8">
            <div className="max-w-none">
              <div className="mb-6 max-w-[520px]">
                <BookingProgressPills currentStep={1} />
              </div>
              <h1 className="font-serif text-[56px] leading-none text-on-surface">
                Choisissez votre créneau
              </h1>
              <p className="mt-4 font-body-lg text-[17px] leading-7 text-on-surface-variant md:whitespace-nowrap">
                Votre prestation est prête. Sélectionnez la date et l’heure qui vous conviennent.
              </p>
              <BookingTrustChips />
            </div>

            <div className="border border-secondary/15 bg-surface/70 p-7 shadow-[0_24px_70px_rgba(30,27,21,0.04)]">
              <div className="mb-6 flex items-end justify-between gap-6">
                <div>
                  <p className="font-label-caps text-[10px] uppercase tracking-[0.2em] text-secondary">
                    Disponibilités en ligne
                  </p>
                  <h2 className="mt-2 font-serif text-[34px] leading-tight text-on-surface">
                    Date et créneau
                  </h2>
                  <p className="mt-2 font-body-md text-[14px] text-on-surface-variant">
                    Choisissez un horaire pour passer à vos coordonnées.
                  </p>
                </div>
                <span className="font-body-md text-body-md capitalize text-on-surface-variant">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-7 xl:grid-cols-[320px_minmax(0,1fr)]">
                <Calendar
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  today={today}
                  monthDays={monthDays}
                  onMonthChange={onMonthChange}
                  onDateSelect={onDateSelect}
                />

                <div className="flex flex-col gap-3">
                  <TimeSlotGrid
                    title="Matin"
                    slots={slots.morning}
                    selectedSlot={selectedSlot}
                    onSlotSelect={onSlotSelect}
                    icon="light_mode"
                    columns={2}
                    variant="desktop"
                  />
                  <TimeSlotGrid
                    title="Après-midi"
                    slots={slots.afternoon}
                    selectedSlot={selectedSlot}
                    onSlotSelect={onSlotSelect}
                    icon="sunny"
                    columns={2}
                    variant="desktop"
                  />
                  {allSlotsCount === 0 && (
                    <div className="border border-secondary/15 bg-white p-5 shadow-[0_14px_34px_rgba(30,27,21,0.04)]">
                      <p className="font-body-lg text-[16px] font-semibold text-on-surface">
                        Aucun créneau disponible ce jour.
                      </p>
                      <p className="mt-2 font-body-md text-[14px] leading-6 text-on-surface-variant">
                        Essayez une autre date dans le calendrier pour trouver le prochain rendez-vous.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside>
            <SummaryCard
              service={service}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onConfirm={onConfirm}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
