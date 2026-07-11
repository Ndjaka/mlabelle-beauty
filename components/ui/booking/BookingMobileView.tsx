'use client'

import type { Service } from '@/types/service'
import { MobileDayPicker } from '@/components/ui/booking/MobileDayPicker'
import { MobileStickyRecap } from '@/components/ui/booking/MobileStickyRecap'
import { TimeSlotGrid } from '@/components/ui/booking/TimeSlotGrid'
import { BookingProgressPills } from '@/components/ui/booking/booking-progress-pills'
import { BookingTrustChips } from '@/components/ui/booking/booking-trust-chips'

interface BookingMobileViewProps {
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

export function BookingMobileView({
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
}: BookingMobileViewProps) {
  return (
    <div className="flex flex-col bg-background pb-[190px] md:hidden">
      <main className="flex-grow px-5 pt-8">
        <div className="mb-7">
          <BookingProgressPills currentStep={1} />
          <h1 className="mt-6 font-serif text-[42px] leading-none text-on-background">
            Choisissez votre créneau
          </h1>
          <p className="mt-4 font-body-md text-[16px] leading-7 text-on-surface-variant">
            Votre prestation est prête. Sélectionnez maintenant la date et l’heure qui vous arrangent.
          </p>
          <BookingTrustChips />
        </div>

        <MobileDayPicker
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          today={today}
          monthDays={monthDays}
          onMonthChange={onMonthChange}
          onDateSelect={onDateSelect}
        />

        <TimeSlotGrid
          title="Matin"
          slots={slots.morning}
          selectedSlot={selectedSlot}
          onSlotSelect={onSlotSelect}
          icon="wb_sunny"
          columns={3}
          variant="mobile"
        />
        <TimeSlotGrid
          title="Après-midi"
          slots={slots.afternoon}
          selectedSlot={selectedSlot}
          onSlotSelect={onSlotSelect}
          icon="partly_cloudy_day"
          columns={3}
          variant="mobile"
        />
        {allSlotsCount === 0 && (
          <div className="border border-secondary/15 bg-white p-5 text-center shadow-[0_14px_34px_rgba(30,27,21,0.04)]">
            <p className="font-body-lg text-[16px] font-semibold text-on-surface">
              Aucun créneau disponible ce jour.
            </p>
            <p className="mt-2 font-body-md text-[14px] leading-6 text-on-surface-variant">
              Essayez une autre date dans le calendrier pour trouver le prochain rendez-vous.
            </p>
          </div>
        )}
      </main>

      <MobileStickyRecap
        service={service}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onConfirm={onConfirm}
      />
    </div>
  )
}
