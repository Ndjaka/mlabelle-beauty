// Server Actions for schedule — manage availability and days off
'use server';

import type { ActionResult } from '@/types/action';
import type { ScheduleRule } from '@/types/schedule';
import { updateScheduleRule, addDayOff, removeDayOff } from '@/features/schedule/mutations';

/**
 * Updates a schedule rule (open/close time, active status).
 */
export async function updateScheduleAction(
  id: string,
  data: Partial<Omit<ScheduleRule, 'id'>>
): Promise<ActionResult> {
  try {
    await updateScheduleRule(id, data);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible de modifier l'horaire : ${message}` };
  }
}

/**
 * Adds a new day off.
 */
export async function addDayOffAction(
  date: string,
  reason?: string
): Promise<ActionResult> {
  try {
    await addDayOff(date, reason);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible d'ajouter le congé : ${message}` };
  }
}

/**
 * Removes a day off.
 */
export async function removeDayOffAction(id: string): Promise<ActionResult> {
  try {
    await removeDayOff(id);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible de supprimer le congé : ${message}` };
  }
}
