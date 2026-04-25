'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isBefore, startOfDay, isSameDay, isSameMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service } from '@/types/service'
import { formatPrice, formatDuration } from '@/features/booking/utils'
import { getSlotsForDate } from '@/features/booking/actions'

interface BookingClientProps {
  service: Service
  initialDate: Date
  initialSlots: { morning: string[], afternoon: string[] }
}

export function BookingClient({ service, initialDate, initialSlots }: BookingClientProps) {
  const router = useRouter()
  const today = startOfDay(new Date())

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate))
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [slots, setSlots] = useState(initialSlots)
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Desktop month days
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Mobile upcoming 14 days

  const loadSlotsForDate = useCallback(async (date: Date) => {
    setLoadingSlots(true)
    setSelectedSlot(null)
    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const result = await getSlotsForDate(dateStr, service.duration_minutes)
      setSlots(result)
    } catch {
      setSlots({ morning: [], afternoon: [] })
    } finally {
      setLoadingSlots(false)
    }
  }, [service.duration_minutes])

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, today)) return
    setSelectedDate(date)
    loadSlotsForDate(date)
  }

  const handleConfirm = () => {
    if (!selectedSlot) return
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    router.push(`/booking/${dateStr}/confirm?service_id=${service.id}&slot=${selectedSlot}`)
  }

  const allSlotsCount = slots.morning.length + slots.afternoon.length

  return (
    <>
      {/* ======== MOBILE (md:hidden) ======== */}
      <div className="md:hidden flex flex-col bg-background pb-[120px]">
        <main className="flex-grow px-gutter pt-lg">
          {/* Page Title */}
          <div className="mb-xl text-center mt-4">
            <h1 className="font-h2 text-h2 text-on-background mb-sm">Votre parenthèse beauté</h1>
            <p className="font-normal text-[16px] text-on-surface-variant">Sélectionnez le moment parfait pour vous.</p>
          </div>

          {/* Service Recap Card */}
          <div className="bg-surface border border-outline-variant rounded-none p-4 mb-xl">
            <div className="flex justify-between items-start mb-sm">
              <div>
                <h3 className="font-h3 text-h3 text-on-background">{service.name}</h3>
              </div>
            </div>
            <div className="flex items-center text-on-surface-variant font-body-md text-body-md mt-4 gap-1.5">
              <span className="material-symbols-outlined text-sm text-outline" style={{ fontSize: '12px' }}>schedule</span>
              <span>{formatDuration(service.duration_minutes)}</span>
              <span className="mx-3 text-outline">|</span>
              <span className="font-bold text-on-background ">{formatPrice(service.price_cents)}</span>
            </div>
          </div>

          {/* Date Picker */}
          <div className="mb-xl">
            <div className="flex justify-between items-end mb-4">
              <h2 className="font-label-caps text-label-caps text-on-surface uppercase">
                {format(currentMonth, 'MMMM', { locale: fr })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 snap-x">
              {monthDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate)
                const isPast = isBefore(day, today)
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => !isPast && handleDateSelect(day)}
                    disabled={isPast}
                    className={`snap-start flex-shrink-0 w-[64px] h-[80px] border flex flex-col items-center justify-center transition-colors relative
                      ${isPast ? 'opacity-50 cursor-not-allowed border-outline-variant bg-surface' : ''}
                      ${isSelected ? 'border-secondary bg-surface shadow-[0_0_15px_rgba(184,151,74,0.15)]' : !isPast ? 'border-outline-variant bg-surface hover:border-secondary/50' : ''}
                    `}
                  >
                    {isSelected && <div className="absolute top-0 w-full h-[2px] bg-secondary" />}
                    <span className={`font-label-caps text-label-caps uppercase mb-1 ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {format(day, 'EEE', { locale: fr })}
                    </span>
                    <span className="font-h3 text-h3 text-on-background">
                      {format(day, 'd')}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Slots */}
          {loadingSlots ? (
            <div className="text-center py-8 font-body-md text-on-surface-variant">Chargement...</div>
          ) : (
            <div>
              {slots.morning.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-secondary">wb_sunny</span>
                    <h3 className="font-label-caps text-label-caps text-on-surface uppercase">Matin</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-lg">
                    {slots.morning.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 border text-center font-body-md text-body-md transition-colors
                          ${selectedSlot === slot
                            ? 'border-secondary bg-surface text-on-background shadow-[0_0_10px_rgba(184,151,74,0.1)]'
                            : 'border-outline-variant bg-surface text-on-background hover:border-secondary'
                          }
                        `}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {slots.afternoon.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4 mt-xl">
                    <span className="material-symbols-outlined text-secondary">partly_cloudy_day</span>
                    <h3 className="font-label-caps text-label-caps text-on-surface uppercase">Après-midi</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {slots.afternoon.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 border text-center font-body-md text-body-md transition-colors
                          ${selectedSlot === slot
                            ? 'border-secondary bg-surface text-on-background shadow-[0_0_10px_rgba(184,151,74,0.1)]'
                            : 'border-outline-variant bg-surface text-on-background hover:border-secondary'
                          }
                        `}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {allSlotsCount === 0 && (
                <div className="text-center py-8 font-body-md text-on-surface-variant">Aucun créneau disponible.</div>
              )}
            </div>
          )}
        </main>

        {/* Sticky Bottom Recap & Action */}
        <div className="fixed bottom-0 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant px-6 py-4 flex items-center justify-between z-40">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
              {format(selectedDate, 'EEE d MMM', { locale: fr })}
            </p>
            <p className="font-h3 text-h3 text-on-background">
              {selectedSlot ?? '—'}
            </p>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot}
            className="bg-[#2C2924] text-white font-semibold text-[12px] uppercase tracking-[0.2em] px-[28.73px] py-[16px] hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            CONFIRMER
          </button>
        </div>
      </div>

      {/* ======== DESKTOP (hidden md:flex) ======== */}
      <div className="hidden md:flex flex-col flex-grow w-full max-w-container-max mx-auto px-lg md:px-xxl py-xl md:py-xxl">
        <div className="flex flex-col lg:flex-row gap-xxl">

          {/* Left Column (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col gap-xl">
            <div className="mb-lg">
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-sm">
                Étape 1 sur 3
              </span>
              <h1 className="font-h1 text-h1 text-on-surface">Votre parenthèse beauté</h1>
            </div>

            {/* Service Recap Card */}
            <div className="p-4 bg-surface border border-surface-dim rounded flex items-start gap-6">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center shrink-0 border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>cut</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-h3 text-h3 text-on-surface mb-xs">{service.name}</h3>
                <div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">schedule</span> {formatDuration(service.duration_minutes)}
                  </span>
                  <span className="text-outline-variant">|</span>
                  <span>{formatPrice(service.price_cents)}</span>
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="text-secondary hover:text-foreground transition-colors underline font-label-caps text-label-caps"
              >
                MODIFIER
              </button>
            </div>

            {/* Date & Time Selection */}
            <div className="mt-md">
              <h2 className="font-h3 text-h3 text-on-surface mb-lg">Sélectionnez une date</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-xl">

                {/* Minimalist Calendar */}
                <div className="border border-outline-variant/50 p-gutter rounded h-fit bg-white shadow-[0_4px_24px_rgba(30,27,21,0.02)]">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-surface-container rounded-full transition-colors w-8 h-8 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
                    </button>
                    <span className="font-body-lg text-body-lg text-on-surface capitalize">
                      {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                    </span>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-surface-container rounded-full transition-colors  w-8 h-8 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-y-sm text-center mb-4 font-label-caps text-label-caps text-on-surface-variant">
                    <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center font-body-md text-body-md">
                    {/* Empty cells for alignment */}
                    {Array.from({ length: (getDay(startOfMonth(currentMonth)) + 6) % 7 }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {/* Days */}
                    {monthDays.map((day) => {
                      const isPast = isBefore(day, today)
                      const isSelected = isSameDay(day, selectedDate)
                      const isCurrentMonth = isSameMonth(day, currentMonth)
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !isPast && handleDateSelect(day)}
                          disabled={isPast || !isCurrentMonth}
                          className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors
                            ${isPast ? 'text-outline hover:border hover:border-outline-variant cursor-not-allowed' : ''}
                            ${isSelected ? 'bg-secondary text-background' : ''}
                            ${!isPast && !isSelected ? 'text-on-surface hover:bg-surface' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Slots List */}
                <div className="flex flex-col gap-3">
                  <span className="font-body-md text-body-md text-on-surface block capitalize">
                    {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>

                  {loadingSlots ? (
                    <div className="font-body-md text-on-surface-variant">Chargement...</div>
                  ) : (
                    <>
                      {/* Matin */}
                      {slots.morning.length > 0 && (
                        <div className="flex flex-col gap-sm">
                          <div className="flex items-center gap-3 mb-gutter">
                            <span className="material-symbols-outlined text-secondary">light_mode</span>
                            <h3 className="font-label-caps text-label-caps text-on-surface uppercase">Matin</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {slots.morning.map(slot => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-sm border font-body-lg text-body-lg rounded text-center transition-all
                                  ${selectedSlot === slot
                                    ? 'border-secondary bg-surface text-on-surface'
                                    : 'border-surface-dim text-secondary hover:border-secondary hover:bg-surface'
                                  }
                                `}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Après-midi */}
                      {slots.afternoon.length > 0 && (
                        <div className="flex flex-col gap-sm mt-gutter">
                          <div className="flex items-center gap-3 mb-gutter">
                            <span className="material-symbols-outlined text-secondary">sunny</span>
                            <h3 className="font-label-caps text-label-caps text-on-surface uppercase">Après-midi</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {slots.afternoon.map(slot => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-sm border font-body-lg text-body-lg rounded text-center transition-all
                                  ${selectedSlot === slot
                                    ? 'border-secondary bg-surface text-on-surface'
                                    : 'border-surface-dim text-secondary hover:border-secondary hover:bg-surface'
                                  }
                                `}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {allSlotsCount === 0 && (
                        <div className="font-body-md text-on-surface-variant py-4">
                          Aucun créneau disponible.
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right Column (40%) */}
          <div className="w-full lg:w-[40%]">
            <div className="sticky top-32 bg-white border border-outline-variant/20 rounded p-[49px] shadow-[0_4px_24px_rgba(30,27,21,0.02)]">
              <h3 className="font-h3 font-normal text-[24px] text-on-surface mb-8 pb-4 border-b border-outline-variant/10">Résumé</h3>

              <div className="flex flex-col gap-6 mb-12">
                <div className="flex justify-between items-baseline">
                  <span className="font-body-lg text-[18px] text-on-surface">{service.name}</span>
                  <span className="font-body-lg text-[18px] text-on-surface">{formatPrice(service.price_cents)}</span>
                </div>

                <div className="flex items-start gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] mt-1">calendar_today</span>
                  <div className="font-normal text-[16px]">
                    <span className="capitalize block">{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                    {selectedSlot ? (
                      <span className="block mt-1">{selectedSlot} ({formatDuration(service.duration_minutes)})</span>
                    ) : (
                      <span className="italic text-outline block mt-1">Sélectionnez un créneau</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-8 mb-12 flex justify-between items-center">
                <span className="font-h3 font-normal text-[24px] text-on-surface">Total</span>
                <span className="font-h3 font-normal text-[24px] text-on-surface">{formatPrice(service.price_cents)}</span>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedSlot}
                className="w-full py-5 bg-[#2C2924] text-white font-semibold text-[12px] uppercase tracking-[0.2em] hover:bg-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONFIRMER MON RENDEZ-VOUS
              </button>

              <p className="text-center mt-6 font-normal text-[12px] text-outline leading-relaxed px-4">
                Paiement sécurisé sur place. Annulation gratuite jusqu'à 24h avant.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
