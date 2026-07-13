import { afterEach, describe, expect, it } from 'vitest';
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit';
import {
  buildBookingEmailHtml,
  type BookingEmailData,
} from '@/features/notifications/utils';

const SITE_URL = 'https://mlabelle.example';
const CLIENT_NAME = 'Eugénie & Co';
const SERVICE_NAME = 'Brushing <signature>';
const REQUEST_INTRO = 'Votre demande de réservation est reçue.';
const REQUEST_BODY = `Nous avons bien reçu votre demande. Pour confirmer définitivement votre rendez-vous, un acompte de ${BOOKING_DEPOSIT_LABEL} est nécessaire. Le salon vous indiquera comment régler cet acompte.`;
const REQUEST_PAYMENT_NOTICE = `Acompte à régler pour confirmation : ${BOOKING_DEPOSIT_LABEL}.`;
const DEPOSIT_HIGHLIGHT_HTML = `<strong style="font-weight:700; color:#1A1A1A;">${BOOKING_DEPOSIT_LABEL}</strong>`;
const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const bookingEmailData: BookingEmailData = {
  clientName: CLIENT_NAME,
  clientEmail: 'eugenie@example.com',
  serviceName: SERVICE_NAME,
  date: 'Jeudi 13 août 2026',
  slot: '09:00',
  duration: '45min',
  price: '35,00 €',
  cancelToken: 'cancel-token',
};

describe('booking email HTML', () => {
  afterEach(() => {
    if (originalSiteUrl) {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
      return;
    }

    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('renders the request email with a compact mobile-friendly title and highlighted deposit', () => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;

    const html = buildBookingEmailHtml({
      data: bookingEmailData,
      intro: REQUEST_INTRO,
      body: REQUEST_BODY,
      paymentNotice: REQUEST_PAYMENT_NOTICE,
      isCancellation: false,
      options: {
        trustedBodyHtml: `Nous avons bien reçu votre demande. Pour confirmer définitivement votre rendez-vous, un acompte de ${DEPOSIT_HIGHLIGHT_HTML} est nécessaire. Le salon vous indiquera comment régler cet acompte.`,
        trustedPaymentNoticeHtml: `Acompte à régler pour confirmation : ${DEPOSIT_HIGHLIGHT_HTML}.`,
        titleFontSize: '28px',
        bodyTextAlign: 'left',
      },
    });

    expect(html).toContain('font-size:28px');
    expect(html).toContain('text-align:left');
    expect(html).toContain(DEPOSIT_HIGHLIGHT_HTML);
    expect(html).toContain('Acompte à régler pour confirmation');
  });

  it('escapes customer-provided content and keeps the cancellation link available', () => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;

    const html = buildBookingEmailHtml({
      data: bookingEmailData,
      intro: REQUEST_INTRO,
      body: REQUEST_BODY,
      paymentNotice: REQUEST_PAYMENT_NOTICE,
      isCancellation: false,
    });

    expect(html).toContain('Eugénie &amp; Co');
    expect(html).toContain('Brushing &lt;signature&gt;');
    expect(html).toContain(`${SITE_URL}/booking/cancel?token=cancel-token`);
    expect(html).not.toContain(CLIENT_NAME);
    expect(html).not.toContain(SERVICE_NAME);
  });
});
