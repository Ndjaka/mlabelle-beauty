import { runClientReminderJob } from '@/features/notifications/client-reminders';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  if (!isAuthorizedCronRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runClientReminderJob();

  return Response.json({ ok: true, result });
}

function isAuthorizedCronRequest(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;

  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
}
