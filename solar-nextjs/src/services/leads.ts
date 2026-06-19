// ─────────────────────────────────────────────────────────────────────────────
// LEADS SERVICE — Business logic for lead management
// ─────────────────────────────────────────────────────────────────────────────

import type { ContactFormData, ApiResponse, Lead } from '@/types/common';

/**
 * submitLead — Submit a new lead from the contact form
 * Server Action compatible — runs on server
 */
export async function submitLead(data: ContactFormData): Promise<ApiResponse<{ id: string }>> {
  try {
    // TODO: Connect to Supabase when ready
    // const supabase = await createClient();
    // const { data: lead, error } = await supabase.from('leads').insert({...}).select('id').single();

    // Placeholder implementation
    console.warn('Lead submission — Supabase not yet connected. Data:', data);

    return {
      data: { id: `lead-${Date.now()}` },
      error: null,
      success: true,
      message: 'Lead submitted successfully',
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
      success: false,
    };
  }
}

/**
 * getLeads — Fetch all leads (admin use only)
 */
export async function getLeads(): Promise<ApiResponse<Lead[]>> {
  try {
    // TODO: Connect to Supabase when admin panel is ready
    return {
      data: [],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
      success: false,
    };
  }
}
