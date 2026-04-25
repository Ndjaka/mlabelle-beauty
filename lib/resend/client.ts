// Resend client instance — use for transactional email sending
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
