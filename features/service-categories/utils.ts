import type { CreateServiceCategoryInput } from '@/types/service-category'

const MAX_CATEGORY_NAME_LENGTH = 80

type ServiceCategoryFormResult =
  | { success: true; data: CreateServiceCategoryInput }
  | { success: false; error: string }

export function buildServiceCategoryInput(nameValue: string): ServiceCategoryFormResult {
  const name = nameValue.trim().replace(/\s+/g, ' ')

  if (!name) {
    return { success: false, error: 'Le nom de la catégorie est requis.' }
  }

  if (name.length > MAX_CATEGORY_NAME_LENGTH) {
    return {
      success: false,
      error: `Le nom ne doit pas dépasser ${MAX_CATEGORY_NAME_LENGTH} caractères.`,
    }
  }

  return { success: true, data: { name } }
}

export function hasMoreServiceCategories(loadedCount: number, total: number): boolean {
  return loadedCount < total
}

export function getNextServiceCategoriesPage(currentPage: number): number {
  return currentPage + 1
}
