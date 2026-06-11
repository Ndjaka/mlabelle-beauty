import { formatPrice, formatDuration } from "@/features/booking/utils";
import type { Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import { ServiceImage } from "@/components/ui/service-image";

interface ServiceCardProps {
  service: Service;
  today: string;
}

export function ServiceCard({ service, today }: ServiceCardProps) {
  const description = service.description?.trim();

  return (
    <article className="group flex h-[154px] overflow-hidden rounded-[8px] border border-secondary/15 bg-white shadow-[0_14px_34px_rgba(30,27,21,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-[0_20px_42px_rgba(30,27,21,0.09)] sm:h-[172px] xl:h-[184px]">
      <div className="h-full w-[36%] min-w-[118px] max-w-[152px] sm:min-w-[142px] xl:w-[42%] xl:min-w-[176px] xl:max-w-[205px]">
        <ServiceImage
          imageUrl={service.image_url}
          label={service.name}
          variant="card"
          className="h-full min-h-0 rounded-l-[8px] rounded-r-none border-0 aspect-auto"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 xl:p-6">
        <div className="min-w-0">
          <h3 className="line-clamp-1 font-serif text-[20px] leading-tight text-foreground sm:text-[22px] xl:text-[24px]">
            {service.name}
          </h3>

          {description && (
            <p className="mt-1.5 line-clamp-2 font-sans text-[12px] leading-5 text-foreground/65 sm:text-[13px] xl:text-[14px] xl:leading-6">
              {description}
            </p>
          )}
        </div>

        <div className="mt-auto border-t border-secondary/15 pt-2.5 sm:pt-3">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
              <span className="font-serif text-[22px] leading-none text-secondary sm:text-[24px] xl:text-[25px]">
                {formatPrice(service.price_cents)}
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/70 xl:text-[12px]">
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                  schedule
                </span>
                {formatDuration(service.duration_minutes)}
              </span>
            </div>
            <Button
              href={`/booking/${today}?service_id=${service.id}`}
              size="sm"
              className="min-w-[92px] rounded-[6px] bg-secondary px-3 py-3 text-[10px] tracking-[0.08em] hover:bg-secondary/90 sm:min-w-[106px] xl:min-w-[112px]"
            >
              RÉSERVER
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
