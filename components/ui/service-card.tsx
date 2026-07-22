import { formatPriceRange, formatDuration } from "@/features/booking/utils";
import type { Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import { ServiceDescription } from "@/components/ui/service-description";
import { ServiceImage } from "@/components/ui/service-image";

interface ServiceCardProps {
  service: Service;
  today: string;
}

export function ServiceCard({ service, today }: ServiceCardProps) {
  const description = service.description?.trim();

  return (
    <article className="group flex min-h-[180px] overflow-hidden border border-secondary/10 bg-white shadow-[0_14px_34px_rgba(30,27,21,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/25 hover:shadow-[0_20px_42px_rgba(30,27,21,0.09)] sm:min-h-[196px] xl:min-h-[210px]">
      <div className="w-[36%] min-w-[118px] max-w-[152px] self-stretch sm:min-w-[142px] xl:w-[42%] xl:min-w-[176px] xl:max-w-[205px]">
        <ServiceImage
          imageUrl={service.image_url}
          label={service.name}
          variant="card"
          className="h-full min-h-0 rounded-none border-0 aspect-auto"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 xl:p-6">
        <div className="min-w-0">
          <h3 className="break-words font-serif text-[20px] leading-tight text-foreground sm:text-[22px] xl:text-[24px]">
            {service.name}
          </h3>

          {description && <ServiceDescription description={description} />}
        </div>

        <div className="mt-auto border-t border-secondary/15 pt-2.5 sm:pt-3">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap font-serif text-[17px] leading-none text-foreground sm:text-[19px] xl:text-[20px]">
                {formatPriceRange(service.price_cents, service.price_max_cents)}
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/70 xl:text-[12px]">
                <span className="material-symbols-outlined !text-[11px] xl:!text-[12px]" aria-hidden="true">
                  schedule
                </span>
                {formatDuration(service.duration_minutes)}
              </span>
            </div>
            <Button
              href={`/booking/${today}?service_id=${service.id}`}
              size="sm"
              aria-label={`Choisir la prestation ${service.name}`}
              className="w-full border-0 bg-foreground px-3 py-2.5 text-[10px] tracking-[0.06em] text-white hover:bg-foreground/85"
            >
              CHOISIR CETTE PRESTATION
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
