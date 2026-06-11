import { Button } from '@/components/ui/button'
import { ServiceImagePreview } from '@/components/ui/dashboard/services/service-image-preview'
import { ServiceStatusToggle } from '@/components/ui/dashboard/services/service-status-toggle'
import { formatDashboardDuration, formatDashboardPrice } from '@/features/dashboard/utils'
import type { Service } from '@/types/service'

type ServiceMobileCardProps = {
  service: Service
  onEdit: (service: Service) => void
  onStatusError: (message: string) => void
}

export function ServiceMobileCard({
  service,
  onEdit,
  onStatusError,
}: ServiceMobileCardProps) {
  return (
    <article className="border border-outline-variant bg-background p-4">
      <div className="flex items-start gap-3">
        <ServiceImagePreview imageUrl={service.image_url} label={service.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-xl leading-tight text-foreground">{service.name}</h3>
              <p className="mt-1 text-xs font-semibold uppercase text-foreground/50">
                {formatDashboardDuration(service.duration_minutes)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-foreground">
              {formatDashboardPrice(service.price_cents)}
            </p>
          </div>
          {service.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/65">
              {service.description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-4">
        <div className="flex items-center gap-3">
          <ServiceStatusToggle
            serviceId={service.id}
            isActive={service.is_active}
            onError={onStatusError}
          />
          <span className="text-xs font-semibold uppercase text-foreground/55">
            {service.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(service)}
          className="inline-flex items-center gap-2 px-0 py-0 text-secondary hover:text-secondary/80"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            edit
          </span>
          Modifier
        </Button>
      </div>
    </article>
  )
}
