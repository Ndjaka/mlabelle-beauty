import { Button } from '@/components/ui/button'
import { ServiceImagePreview } from '@/components/ui/dashboard/services/service-image-preview'
import { ServiceStatusToggle } from '@/components/ui/dashboard/services/service-status-toggle'
import { formatDashboardDuration, formatDashboardPrice } from '@/features/dashboard/utils'
import type { Service } from '@/types/service'

type ServiceDesktopTableProps = {
  services: Service[]
  onEdit: (service: Service) => void
  onStatusError: (message: string) => void
}

export function ServiceDesktopTable({
  services,
  onEdit,
  onStatusError,
}: ServiceDesktopTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm text-foreground/80">
        <thead className="border-b border-outline-variant bg-surface-container-low text-xs uppercase text-foreground/55">
          <tr>
            <th className="px-4 py-3 font-semibold">Image</th>
            <th className="px-4 py-3 font-semibold">Prestation</th>
            <th className="px-4 py-3 font-semibold">Durée</th>
            <th className="px-4 py-3 text-right font-semibold">Prix</th>
            <th className="px-4 py-3 text-center font-semibold">Statut</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-background">
          {services.map((service) => (
            <tr key={service.id} className="transition-colors hover:bg-surface-container-low/50">
              <td className="w-[100px] px-4 py-4">
                <ServiceImagePreview imageUrl={service.image_url} label={service.name} />
              </td>
              <td className="max-w-[300px] px-4 py-4">
                <div className="font-semibold text-foreground">{service.name}</div>
                {service.description && (
                  <div className="mt-1 line-clamp-2 text-xs text-foreground/60">
                    {service.description}
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-4 font-medium">
                {formatDashboardDuration(service.duration_minutes)}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-right font-semibold">
                {formatDashboardPrice(service.price_cents)}
              </td>
              <td className="px-4 py-4 text-center">
                <ServiceStatusToggle
                  serviceId={service.id}
                  isActive={service.is_active}
                  onError={onStatusError}
                />
              </td>
              <td className="px-4 py-4 text-right">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
