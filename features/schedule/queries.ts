// Read-only Supabase queries for schedule data
import { createServerClient } from '@/lib/supabase/server';
import type { ScheduleRule, DayOff } from '@/types/schedule';

/**
 * Fetches all schedule rules, ordered by day_of_week.
 */
export async function getAllScheduleRules(): Promise<ScheduleRule[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('schedule_rules')
    .select('id, day_of_week, open_time, close_time, is_active')
    .order('day_of_week');

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetches all future days off, ordered by date.
 */
export async function getAllDaysOff(): Promise<DayOff[]> {
  const supabase = await createServerClient();

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('days_off')
    .select('id, date, reason')
    .gte('date', today)
    .order('date');

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    reason: row.reason ?? undefined,
  }));
}
