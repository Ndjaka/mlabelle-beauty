'use client'

import { useState, useEffect } from 'react'
import { StatusBadge } from '@/components/ui/dashboard/status-badge'
import { CancelBookingModal } from '@/components/ui/dashboard/cancel-booking-modal'
import { ConfirmBookingButton } from '@/components/ui/dashboard/confirm-booking-button'
import { ConfirmBookingModal } from '@/components/ui/dashboard/confirm-booking-modal'
import type { DashboardRecentBooking } from '@/types/dashboard'
import { cn } from '@/lib/utils'

interface BookingDetailPanelProps {
  booking: DashboardRecentBooking
  isOpen: boolean
  onClose: () => void
}

export function BookingDetailPanel({ booking, isOpen, onClose }: BookingDetailPanelProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h2 className="font-serif text-2xl text-foreground">Détail du rendez-vous</h2>
          <button 
            onClick={onClose}
            className="text-foreground/65 hover:text-foreground p-2"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="font-semibold text-foreground text-lg">{booking.client}</p>
              <p className="text-foreground/65 mt-1">{booking.service}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="mb-8 space-y-4 border-y border-outline-variant py-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-foreground/65 uppercase tracking-wider text-xs">Date</div>
              <div className="text-right font-medium text-foreground">{booking.date}</div>
              
              <div className="text-foreground/65 uppercase tracking-wider text-xs">Heure</div>
              <div className="text-right font-medium text-foreground">{booking.time}</div>
              
              <div className="text-foreground/65 uppercase tracking-wider text-xs">Durée</div>
              <div className="text-right font-medium text-foreground">{booking.duration}</div>
              
              <div className="text-foreground/65 uppercase tracking-wider text-xs">Prix</div>
              <div className="text-right font-semibold text-foreground">{booking.price}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-lg text-foreground mb-4">Contact</h3>
            <div className="grid grid-cols-[24px_1fr] items-center gap-3 text-sm text-foreground/80">
              <span className="material-symbols-outlined text-[20px] text-secondary">mail</span>
              <a href={`mailto:${booking.email}`} className="hover:underline">{booking.email}</a>
              
              {booking.phone && (
                <>
                  <span className="material-symbols-outlined text-[20px] text-secondary">call</span>
                  <a href={`tel:${booking.phone}`} className="hover:underline">{booking.phone}</a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 border-t border-outline-variant p-6">
          <ConfirmBookingButton
            onClick={() => setIsConfirmModalOpen(true)}
            status={booking.status}
          />
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="w-full border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold uppercase transition-colors hover:bg-red-100"
          >
            Annuler ce rendez-vous
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <CancelBookingModal
          bookingId={booking.id}
          clientName={booking.client}
          serviceName={booking.service}
          onClose={() => setIsCancelModalOpen(false)}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmBookingModal
          bookingId={booking.id}
          clientName={booking.client}
          serviceName={booking.service}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirmed={onClose}
        />
      )}
    </>
  )
}
