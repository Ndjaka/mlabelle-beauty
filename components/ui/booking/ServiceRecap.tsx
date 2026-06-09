'use client'

import type { Service } from '@/types/service'
import { formatPrice, formatDuration } from '@/features/booking/utils'

interface ServiceRecapProps {
  service: Service
}

export function ServiceRecap({ service }: ServiceRecapProps) {
  return (
    <div className="bg-surface border border-outline-variant rounded-none p-4 mb-xl">
      <div className="flex justify-between items-start mb-sm">
        <div>
          <h3 className="font-h3 text-h3 text-on-background">{service.name}</h3>
        </div>
      </div>
      <div className="flex items-center text-on-surface-variant font-body-md text-body-md mt-4 gap-1.5">
        <span className="material-symbols-outlined text-[12px] text-outline">schedule</span>
        <span>{formatDuration(service.duration_minutes)}</span>
        <span className="mx-3 text-outline">|</span>
        <span className="font-bold text-on-background">{formatPrice(service.price_cents)}</span>
      </div>
    </div>
  )
}
