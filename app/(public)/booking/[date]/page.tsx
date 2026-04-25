import { createServerClient } from "@/lib/supabase/server";
import { BookingClient } from "@/components/ui/booking-client";
import { getBookingsForDate, getScheduleRule, getDaysOff } from "@/features/booking/queries";
import { getAvailableSlots, groupSlotsByPeriod } from "@/features/booking/utils";
import { notFound } from "next/navigation";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ service_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  
  const serviceId = resolvedSearchParams.service_id;
  if (!serviceId) return notFound();

  const supabase = await createServerClient();
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();

  if (!service) return notFound();

  const dateStr = resolvedParams.date;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return notFound();

  // For correct timezone handling, if the URL is "2026-05-15", new Date() yields UTC 00:00:00
  // Which means it corresponds to that exact day.
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday

  // Fetch booking availability dependencies
  const scheduleRule = await getScheduleRule(dayOfWeek);
  const bookings = await getBookingsForDate(date);
  const daysOff = await getDaysOff();

  const availableSlots = getAvailableSlots(
    date,
    scheduleRule,
    bookings,
    service.duration_minutes,
    daysOff
  );

  const initialSlots = groupSlotsByPeriod(availableSlots);

  return (
    <BookingClient 
      service={service} 
      initialDate={date} 
      initialSlots={initialSlots} 
    />
  );
}
