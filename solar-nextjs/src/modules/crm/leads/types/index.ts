export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
export type LeadSource = 'website' | 'whatsapp' | 'referral' | 'social' | 'direct' | 'manual';

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  source: LeadSource;
  system_kw: number | null;
  rooftop_area: number | null;
  monthly_bill: number | null;
  status: LeadStatus;
  assigned_to: string | null;
  notes: string | null;
  lead_score: number;
}

export interface WebLead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  status: 'unread' | 'read' | 'contacted' | 'converted' | 'dismissed';
  dismiss_reason: string | null;
  converted_lead_id: string | null;
}
