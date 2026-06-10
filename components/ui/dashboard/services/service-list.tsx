'use client'

import type { Service } from '@/types/service'
import { formatDashboardPrice, formatDashboardDuration } from '@/features/dashboard/utils'
import { ServiceStatusToggle } from '@/components/ui/dashboard/services/service-status-toggle'
import { Button } from '@/components/ui/button'

type ServiceListProps = {
  services: Service[]
  onEdit: (service: Service) => void
}

export function ServiceList({ services, onEdit }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="border border-dashed border-outline-variant bg-background px-4 py-6 text-sm leading-6 text-foreground/55 text-center">
        Aucune prestation trouvée.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-foreground/80">
        <thead className="border-b border-outline-variant bg-surface-container-low text-xs uppercase text-foreground/55">
          <tr>
            <th className="px-4 py-3 font-semibold">Image</th>
            <th className="px-4 py-3 font-semibold">Prestation</th>
            <th className="px-4 py-3 font-semibold">Durée</th>
            <th className="px-4 py-3 font-semibold text-right">Prix</th>
            <th className="px-4 py-3 font-semibold text-center">Statut</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-background">
          {services.map((service) => (
            <tr key={service.id} className="transition-colors hover:bg-surface-container-low/50">
              {/* Placeholder for image */}
              <td className="px-4 py-4 w-[100px]">
                <div className="flex size-14 items-center justify-center rounded border border-dashed border-outline-variant bg-surface-container-low text-foreground/30 text-[10px] uppercase">
                  Image
                </div>
              </td>
              
              <td className="px-4 py-4 max-w-[300px]">
                <div className="font-semibold text-foreground">{service.name}</div>
                {service.description && (
                  <div className="mt-1 text-xs text-foreground/60 line-clamp-2">
                    {service.description}
                  </div>
                )}
              </td>
              
              <td className="px-4 py-4 font-medium whitespace-nowrap">
                {formatDashboardDuration(service.duration_minutes)}
              </td>
              
              <td className="px-4 py-4 text-right font-semibold whitespace-nowrap">
                {formatDashboardPrice(service.price_cents)}
              </td>
              
              <td className="px-4 py-4 text-center">
                <ServiceStatusToggle serviceId={service.id} isActive={service.is_active} />
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
