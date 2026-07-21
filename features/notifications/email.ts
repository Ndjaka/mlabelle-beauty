// Email notification functions using Resend
import { resend } from '@/lib/resend/client';
import { BOOKING_DEPOSIT_LABEL } from '@/features/booking/deposit';
import {
  buildHairdresserBookingRequestEmailHtml,
  buildBookingEmailHtml,
  type BookingEmailData,
  type HairdresserBookingRequestEmailData,
  type BookingEmailTemplateOptions,
} from '@/features/notifications/utils';
import type { ClientReminderKind } from '@/types/booking';

const EMAIL_FROM = 'Mlabelle Beauty <contact@mlabelle-beauty.fr>';
const CONFIRMATION_SUBJECT = 'Votre réservation est confirmée — Mlabelle Beauty';
const REQUEST_RECEIVED_SUBJECT = 'Votre demande de réservation est reçue — Mlabelle Beauty';
const DAY_BEFORE_REMINDER_SUBJECT = 'Rappel — Votre rendez-vous demain chez Mlabelle Beauty';
const TWO_HOURS_REMINDER_SUBJECT = 'Rappel — Votre rendez-vous dans 2h chez Mlabelle Beauty';

export type { BookingEmailData } from '@/features/notifications/utils';

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  const depositValidatedHtml =
    '<strong style="font-weight:700; color:#1A1A1A;">Votre acompte a bien été validé.</strong>';
  const confirmedAppointmentHtml =
    '<strong style="font-weight:700; color:#1A1A1A;">Votre rendez-vous est confirmé.</strong>';

  await sendBookingEmail({
    data,
    subject: CONFIRMATION_SUBJECT,
    intro: 'Votre réservation est confirmée.',
    body: 'Votre acompte a bien été validé. Votre rendez-vous chez Mlabelle Beauty est confirmé.',
    paymentNotice: 'Acompte validé. Le solde pourra être réglé sur place.',
    templateOptions: {
      trustedBodyHtml: `${depositValidatedHtml} ${confirmedAppointmentHtml}`,
      trustedPaymentNoticeHtml:
        '<strong style="font-weight:700; color:#1A1A1A;">Acompte validé.</strong> Le solde pourra être réglé sur place.',
    },
  });
}

export async function sendAdminCreatedBookingConfirmation(data: BookingEmailData): Promise<void> {
  const confirmedAppointmentHtml =
    '<strong style="font-weight:700; color:#1A1A1A;">Votre rendez-vous est confirmé.</strong>';

  await sendBookingEmail({
    data,
    subject: CONFIRMATION_SUBJECT,
    intro: 'Votre rendez-vous est confirmé.',
    body: 'Votre rendez-vous chez Mlabelle Beauty a été ajouté et confirmé par le salon.',
    paymentNotice: 'Paiement sur place.',
    templateOptions: {
      trustedBodyHtml: `${confirmedAppointmentHtml} Le salon a ajouté votre rendez-vous à son agenda.`,
      trustedPaymentNoticeHtml: 'Paiement sur place.',
    },
  });
}

export async function sendBookingRequestReceived(data: BookingEmailData): Promise<void> {
  const depositHighlightHtml = `<strong style="font-weight:700; color:#1A1A1A;">${BOOKING_DEPOSIT_LABEL}</strong>`;

  await sendBookingEmail({
    data,
    subject: REQUEST_RECEIVED_SUBJECT,
    intro: 'Votre demande de réservation est reçue.',
    body: `Nous avons bien reçu votre demande. Pour confirmer définitivement votre rendez-vous, un acompte de ${BOOKING_DEPOSIT_LABEL} est nécessaire. Le salon vous indiquera comment régler cet acompte.`,
    paymentNotice: `Acompte à régler pour confirmation : ${BOOKING_DEPOSIT_LABEL}.`,
    templateOptions: {
      trustedBodyHtml: `Nous avons bien reçu votre demande. Pour confirmer définitivement votre rendez-vous, un acompte de ${depositHighlightHtml} est nécessaire. Le salon vous indiquera comment régler cet acompte.`,
      trustedPaymentNoticeHtml: `Acompte à régler pour confirmation : ${depositHighlightHtml}.`,
      titleFontSize: '28px',
      bodyTextAlign: 'left',
    },
  });
}

