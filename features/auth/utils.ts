export const ADMIN_ROLE = 'admin';

interface AuthUserWithMetadata {
  app_metadata?: Record<string, unknown> | null;
}

export function isAdminUser(user: AuthUserWithMetadata | null | undefined): boolean {
  return user?.app_metadata?.role === ADMIN_ROLE;
}
