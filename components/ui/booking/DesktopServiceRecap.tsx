'use client'

import { useRouter } from 'next/navigation'
import type { Service } from '@/types/service'
import { formatPrice, formatDuration } from '@/features/booking/utils'

interface DesktopServiceRecapProps {
  service: Service
}

export function DesktopServiceRecap({ service }: DesktopServiceRecapProps) {
  const router = useRouter()
  
  return (
    <div className="p-4 bg-surface border border-surface-dim rounded flex items-start gap-6">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center shrink-0 border border-secondary/20">
        <span className="material-symbols-outlined text-secondary text-2xl">cut</span>
      </div>
      <div className="flex-grow">
        <h3 className="font-h3 text-h3 text-on-surface mb-xs">{service.name}</h3>
        <div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span> {formatDuration(service.duration_minutes)}
          </span>
          <span className="text-outline-variant">|</span>
          <span>{formatPrice(service.price_cents)}</span>
        </div>
      </div>
      <button
        onClick={() => router.back()}
        className="text-secondary hover:text-foreground transition-colors underline font-label-caps text-label-caps"
      >
        MODIFIER
      </button>
    </div>
  )
}
