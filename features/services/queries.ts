// Read-only Supabase queries for services data
import { createServerClient } from '@/lib/supabase/server';
import type { Service } from '@/types/service';

/**
 * Fetches all services (active and inactive), ordered by name.
 * Used by the dashboard to manage services.
 */
export async function getAllServices(): Promise<Service[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('id, name, duration_minutes, price_cents, is_active')
    .order('name');

  if (error) throw new Error(error.message);
  return data;
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
