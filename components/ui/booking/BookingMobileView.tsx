'use client'

import type { Service } from '@/types/service'
import { MobileDayPicker } from '@/components/ui/booking/MobileDayPicker'
import { MobileStickyRecap } from '@/components/ui/booking/MobileStickyRecap'
import { TimeSlotGrid } from '@/components/ui/booking/TimeSlotGrid'

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
          <span className="mb-3 inline-flex border border-secondary/25 px-3 py-2 font-label-caps text-[10px] uppercase tracking-[0.22em] text-secondary">
            Étape 1 sur 3
          </span>
          <h1 className="font-serif text-[42px] leading-none text-on-background">
            Choisir un rendez-vous
          </h1>
          <p className="mt-4 font-body-md text-[16px] leading-7 text-on-surface-variant">
            Sélectionnez une date puis un créneau disponible.
          </p>
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
          <div className="text-center py-8 font-body-md text-on-surface-variant">Aucun créneau disponible.</div>
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
