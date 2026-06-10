import { describe, expect, it } from 'vitest';
import { ADMIN_ROLE, isAdminUser } from './utils';

type AuthUserInput = Parameters<typeof isAdminUser>[0];

const HAIRDRESSER_ROLE = 'hairdresser';
const EMAIL_PROVIDER = 'email';

describe('isAdminUser', () => {
  it('returns true when the auth user has the admin app role', () => {
    const user: AuthUserInput = {
      app_metadata: {
        role: ADMIN_ROLE,
      },
    };

    expect(isAdminUser(user)).toBe(true);
  });

  it('returns false when the auth user has another app role', () => {
    const user: AuthUserInput = {
      app_metadata: {
        role: HAIRDRESSER_ROLE,
      },
    };

    expect(isAdminUser(user)).toBe(false);
  });

  it('returns false when the app role is missing', () => {
    const user: AuthUserInput = {
      app_metadata: {
        provider: EMAIL_PROVIDER,
      },
    };

    expect(isAdminUser(user)).toBe(false);
  });

  it('returns false when no user is available', () => {
    expect(isAdminUser(null)).toBe(false);
    expect(isAdminUser(undefined)).toBe(false);
  });
});
