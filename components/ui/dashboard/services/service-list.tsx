import { ServiceDesktopTable } from '@/components/ui/dashboard/services/service-desktop-table'
import { ServiceMobileCard } from '@/components/ui/dashboard/services/service-mobile-card'
import type { Service } from '@/types/service'

type ServiceListProps = {
  services: Service[]
  onEdit: (service: Service) => void
  onStatusError: (message: string) => void
}

export function ServiceList({ services, onEdit, onStatusError }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="border border-dashed border-outline-variant bg-background px-4 py-6 text-center text-sm leading-6 text-foreground/55">
        Aucune prestation trouvée.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {services.map((service) => (
          <ServiceMobileCard
            key={service.id}
            service={service}
            onEdit={onEdit}
            onStatusError={onStatusError}
          />
        ))}
      </div>
      <ServiceDesktopTable
        services={services}
        onEdit={onEdit}
        onStatusError={onStatusError}
      />
    </>
  )
}
