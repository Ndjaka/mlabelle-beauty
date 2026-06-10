// Read-only Supabase queries for services data
import { createServerClient } from '@/lib/supabase/server';
import type { Service, PaginatedServices } from '@/types/service';

/**
 * Fetches all services with server-side pagination and filtering.
 * Used by the dashboard to manage services.
 */
export async function getAllServices(
  page = 1,
  pageSize = 10,
  search = '',
  status: 'all' | 'active' | 'inactive' = 'all'
): Promise<PaginatedServices> {
  const supabase = await createServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('services')
    .select('id, name, duration_minutes, price_cents, is_active', { count: 'exact' });

  if (search) {
    // Search in name or description
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (status === 'active') {
    query = query.eq('is_active', true);
  } else if (status === 'inactive') {
    query = query.eq('is_active', false);
  }

  query = query.order('name').range(from, to);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { data: data || [], total: count || 0 };
}

/**
 * Fetches only active services, ordered by name.
 * Used by the public booking page.
 */
export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('id, name, duration_minutes, price_cents, is_active')
    .eq('is_active', true)
    .order('name');

  if (error) throw new Error(error.message);
  return data;
}
