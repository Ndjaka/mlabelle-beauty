// app/(public)/booking/cancel/page.tsx
// Server Component — appelle cancelBookingByToken au rendu,
// affiche Cancellation ou Error selon le résultat.

import type { Metadata } from 'next';
import { cancelBookingByToken } from '@/features/booking/actions';
import { CancellationSuccess } from '@/components/ui/cancellation-success';
import { CancellationError } from '@/components/ui/cancellation-error';

export const metadata: Metadata = {
  title: 'Annulation — Mlabelle Beauty',
  description: 'Confirmation ou erreur d\'annulation de votre rendez-vous chez Mlabelle Beauty.',
};

// No caching — result must be fresh every time
export const dynamic = 'force-dynamic';

interface CancelPageProps {
  searchParams: Promise<{ token?: string }>;
}

const ERROR_FALLBACK =
  'Ce lien d\'annulation est expiré ou déjà utilisé. Votre rendez-vous est peut-être déjà confirmé ou annulé.';

export default async function CancelPage({ searchParams }: CancelPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <CancellationError message={ERROR_FALLBACK} />;
  }

  const result = await cancelBookingByToken(token);

  if (!result.success || !result.booking) {
    const message = result.error ?? ERROR_FALLBACK;
    return <CancellationError message={message} />;
  }

  return <CancellationSuccess booking={result.booking} />;
}
