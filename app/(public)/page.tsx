import { getActiveServices } from "@/features/services/queries";
import { format } from "date-fns";
import { ServicesCatalog } from "@/components/ui/services/services-catalog";

export const revalidate = 3600;

export default async function HomePage() {
  const services = await getActiveServices();
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <main className="flex-grow">
      <ServicesCatalog services={services} today={today} />
    </main>
  );
}
