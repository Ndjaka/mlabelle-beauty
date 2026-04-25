// Server Actions for services — orchestrate CRUD operations
'use server';

import type { ActionResult } from '@/types/action';
import type { CreateServiceInput } from '@/types/service';
import { createService, updateService, toggleServiceActive } from '@/features/services/mutations';

/**
 * Creates a new service.
 */
export async function createServiceAction(data: CreateServiceInput): Promise<ActionResult> {
  try {
    await createService(data);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible de créer le service : ${message}` };
  }
}

/**
 * Updates an existing service.
 */
export async function updateServiceAction(
  id: string,
  data: Partial<CreateServiceInput>
): Promise<ActionResult> {
  try {
    await updateService(id, data);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible de modifier le service : ${message}` };
  }
}

/**
 * Toggles a service's active status.
 */
export async function toggleServiceAction(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    await toggleServiceActive(id, isActive);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return { success: false, error: `Impossible de modifier le statut : ${message}` };
  }
}
