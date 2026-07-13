import type { ReactNode } from 'react'
import type { BookingWithService } from '@/types/booking'
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit'

interface ConfirmationNextStepsProps {
  email: string
  status: BookingWithService['status']
}

type ConfirmationStep = {
  description: ReactNode
  icon: string
  title: string
}

export function ConfirmationNextSteps({ email, status }: ConfirmationNextStepsProps) {
  const steps = buildConfirmationSteps(email, status)

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map((step) => (
        <ConfirmationStepCard key={step.title} step={step} />
      ))}
    </div>
  )
}

function buildConfirmationSteps(
  email: string,
  status: BookingWithService['status']
): ConfirmationStep[] {
  if (status === 'cancelled') {
    return [
      {
        description: 'Cette demande n’est plus active.',
        icon: 'event_busy',
        title: 'Réservation annulée',
      },
      {
        description: (
          <>
            Le récapitulatif reste disponible à l’adresse{' '}
            <strong className="font-semibold text-on-background">{email}</strong>.
          </>
        ),
        icon: 'mail',
        title: 'E-mail conservé',
      },
      {
        description: 'Vous pouvez reprendre un rendez-vous depuis l’accueil.',
        icon: 'home',
        title: 'Nouveau créneau',
      },
    ]
  }

  if (status === 'confirmed') {
    return [
      {
        description: 'Votre créneau est réservé chez Mlabelle Beauty.',
        icon: 'event_available',
        title: 'Rendez-vous confirmé',
      },
      {
        description: (
          <>
            La confirmation a été envoyée à{' '}
            <strong className="font-semibold text-on-background">{email}</strong>.
          </>
        ),
        icon: 'mail',
        title: 'E-mail envoyé',
      },
      {
        description: 'Conservez le récapitulatif jusqu’au jour du rendez-vous.',
        icon: 'bookmark',
        title: 'À conserver',
      },
    ]
  }

  return [
    {
      description: (
        <>
          Un récapitulatif a été envoyé à{' '}
          <strong className="font-semibold text-on-background">{email}</strong>.
        </>
      ),
      icon: 'mail',
      title: 'E-mail envoyé',
    },
    {
      description: (
        <>
          La confirmation définitive se fait après l’acompte de{' '}
          <strong className="font-semibold text-on-background">{BOOKING_DEPOSIT_LABEL}</strong>.
        </>
      ),
      icon: 'payments',
      title: 'Acompte à valider',
    },
    {
      description: 'Vous recevrez une confirmation finale dès validation.',
      icon: 'verified',
      title: 'Confirmation finale',
    },
  ]
}

function ConfirmationStepCard({ step }: { step: ConfirmationStep }) {
  return (
    <div className="border border-secondary/15 bg-white p-4 shadow-[0_14px_34px_rgba(30,27,21,0.04)]">
      <span className="material-symbols-outlined text-[22px] text-secondary">
        {step.icon}
      </span>
      <h3 className="mt-3 font-body-lg text-[15px] font-semibold text-on-background">
        {step.title}
      </h3>
      <p className="mt-2 font-body-md text-[13px] leading-5 text-on-surface-variant">
        {step.description}
      </p>
    </div>
  )
}
