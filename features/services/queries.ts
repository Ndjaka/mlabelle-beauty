import { createServerClient } from '@/lib/supabase/server'
import type { PaginatedServices, Service } from '@/types/service'

const SERVICE_SELECT = 'id, name, description, image_url, duration_minutes, price_cents, price_max_cents, is_active, category_id, category:service_categories(id, name)'

/**
 * Fetches all services with server-side pagination and filtering.
 * Used by the dashboard to manage services.
 */
export async function getAllServices(
  page = 1,
  pageSize = 10,
  search = '',
  status: 'all' | 'active' | 'inactive' = 'all',
  categoryId = ''
): Promise<PaginatedServices> {
  const supabase = await createServerClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('services')
    .select(SERVICE_SELECT, {
      count: 'exact',
    })

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (status === 'active') {
    query = query.eq('is_active', true)
  } else if (status === 'inactive') {
    query = query.eq('is_active', false)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  query = query.order('name').range(from, to)

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { data: data ?? [], total: count ?? 0 }
}

/**
 * Fetches only active services, ordered by name.
 * Used by the public booking page.
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_SELECT)
    .eq('is_active', true)
    .order('name')

  if (error) throw new Error(error.message)
  return data
}
