export interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceName: string;
  date: string;
  slot: string;
  duration: string;
  price: string;
  cancelToken: string;
}

export interface HairdresserBookingRequestEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceName: string;
  date: string;
  slot: string;
  duration: string;
  price: string;
  deposit: string;
}

export interface BookingEmailTemplateOptions {
  trustedBodyHtml?: string;
  trustedPaymentNoticeHtml?: string;
  titleFontSize?: '28px' | '34px';
  bodyTextAlign?: 'center' | 'left';
}

interface BookingEmailHtmlParams {
  data: BookingEmailData;
  intro: string;
  body: string;
  paymentNotice: string;
  isCancellation: boolean;
  options?: BookingEmailTemplateOptions;
}

export function buildBookingEmailHtml({
  data,
  intro,
  body,
  paymentNotice,
  isCancellation,
  options = {},
}: BookingEmailHtmlParams): string {
  const cancelUrl = buildCancelUrl(data.cancelToken);
  const clientName = escapeHtml(data.clientName);
  const serviceName = escapeHtml(data.serviceName);
  const date = escapeHtml(data.date);
  const slot = escapeHtml(data.slot);
  const duration = escapeHtml(data.duration);
  const price = escapeHtml(data.price);
  const escapedIntro = escapeHtml(intro);
  const renderedBody = options.trustedBodyHtml ?? escapeHtml(body);
  const renderedPaymentNotice =
    options.trustedPaymentNoticeHtml ?? escapeHtml(paymentNotice);
  const titleFontSize = options.titleFontSize ?? '28px';
  const bodyTextAlign = options.bodyTextAlign ?? 'left';

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
                <h1 style="margin:18px 0 0; font-family:'Noto Serif', Georgia, serif; font-size:${titleFontSize}; line-height:1.25; font-weight:400; color:#1A1A1A;">
                  ${escapedIntro}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px; text-align:${bodyTextAlign};">
                <p style="margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#4F4A43;">
                  Bonjour ${clientName},<br>
                  ${renderedBody}
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
                    ${renderedPaymentNotice}
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

export function buildHairdresserBookingRequestEmailHtml(
  data: HairdresserBookingRequestEmailData
): string {
  const clientName = escapeHtml(data.clientName);
  const clientEmail = escapeHtml(data.clientEmail);
  const clientPhone = escapeHtml(data.clientPhone ?? 'Non renseigné');
  const serviceName = escapeHtml(data.serviceName);
  const date = escapeHtml(data.date);
  const slot = escapeHtml(data.slot);
  const duration = escapeHtml(data.duration);
  const price = escapeHtml(data.price);
  const deposit = escapeHtml(data.deposit);
  const dashboardUrl = `${getSiteUrl()}/dashboard`;

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nouvelle demande — Mlabelle Beauty</title>
  </head>
  <body style="margin:0; padding:0; background:#F5F0E8; color:#1A1A1A;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Nouvelle demande de réservation à valider.
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
                <h1 style="margin:18px 0 0; font-family:'Noto Serif', Georgia, serif; font-size:28px; line-height:1.25; font-weight:400; color:#1A1A1A;">
                  Nouvelle demande à valider
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px; text-align:left;">
                <p style="margin:0; font-family:Arial, sans-serif; font-size:16px; line-height:1.7; color:#4F4A43;">
                  Une cliente vient d’envoyer une demande de réservation. Le rendez-vous reste à confirmer après validation de l’acompte.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #D8CDBD; border-bottom:1px solid #D8CDBD;">
                  ${buildDetailRow('Cliente', clientName)}
                  ${buildDetailRow('E-mail', clientEmail)}
                  ${buildDetailRow('Téléphone', clientPhone)}
                  ${buildDetailRow('Prestation', serviceName)}
                  ${buildDetailRow('Date', date)}
                  ${buildDetailRow('Heure', slot)}
                  ${buildDetailRow('Durée', duration)}
                  ${buildDetailRow('Prix', price)}
                  ${buildDetailRow('Acompte attendu', deposit)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;">
                <div style="background:#F5F0E8; border-left:4px solid #B8974A; padding:18px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:15px; line-height:1.6; color:#1A1A1A;">
                    <strong style="font-weight:700; color:#1A1A1A;">Action à faire :</strong> vérifier l’acompte, puis confirmer la réservation depuis le tableau de bord.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 36px; text-align:center;">
                <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block; background:#1A1A1A; color:#FFF8F0; font-family:Arial, sans-serif; font-size:12px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; padding:15px 24px;">
                  Ouvrir le tableau de bord
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 40px; text-align:center; background:#1A1A1A;">
                <p style="margin:0 0 8px; font-family:'Noto Serif', Georgia, serif; font-size:22px; line-height:1.4; color:#FFF8F0;">
                  Mlabelle Beauty
                </p>
                <p style="margin:0; font-family:Arial, sans-serif; font-size:13px; line-height:1.6; color:#E5DED3;">
                  Notification interne de réservation.
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
    <td align="right" style="padding:16px 0; font-family:Arial, sans-serif; font-size:15px; line-height:1.5; font-weight:700; color:#1A1A1A; border-bottom:1px solid #E5DED3;">
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
