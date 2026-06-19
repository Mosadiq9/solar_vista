import { createTenantSupabaseClient, getTenantByHost } from '../tenant/tenant.server';
import { DB_TABLES } from '@/config/db-tables';

export type AuthResult = {
  user: any | null;
  isSuperAdmin: boolean;
  isTenantAdmin: boolean;
  isTenantMember: boolean;
  error: Error | null;
};

/**
 * Validates the currently authenticated user against the active tenant domain.
 * Ensures that users cannot access a different tenant's dashboard even if they are logged in.
 */
export async function getTenantAuthSession(): Promise<AuthResult> {
  const supabase = createTenantSupabaseClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return {
      user: null,
      isSuperAdmin: false,
      isTenantAdmin: false,
      isTenantMember: false,
      error: sessionError || new Error('Not authenticated'),
    };
  }

  // Identify which tenant this request belongs to
  const { tenant } = await getTenantByHost();

  if (!tenant) {
    return {
      user: session.user,
      isSuperAdmin: false,
      isTenantAdmin: false,
      isTenantMember: false,
      error: new Error('Tenant not found for this host'),
    };
  }

  // Validate the user's role in THIS specific tenant
  const { data: tenantUser, error: roleError } = await supabase
    .from(DB_TABLES.TENANT_USERS)
    .select('role')
    .eq('user_id', session.user.id)
    .eq('tenant_id', tenant.id)
    .single();

  if (roleError || !tenantUser) {
    return {
      user: session.user,
      isSuperAdmin: false,
      isTenantAdmin: false,
      isTenantMember: false,
      error: new Error('User does not have access to this tenant'),
    };
  }

  return {
    user: session.user,
    isSuperAdmin: tenantUser.role === 'super_admin',
    isTenantAdmin: tenantUser.role === 'tenant_admin' || tenantUser.role === 'super_admin',
    isTenantMember: true, // If they exist in tenant_users, they are at least a member
    error: null,
  };
}
