import { createTenantSupabaseClient, getTenantByHost } from '../tenant/tenant.server';
import { DB_TABLES } from '@/config/db-tables';

export interface CreateLeadPayload {
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  metadata?: Record<string, any>;
}

/**
 * Lead Service - Handles lead generation and CRM operations.
 * Enforces multi-tenant data isolation.
 */
export class LeadsService {
  /**
   * Submit a new lead from a public-facing website form (unauthenticated).
   * Automatically resolves the tenant_id from the host domain.
   */
  static async submitPublicLead(payload: CreateLeadPayload) {
    const { tenant } = await getTenantByHost();

    if (!tenant) {
      throw new Error('Tenant configuration missing. Cannot route lead.');
    }

    const supabase = createTenantSupabaseClient();

    const { data, error } = await supabase
      .from(DB_TABLES.LEADS)
      .insert({
        tenant_id: tenant.id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        source: payload.source || 'website',
        metadata: payload.metadata || {},
      })
      .select('id')
      .single();

    if (error) {
      console.error('Lead submission failed:', error);
      throw new Error('Failed to submit lead.');
    }

    return data;
  }

  /**
   * Retrieve leads for the currently authenticated tenant admin.
   * RLS automatically filters this based on the authenticated user's session.
   */
  static async getDashboardLeads() {
    const supabase = createTenantSupabaseClient();

    // RLS in Supabase: `tenant_id in (select public.get_auth_user_tenant_ids())`
    // This query is inherently safe. No manual `eq('tenant_id', ...)` needed!
    const { data, error } = await supabase
      .from(DB_TABLES.LEADS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
