'use server'

import { revalidatePath } from 'next/cache'
import {
  createServiceCategory,
  deleteServiceCategory,
  updateServiceCategory,
} from '@/features/service-categories/mutations'
import { buildServiceCategoryInput } from '@/features/service-categories/utils'
import type { ActionResult } from '@/types/action'

export async function createServiceCategoryAction(name: string): Promise<ActionResult> {
  const parsedInput = buildServiceCategoryInput(name)
  if (!parsedInput.success) return parsedInput

  try {
    await createServiceCategory(parsedInput.data)
    revalidateCategoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: getCategoryActionError(error, 'créer') }
  }
}

export async function updateServiceCategoryAction(
  id: string,
  name: string
): Promise<ActionResult> {
  const parsedInput = buildServiceCategoryInput(name)
  if (!parsedInput.success) return parsedInput

  try {
    await updateServiceCategory(id, parsedInput.data)
    revalidateCategoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: getCategoryActionError(error, 'modifier') }
  }
}

export async function deleteServiceCategoryAction(id: string): Promise<ActionResult> {
  try {
    await deleteServiceCategory(id)
    revalidateCategoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: getCategoryActionError(error, 'supprimer') }
  }
}

function getCategoryActionError(error: unknown, operation: string): string {
  if (error instanceof Error && error.message === 'CATEGORY_NAME_ALREADY_EXISTS') {
    return 'Une catégorie portant ce nom existe déjà.'
  }

  if (error instanceof Error && error.message === 'CATEGORY_HAS_SERVICES') {
    return 'Cette catégorie contient encore des prestations. Déplacez-les avant de la supprimer.'
  }

  return `Impossible de ${operation} la catégorie.`
}

function revalidateCategoryPaths() {
  revalidatePath('/')
  revalidatePath('/categories')
  revalidatePath('/services')
}
