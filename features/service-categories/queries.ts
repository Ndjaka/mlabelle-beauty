import { createServerClient } from '@/lib/supabase/server'
import type { PaginatedServiceCategories, ServiceCategory } from '@/types/service-category'

export async function getAllServiceCategories(): Promise<ServiceCategory[]> {
  const result = await getPaginatedServiceCategories({ page: 1, pageSize: 500 })

  return result.data
}

export async function getPaginatedServiceCategories({
  page = 1,
  pageSize = 10,
}: {
  page?: number
  pageSize?: number
} = {}): Promise<PaginatedServiceCategories> {
  const supabase = await createServerClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const [categoriesResult, servicesResult] = await Promise.all([
    supabase
      .from('service_categories')
      .select('id, name', { count: 'exact' })
      .order('name')
      .range(from, to),
    supabase.from('services').select('category_id'),
  ])

  if (categoriesResult.error) throw new Error(categoriesResult.error.message)
  if (servicesResult.error) throw new Error(servicesResult.error.message)

  const serviceCounts = new Map<string, number>()
  for (const service of servicesResult.data) {
    serviceCounts.set(service.category_id, (serviceCounts.get(service.category_id) ?? 0) + 1)
  }

  return {
    data: categoriesResult.data.map((category) => ({
      ...category,
      service_count: serviceCounts.get(category.id) ?? 0,
    })),
    total: categoriesResult.count ?? 0,
  }
}