export async function sendHairdresserBookingRequestReceived(
  data: HairdresserBookingRequestEmailData
): Promise<void> {
  const recipients = getHairdresserNotificationRecipients();

  if (recipients.length === 0) return;

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: recipients,
    subject: `Nouvelle demande — ${data.serviceName} le ${data.date}`,
    html: buildHairdresserBookingRequestEmailHtml(data),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendBookingReminder(
  data: BookingEmailData,
  kind: ClientReminderKind
): Promise<void> {
  const content = getReminderContent(kind);

  await sendBookingEmail({
    data,
    subject: content.subject,
    intro: content.intro,
    body: content.body,
    paymentNotice:
      'Besoin d\'annuler ? Utilisez le lien ci-dessous afin de libérer le créneau.',
    templateOptions: {
      trustedBodyHtml: content.trustedBodyHtml,
      trustedPaymentNoticeHtml:
        'Besoin d’annuler ? Utilisez le lien ci-dessous afin de <strong style="font-weight:700; color:#1A1A1A;">libérer le créneau</strong>.',
    },
  });
}

export async function sendBookingCancellation(data: BookingEmailData): Promise<void> {
  const cancellationConfirmedHtml =
    '<strong style="font-weight:700; color:#1A1A1A;">Votre rendez-vous a bien été annulé.</strong>';

  await sendBookingEmail({
    data,
    subject: 'Annulation confirmée — Mlabelle Beauty',
    intro: 'Votre rendez-vous est annulé.',
    body: 'Nous vous confirmons l\'annulation de votre rendez-vous chez Mlabelle Beauty. Nous espérons vous revoir bientôt.',
    isCancellation: true,
    templateOptions: {
      trustedBodyHtml: `${cancellationConfirmedHtml} Nous espérons vous revoir bientôt chez Mlabelle Beauty.`,
    },
  });
}

async function sendBookingEmail({
  data,
  subject,
  intro,
  body,
  paymentNotice = 'Paiement sur place.',
  isCancellation = false,
  templateOptions,
}: {
  data: BookingEmailData;
  subject: string;
  intro: string;
  body: string;
  paymentNotice?: string;
  isCancellation?: boolean;
  templateOptions?: BookingEmailTemplateOptions;
}): Promise<void> {
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: data.clientEmail,
    subject,
    html: buildBookingEmailHtml({
      data,
      intro,
      body,
      paymentNotice,
      isCancellation,
      options: templateOptions,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
}

function getReminderContent(kind: ClientReminderKind): {
  subject: string;
  intro: string;
  body: string;
  trustedBodyHtml: string;
} {
  if (kind === 'two_hours_before') {
    return {
      subject: TWO_HOURS_REMINDER_SUBJECT,
      intro: 'Votre rendez-vous commence dans 2h.',
      body: 'Votre parenthèse beauté approche. Voici le récapitulatif de votre rendez-vous.',
      trustedBodyHtml:
        'Votre parenthèse beauté commence dans <strong style="font-weight:700; color:#1A1A1A;">2h</strong>. Voici le <strong style="font-weight:700; color:#1A1A1A;">récapitulatif de votre rendez-vous</strong>.',
    };
  }

  return {
    subject: DAY_BEFORE_REMINDER_SUBJECT,
    intro: 'Nous vous rappelons votre rendez-vous demain.',
    body: 'Votre parenthèse beauté approche. Voici le récapitulatif de votre rendez-vous.',
    trustedBodyHtml:
      'Votre parenthèse beauté approche. Voici le <strong style="font-weight:700; color:#1A1A1A;">récapitulatif de votre rendez-vous</strong>.',
  };
}

function getHairdresserNotificationRecipients(): string[] {
  const configuredRecipients = process.env.HAIRDRESSER_NOTIFICATION_EMAIL;

  if (!configuredRecipients) return [];

  return configuredRecipients
    .split(',')
    .map((recipient) => recipient.trim())
    .filter((recipient) => recipient.length > 0);
}
