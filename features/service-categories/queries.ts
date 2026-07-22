import { createServerClient } from '@/lib/supabase/server'
import type { ServiceCategory } from '@/types/service-category'

export async function getAllServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = await createServerClient()
  const [categoriesResult, servicesResult] = await Promise.all([
    supabase.from('service_categories').select('id, name').order('name'),
    supabase.from('services').select('category_id'),
  ])

  if (categoriesResult.error) throw new Error(categoriesResult.error.message)
  if (servicesResult.error) throw new Error(servicesResult.error.message)

  const serviceCounts = new Map<string, number>()
  for (const service of servicesResult.data) {
    serviceCounts.set(service.category_id, (serviceCounts.get(service.category_id) ?? 0) + 1)
  }

  return categoriesResult.data.map((category) => ({
    ...category,
    service_count: serviceCounts.get(category.id) ?? 0,
  }))
}
