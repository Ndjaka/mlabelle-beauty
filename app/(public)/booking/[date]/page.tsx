import { BookingClient } from "@/components/ui/booking-client";
import { getBookingSelectionData } from "@/features/booking/page-data";
import { notFound } from "next/navigation";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ service_id?: string; slot?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  
  const serviceId = resolvedSearchParams.service_id;
  if (!serviceId) return notFound();

  const bookingData = await getBookingSelectionData({
    dateStr: resolvedParams.date,
    serviceId,
  });

  if (!bookingData) return notFound();

  return (
    <BookingClient 
      service={bookingData.service}
      initialDate={bookingData.date}
      initialSlots={bookingData.initialSlots}
    />
  );
}
