import { Lead, WebLead } from '../types';
import { createClient } from '@/services/supabase/client';

export const LeadsService = {
  // Leads
  async getLeads(): Promise<Lead[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Lead[];
  },

  async addLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'lead_score'>): Promise<Lead> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Lead;
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Lead;
  },

  // Web Leads
  async getWebLeads(): Promise<WebLead[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('web_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as WebLead[];
  },
};
