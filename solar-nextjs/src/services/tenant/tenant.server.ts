import { headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Tenant, TenantSettings } from '@/types/tenant';
import { DB_TABLES } from '@/config/db-tables';

// Helper to create a Supabase client for Server Components
export function createTenantSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * Resolves the current tenant based on the incoming request hostname.
 *
 * Supports:
 * - customdomain.com (checks custom_domain)
 * - tenant.platform.com (checks slug)
 * - localhost:3000 (fallback to default/test tenant)
 */
export async function getTenantByHost(): Promise<{
  tenant: Tenant | null;
  settings: TenantSettings | null;
}> {
  const headersList = headers();
  const host = headersList.get('host') || '';

  // Remove port for localhost testing
  const hostname = host.split(':')[0];

  // MVP Mock Mode: Bypass Supabase query for local testing
  // const supabase = createTenantSupabaseClient();
  // let query = supabase
  //   .from(DB_TABLES.TENANTS)
  //   .select(`*, ${DB_TABLES.TENANT_SETTINGS}(*)`)
  //   .eq('status', 'active');
  // ...
  // const { data, error } = await query.single();

  // Return a completely mocked Tenant object instead
  const tenant: Tenant = {
    id: 'mock-tenant-id',
    name: 'Chauhan Solar',
    slug: 'chauhan',
    customDomain: null,
    status: 'active',
  };

  const settings: TenantSettings = {
    tenantId: 'mock-tenant-id',
    companyName: 'Chauhan Solar',
    contactEmail: 'contact@chauhansolar.com',
    contactPhone: '+91 98765 43210',
    logoUrl: null,
    faviconUrl: null,
    primaryColor: '#F59E0B',
    secondaryColor: '#10B981',
    fontFamily: 'Inter',
    seoTitle: 'Chauhan Solar Admin',
    seoDescription: 'Solar CRM Administration',
    features: { kanban: true, multiLanguage: true },
  };

  return { tenant, settings };
}
