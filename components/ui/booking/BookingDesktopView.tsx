'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { Calendar } from '@/components/ui/booking/Calendar'
import { DesktopServiceRecap } from '@/components/ui/booking/DesktopServiceRecap'
import { SummaryCard } from '@/components/ui/booking/SummaryCard'
import { TimeSlotGrid } from '@/components/ui/booking/TimeSlotGrid'

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
    <div className="hidden md:flex flex-col flex-grow w-full max-w-container-max mx-auto px-lg md:px-xxl py-xl md:py-xxl">
      <div className="flex flex-col lg:flex-row gap-xxl">
        <div className="w-full lg:w-[60%] flex flex-col gap-xl">
          <div className="mb-lg">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-sm">
              Étape 1 sur 3
            </span>
            <h1 className="font-h1 text-h1 text-on-surface">Votre parenthèse beauté</h1>
          </div>

          <DesktopServiceRecap service={service} />

          <div className="mt-md">
            <h2 className="font-h3 text-h3 text-on-surface mb-lg">Sélectionnez une date</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-xl">
              <Calendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                today={today}
                monthDays={monthDays}
                onMonthChange={onMonthChange}
                onDateSelect={onDateSelect}
              />

              <div className="flex flex-col gap-3">
                <span className="font-body-md text-body-md text-on-surface block capitalize">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </span>

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
                  <div className="font-body-md text-on-surface-variant py-4">
                    Aucun créneau disponible.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[40%]">
          <SummaryCard
            service={service}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onConfirm={onConfirm}
          />
        </div>
      </div>
    </div>
  )
}
