// Write operations for schedule data (update rules, add days off)
import { createServerClient } from '@/lib/supabase/server';
import type { ScheduleRule } from '@/types/schedule';

/**
 * Updates a schedule rule (open/close time, active status).
 */
export async function updateScheduleRule(
  id: string,
  data: Partial<Omit<ScheduleRule, 'id'>>
): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('schedule_rules')
    .update(data)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

/**
 * Adds a new day off.
 */
export async function addDayOff(
  date: string,
  reason?: string
): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('days_off')
    .insert({ date, reason: reason ?? null });

  if (error) throw new Error(error.message);
}

/**
 * Removes a day off by its id.
 */
export async function removeDayOff(id: string): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('days_off')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
