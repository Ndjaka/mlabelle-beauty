// app/(public)/booking/cancel/page.tsx
// Server Component — affiche une confirmation avant annulation effective.

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cancelBookingByToken } from '@/features/booking/actions';
import { getBookingByCancelToken } from '@/features/booking/queries';
import { getClientCancellationState } from '@/features/booking/utils';
import { CancellationConfirmation } from '@/components/ui/cancellation-confirmation';
import { CancellationSuccess } from '@/components/ui/cancellation-success';
import { CancellationError } from '@/components/ui/cancellation-error';

export const metadata: Metadata = {
  title: 'Annulation — Mlabelle Beauty',
  description: 'Confirmation ou erreur d\'annulation de votre rendez-vous chez Mlabelle Beauty.',
};

// No caching — result must be fresh every time
export const dynamic = 'force-dynamic';

interface CancelPageProps {
  searchParams: Promise<{ token?: string; cancelled?: string; error?: string }>;
}

const ERROR_FALLBACK =
  'Ce lien d\'annulation est expiré ou déjà utilisé. Votre rendez-vous est peut-être déjà confirmé ou annulé.';
const ERROR_RETRY =
  'Nous n\'avons pas pu annuler le rendez-vous. Veuillez réessayer dans quelques instants.';

export default async function CancelPage({ searchParams }: CancelPageProps) {
  const { token, error } = await searchParams;

  if (!token) {
    return <CancellationError message={ERROR_FALLBACK} />;
  }

  const cancelToken = token;
  let booking = null;

  try {
    booking = await getBookingByCancelToken(cancelToken);
  } catch {
    return <CancellationError message={ERROR_FALLBACK} />;
  }

  if (!booking) {
    return <CancellationError message={ERROR_FALLBACK} />;
  }

  const cancellationState = getClientCancellationState(booking);

  if (cancellationState.status === 'cancelled') {
    return <CancellationSuccess booking={booking} />;
  }

  if (cancellationState.status === 'unavailable') {
    return <CancellationError message={cancellationState.message} />;
  }

  async function confirmCancellation(): Promise<void> {
    'use server';

    const result = await cancelBookingByToken(cancelToken);

    if (result.success) {
      redirect(`/booking/cancel?${new URLSearchParams({
        token: cancelToken,
        cancelled: '1',
      }).toString()}`);
    }

    const updatedBooking = await getBookingByCancelToken(cancelToken);

    if (updatedBooking?.status === 'cancelled') {
      redirect(`/booking/cancel?${new URLSearchParams({
        token: cancelToken,
        cancelled: '1',
      }).toString()}`);
    }

    redirect(`/booking/cancel?${new URLSearchParams({
      token: cancelToken,
      error: '1',
    }).toString()}`);
  }

  return (
    <CancellationConfirmation
      booking={booking}
      action={confirmCancellation}
      errorMessage={error === '1' ? ERROR_RETRY : undefined}
    />
  );
}
