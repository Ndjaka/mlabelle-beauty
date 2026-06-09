import { getActiveServices } from "@/features/services/queries";
import { format } from "date-fns";
import { ServiceCard } from "@/components/ui/service-card";

export const revalidate = 3600;

export default async function HomePage() {
  const services = await getActiveServices();
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 md:px-[80px] py-[48px] md:py-[80px]">
      {/* Header Section */}
      <header className="text-center mb-[48px] md:mb-[80px] max-w-2xl mx-auto">
        <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2] md:leading-[1.3] text-foreground mb-2 md:mb-4 tracking-[-0.01em] md:tracking-[-0.02em]">
          Nos Prestations
        </h2>
        <p className="font-sans text-[16px] md:text-[18px] text-foreground/80 leading-[1.6]">
          L&apos;art de la beauté à la française. Découvrez nos rituels de soins sur mesure.
        </p>
      </header>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[24px]">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} today={today} />
        ))}
      </div>
    </main>
  );
}
