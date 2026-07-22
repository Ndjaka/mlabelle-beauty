// Server Actions for services — orchestrate CRUD operations
'use server';

import type { ActionResult } from '@/types/action';
import type { CreateServiceInput, Service } from '@/types/service';
import { createService, updateService, toggleServiceActive } from '@/features/services/mutations';

type ServiceActionResult = ActionResult & {
  service?: Service
}

/**
 * Creates a new service.
 */
export async function createServiceAction(data: CreateServiceInput): Promise<ServiceActionResult> {
  try {
    const service = await createService(data);
    return { success: true, service };
  } catch (err) {
    return { success: false, error: getServiceActionError(err, 'créer') };
  }
}

/**
 * Updates an existing service.
 */
export async function updateServiceAction(
  id: string,
  data: Partial<CreateServiceInput>
): Promise<ServiceActionResult> {
  try {
    const service = await updateService(id, data);
    return { success: true, service };
  } catch (err) {
    return { success: false, error: getServiceActionError(err, 'modifier') };
  }
}

function getServiceActionError(error: unknown, operation: string): string {
  if (error instanceof Error && error.message === 'SERVICE_CATEGORY_NOT_FOUND') {
    return 'La catégorie sélectionnée n’existe plus. Actualisez la page et réessayez.';
  }

  return `Impossible de ${operation} la prestation.`;
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
