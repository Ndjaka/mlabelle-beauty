import { formatPrice, formatDuration } from "@/features/booking/utils";
import type { Service } from "@/types/service";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  service: Service;
  today: string;
}

export function ServiceCard({ service, today }: ServiceCardProps) {
  return (
    <article className="bg-background border border-secondary/30 flex flex-col group hover:border-secondary transition-colors duration-500 p-8 md:p-10">
      <div className="mb-6">
        <span className="font-sans text-[12px] font-semibold tracking-[0.15em] text-secondary uppercase">
          PRESTATION
        </span>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="font-serif text-[28px] text-foreground leading-[1.3] mb-4">
          {service.name}
        </h3>
        
        {/* Optional Description */}
        {service.description && (
          <p className="font-sans text-[16px] text-foreground/80 mb-8 flex-grow leading-[1.6]">
            {service.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-6 pt-6 border-t border-secondary/20 mt-auto">
          <div className="flex items-center gap-2 text-foreground/80">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.15em]">
              {formatDuration(service.duration_minutes)}
            </span>
          </div>
          <span className="font-sans text-[18px] font-medium text-foreground">
            {formatPrice(service.price_cents)}
          </span>
        </div>

        <Button
          href={`/booking/${today}?service_id=${service.id}`}
          className="w-full"
        >
          Réserver
        </Button>
      </div>
    </article>
  );
}
