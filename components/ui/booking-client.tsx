"use client";

import { useState, useMemo } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfToday, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { groupSlotsByPeriod, formatPrice, formatDuration } from "@/features/booking/utils";
import type { Service } from "@/types/service";

interface BookingClientProps {
  service: Service;
  selectedDateStr: string;
  availableSlots: string[];
}

export function BookingClient({ service, selectedDateStr, availableSlots }: BookingClientProps) {
  const router = useRouter();
  
  const selectedDate = useMemo(() => {
    const d = parseISO(selectedDateStr);
    return isValid(d) ? d : new Date();
  }, [selectedDateStr]);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const today = startOfToday();
  const mobileDays = useMemo(() => 
    Array.from({ length: 14 }).map((_, i) => addDays(today, i)),
  [today]);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const desktopDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = monthStart.getDay(); 
  const emptyDaysCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const emptyDays = Array.from({ length: emptyDaysCount });

  const { morning, afternoon } = useMemo(() => 
    groupSlotsByPeriod(availableSlots),
  [availableSlots]);

  const handleDateClick = (date: Date) => {
    setSelectedSlot(null);
    router.push(`/booking/${format(date, "yyyy-MM-dd")}?service_id=${service.id}`);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    alert(`Rendez-vous confirmé pour le ${format(selectedDate, 'd MMMM', { locale: fr })} à ${selectedSlot}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-xxl items-start">
      {/* COLONNE GAUCHE - 60% */}
      <div className="w-full lg:w-[60%] flex flex-col">
        
        {/* Titre & Étape */}
        <div className="mb-xl">
          <span className="label-caps text-secondary text-[12px] tracking-[0.2em] block mb-sm">
            ÉTAPES 1 SUR 3
          </span>
          <h1 className="text-h1 font-serif text-foreground leading-[1.1]">
            Votre parenthèse beauté
          </h1>
          <p className="text-body-md text-outline mt-md font-sans lg:max-w-md">
            Sélectionnez le moment parfait pour vous parmi nos disponibilités.
          </p>
        </div>

        {/* Carte Service Style "Mockup" */}
        <div className="bg-surface border border-outline-variant/30 p-lg mb-xxl relative group">
          <div className="absolute top-0 left-0 -translate-y-1/2 ml-lg">
            <span className="bg-surface-container-high px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-foreground border border-outline-variant/30 uppercase">
              COIFFURE
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <h2 className="text-h3 font-serif text-foreground mb-sm">{service.name}</h2>
              <div className="flex items-center gap-md text-body-md">
                <div className="flex items-center gap-xs text-outline">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                  <span>{formatDuration(service.duration_minutes)}</span>
                </div>
                <span className="text-outline-variant">|</span>
                <span className="font-bold text-foreground">{formatPrice(service.price_cents)}</span>
              </div>
            </div>
            <button className="text-[11px] font-bold tracking-widest text-secondary hover:text-foreground transition-colors underline decoration-secondary/30 underline-offset-4">
              MODIFIER
            </button>
          </div>
        </div>

        {/* Section Sélection Date/Heure */}
        <div className="flex flex-col gap-xl">
          <h3 className="text-h3 font-serif text-foreground">Sélectionnez une date</h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-xl items-start">
            
            {/* Calendrier Desktop */}
            <div className="hidden lg:block bg-white border border-outline-variant/30 p-lg rounded-sm shadow-sm">
              <div className="flex justify-between items-center mb-lg">
                <button className="p-2 hover:bg-surface rounded-full transition-colors text-outline">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="text-body-lg text-foreground font-serif capitalize">
                  {format(selectedDate, 'MMMM yyyy', { locale: fr })}
                </span>
                <button className="p-2 hover:bg-surface rounded-full transition-colors text-outline">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-y-sm text-center mb-sm text-[11px] font-bold text-outline-variant uppercase tracking-tighter">
                <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                {desktopDays.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`w-9 h-9 mx-auto flex items-center justify-center text-sm transition-all rounded-full ${
                        isSelected 
                          ? 'bg-secondary text-white font-bold shadow-md scale-110' 
                          : 'text-foreground hover:bg-surface'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Picker Mobile (Scroll) */}
            <div className="lg:hidden">
               <div className="flex justify-between items-end mb-md">
                <h2 className="label-caps text-foreground uppercase tracking-widest text-[11px]">{format(selectedDate, 'MMMM', { locale: fr })}</h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2 snap-x">
                {mobileDays.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`snap-start flex-shrink-0 w-[68px] h-[84px] border flex flex-col items-center justify-center transition-all relative ${
                        isSelected
                          ? 'border-secondary bg-surface shadow-[0_0_20px_rgba(184,151,74,0.1)]'
                          : 'border-outline-variant bg-white'
                      }`}
                    >
                      {isSelected && <div className="absolute top-0 w-full h-[3px] bg-secondary"></div>}
                      <span className={`text-[10px] font-bold uppercase mb-1 tracking-widest ${isSelected ? 'text-secondary' : 'text-outline'}`}>
                        {format(day, 'EEE', { locale: fr }).replace('.', '')}
                      </span>
                      <span className="text-[22px] font-serif text-foreground leading-none">
                        {format(day, 'd')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Créneaux Horaires */}
            <div className="flex flex-col gap-lg">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-md">
                <h4 className="text-body-md font-serif text-foreground capitalize">
                  {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                </h4>
              </div>

              {/* Matin */}
              <div className="space-y-sm">
                <div className="flex items-center gap-xs text-[11px] font-bold text-outline uppercase tracking-widest">
                  <span className="material-symbols-outlined text-secondary text-[18px]">wb_sunny</span>
                  <span>Matin</span>
                </div>
                <div className="grid grid-cols-3 xl:grid-cols-2 gap-3">
                  {morning.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 border transition-all text-sm rounded-sm ${
                        slot === selectedSlot
                          ? 'border-secondary bg-secondary/5 text-foreground ring-1 ring-secondary shadow-inner font-bold'
                          : 'border-outline-variant bg-white text-outline hover:border-secondary hover:text-foreground'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                  {morning.length === 0 && (
                    <div className="col-span-full py-md px-lg border border-dashed border-outline-variant/30 text-center rounded-sm">
                      <span className="text-[11px] text-outline-variant font-sans uppercase tracking-widest italic">
                        Aucun créneau disponible
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Après-midi */}
              <div className="space-y-sm">
                <div className="flex items-center gap-xs text-[11px] font-bold text-outline uppercase tracking-widest">
                  <span className="material-symbols-outlined text-secondary text-[18px]">partly_cloudy_day</span>
                  <span>Après-midi</span>
                </div>
                <div className="grid grid-cols-3 xl:grid-cols-2 gap-3">
                  {afternoon.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 border transition-all text-sm rounded-sm ${
                        slot === selectedSlot
                          ? 'border-secondary bg-secondary/5 text-foreground ring-1 ring-secondary shadow-inner font-bold'
                          : 'border-outline-variant bg-white text-outline hover:border-secondary hover:text-foreground'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                  {afternoon.length === 0 && (
                    <div className="col-span-full py-md px-lg border border-dashed border-outline-variant/30 text-center rounded-sm">
                      <span className="text-[11px] text-outline-variant font-sans uppercase tracking-widest italic">
                        Aucun créneau disponible
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COLONNE DROITE - RÉSUMÉ STICKY */}
      <div className="hidden lg:block w-[40%] sticky top-32">
        <div className="bg-white border border-outline-variant/30 p-xl shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <h3 className="text-h3 font-serif text-foreground mb-lg">Résumé</h3>
          
          <div className="space-y-md mb-xl">
            <div className="flex justify-between items-baseline">
              <span className="text-body-md text-foreground">{service.name}</span>
              <span className="text-body-md font-bold">{formatPrice(service.price_cents)}</span>
            </div>
            
            <div className="flex items-start gap-sm text-outline text-body-sm italic">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <div className="flex flex-col">
                <span className="capitalize">{format(selectedDate, 'EEEE d MMMM', { locale: fr })}</span>
                {selectedSlot && <span className="text-secondary font-bold not-italic">{selectedSlot}</span>}
                {!selectedSlot && <span>Sélectionnez un créneau</span>}
              </div>
            </div>
          </div>

          <div className="pt-lg border-t border-outline-variant/20 flex justify-between items-center mb-xl">
            <span className="text-body-lg font-serif">Total</span>
            <span className="text-h3 font-bold text-foreground">{formatPrice(service.price_cents)}</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selectedSlot}
            className="w-full py-5 bg-foreground text-white text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-neutral transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          >
            CONFIRMER MON RENDEZ-VOUS
          </button>
          
          <p className="mt-md text-[11px] text-outline text-center font-sans">
            Paiement sur place. Annulation flexible.
          </p>
        </div>
      </div>

      {/* STICKY BOTTOM MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-outline-variant px-6 py-4 pb-safe flex items-center justify-between z-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
            {format(selectedDate, 'EEE d MMM', { locale: fr }).replace('.', '')}
          </span>
          <span className="text-h3 font-serif text-foreground">
            {selectedSlot || "--:--"}
          </span>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!selectedSlot}
          className="bg-foreground text-white text-[12px] font-bold tracking-[0.15em] uppercase px-xl py-4 shadow-lg active:scale-95 transition-transform"
        >
          CONFIRMER
        </button>
      </div>
    </div>
  );
}
