// Email notification functions using Resend
import { resend } from '@/lib/resend/client';

const EMAIL_FROM = 'Mlabelle Beauty <onboarding@resend.dev>';
const CONFIRMATION_SUBJECT = 'Votre réservation est confirmée — Mlabelle Beauty';
const REMINDER_SUBJECT = 'Rappel — Votre rendez-vous demain chez Mlabelle Beauty';

export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  slot: string;
  duration: string;
  price: string;
  cancelToken: string;
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  await sendBookingEmail({
    data,
    subject: CONFIRMATION_SUBJECT,
    intro: 'Votre réservation est confirmée.',
    body: 'Nous avons bien enregistré votre rendez-vous chez Mlabelle Beauty.',
  });
}

export async function sendBookingReminder(data: BookingEmailData): Promise<void> {
  await sendBookingEmail({
    data,
    subject: REMINDER_SUBJECT,
    intro: 'Nous vous rappelons votre rendez-vous demain.',
    body: 'Votre parenthèse beauté approche. Voici le récapitulatif de votre rendez-vous.',
  });
}

export async function sendBookingCancellation(data: BookingEmailData): Promise<void> {
  await sendBookingEmail({
    data,
    subject: 'Annulation confirmée — Mlabelle Beauty',
    intro: 'Votre rendez-vous est annulé.',
    body: 'Nous vous confirmons l\'annulation de votre rendez-vous chez Mlabelle Beauty. Nous espérons vous revoir bientôt.',
    isCancellation: true,
  });
}

async function sendBookingEmail({
  data,
  subject,
  intro,
  body,
  isCancellation = false,
}: {
  data: BookingEmailData;
  subject: string;
  intro: string;
  body: string;
  isCancellation?: boolean;
}): Promise<void> {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: data.clientEmail,
    subject,
    html: buildBookingEmailHtml(data, intro, body, isCancellation),
  });

  if (error) {
    throw new Error(error.message);
  }
}

function buildBookingEmailHtml(
  data: BookingEmailData,
  intro: string,
  body: string,
  isCancellation: boolean
): string {
  const cancelUrl = buildCancelUrl(data.cancelToken);
  const clientName = escapeHtml(data.clientName);
  const serviceName = escapeHtml(data.serviceName);
  const date = escapeHtml(data.date);
  const slot = escapeHtml(data.slot);
  const duration = escapeHtml(data.duration);
  const price = escapeHtml(data.price);
  const escapedIntro = escapeHtml(intro);
  const escapedBody = escapeHtml(body);

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mlabelle Beauty</title>
  </head>
  <body style="margin:0; padding:0; background:#F5F0E8; color:#1A1A1A;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      ${escapedIntro}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5F0E8; margin:0; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#FFF8F0; border:1px solid #E5DED3;">
            <tr>
              <td style="padding:40px 32px 20px; text-align:center;">
                <div style="font-family:Arial, sans-serif; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#B8974A; font-weight:700;">
                  Mlabelle Beauty
                </div>
                <h1 style="margin:18px 0 0; font-family:'Noto Serif', Georgia, serif; font-size:34px; line-height:1.25; font-weight:400; color:#1A1A1A;">
                  ${escapedIntro}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px; text-align:center;">
                <p style="margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#4F4A43;">
                  Bonjour ${clientName},<br>
                  ${escapedBody}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #D8CDBD; border-bottom:1px solid #D8CDBD;">
                  ${buildDetailRow('Prestation', serviceName)}
                  ${buildDetailRow('Date', date)}
                  ${buildDetailRow('Heure', slot)}
                  ${buildDetailRow('Durée', duration)}
                  ${buildDetailRow('Prix', price)}
                </table>
              </td>
            </tr>
            ${
              !isCancellation
                ? `<tr>
              <td style="padding:0 32px 28px;">
                <div style="background:#F5F0E8; border-left:4px solid #B8974A; padding:18px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:15px; line-height:1.6; color:#1A1A1A;">
                    Paiement sur place.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 36px; text-align:center;">
                <a href="${escapeHtml(cancelUrl)}" style="display:inline-block; border:1px solid #B8974A; color:#1A1A1A; font-family:Arial, sans-serif; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; padding:14px 22px;">
                  Annuler ma réservation
                </a>
              </td>
            </tr>`
                : ''
            }
            <tr>
              <td style="padding:28px 32px 40px; text-align:center; background:#1A1A1A;">
                <p style="margin:0 0 8px; font-family:'Noto Serif', Georgia, serif; font-size:22px; line-height:1.4; color:#FFF8F0;">
                  Mlabelle Beauty
                </p>
                <p style="margin:0; font-family:Arial, sans-serif; font-size:13px; line-height:1.6; color:#E5DED3;">
                  Merci pour votre confiance.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildDetailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:16px 0; font-family:Arial, sans-serif; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:#7A776F; border-bottom:1px solid #E5DED3;">
      ${escapeHtml(label)}
    </td>
    <td align="right" style="padding:16px 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.5; color:#1A1A1A; border-bottom:1px solid #E5DED3;">
      ${value}
    </td>
  </tr>`;
}

function buildCancelUrl(cancelToken: string): string {
  const baseUrl = getSiteUrl();
  const url = new URL('/booking/cancel', baseUrl);
  url.searchParams.set('token', cancelToken);
  return url.toString();
}

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`);
  }

  return 'http://localhost:3000';
}

function normalizeUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
