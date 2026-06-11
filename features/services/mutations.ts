import { createServerClient } from '@/lib/supabase/server'
import type { CreateServiceInput, Service } from '@/types/service'

/**
 * Creates a new service.
 */
export async function createService(data: CreateServiceInput): Promise<Service> {
  const supabase = await createServerClient()

  const { data: service, error } = await supabase
    .from('services')
    .insert({
      name: data.name,
      description: data.description ?? null,
      image_url: data.image_url ?? null,
      duration_minutes: data.duration_minutes,
      price_cents: data.price_cents,
      is_active: true,
    })
    .select('id, name, description, image_url, duration_minutes, price_cents, is_active')
    .single()

  if (error) throw new Error(error.message)
  if (!service) throw new Error('Service creation failed: no data returned')
  return service
}

/**
 * Updates an existing service.
 */
export async function updateService(
  id: string,
  data: Partial<CreateServiceInput>
): Promise<Service> {
  const supabase = await createServerClient()

  const { data: service, error } = await supabase
    .from('services')
    .update(data)
    .eq('id', id)
    .select('id, name, description, image_url, duration_minutes, price_cents, is_active')
    .single()

  if (error) throw new Error(error.message)
  if (!service) throw new Error('Service update failed: no data returned')
  return service
}

/**
 * Toggles a service's is_active flag (soft delete/restore).
 */
export async function toggleServiceActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
