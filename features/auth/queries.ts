import { createServerClient } from '@/lib/supabase/server';

export async function getCurrentAuthUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}
