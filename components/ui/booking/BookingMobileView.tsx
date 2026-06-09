'use client'

import type { Service } from '@/types/service'
import { MobileDayPicker } from '@/components/ui/booking/MobileDayPicker'
import { MobileStickyRecap } from '@/components/ui/booking/MobileStickyRecap'
import { ServiceRecap } from '@/components/ui/booking/ServiceRecap'
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
    <div className="md:hidden flex flex-col bg-background pb-[120px]">
      <main className="flex-grow px-gutter pt-lg">
        <div className="mb-xl text-center mt-4">
          <h1 className="font-h2 text-h2 text-on-background mb-sm">Votre parenthèse beauté</h1>
          <p className="font-normal text-[16px] text-on-surface-variant">Sélectionnez le moment parfait pour vous.</p>
        </div>

        <ServiceRecap service={service} />

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
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onConfirm={onConfirm}
      />
    </div>
  )
}
