import { createServerClient } from '@/lib/supabase/server'
import type { CreateServiceCategoryInput } from '@/types/service-category'

export async function createServiceCategory(
  input: CreateServiceCategoryInput
): Promise<{ id: string; name: string }> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('service_categories')
    .insert(input)
    .select('id, name')
    .single()

  if (error?.code === '23505') throw new Error('CATEGORY_NAME_ALREADY_EXISTS')
  if (error) throw new Error(error.message)
  if (!data) throw new Error('CATEGORY_CREATION_FAILED')

  return data
}

export async function updateServiceCategory(
  id: string,
  input: CreateServiceCategoryInput
): Promise<{ id: string; name: string }> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('service_categories')
    .update(input)
    .eq('id', id)
    .select('id, name')
    .single()

  if (error?.code === '23505') throw new Error('CATEGORY_NAME_ALREADY_EXISTS')
  if (error) throw new Error(error.message)
  if (!data) throw new Error('CATEGORY_UPDATE_FAILED')

  return data
}

export async function deleteServiceCategory(id: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase.from('service_categories').delete().eq('id', id)

  if (error?.code === '23503') throw new Error('CATEGORY_HAS_SERVICES')
  if (error) throw new Error(error.message)
}
