import { Lead, WebLead } from '../types';

// Mock data to work with while we build the UI without a connected Supabase backend
const mockLeads: Lead[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 10000000).toISOString(),
    updated_at: new Date(Date.now() - 5000000).toISOString(),
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.s@example.com',
    address: '123 Solara Street',
    city: 'Ahmedabad',
    state: 'Gujarat',
    source: 'website',
    system_kw: 5,
    rooftop_area: 500,
    monthly_bill: 3000,
    status: 'new',
    assigned_to: null,
    notes: 'Interested in residential setup',
    lead_score: 65,
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 40000000).toISOString(),
    name: 'Priya Patel',
    phone: '9123456780',
    email: 'priya.p@example.com',
    address: '45 Green Park',
    city: 'Surat',
    state: 'Gujarat',
    source: 'whatsapp',
    system_kw: 3,
    rooftop_area: 300,
    monthly_bill: 1500,
    status: 'contacted',
    assigned_to: 'user-1',
    notes: 'Needs financing options',
    lead_score: 45,
  },
];

const mockWebLeads: WebLead[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '9988776655',
    service: 'Residential Solar',
    message: 'I want to know the cost for a 4kW system.',
    status: 'unread',
    dismiss_reason: null,
    converted_lead_id: null,
  }
];

export const LeadsService = {
  // Leads
  async getLeads(): Promise<Lead[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...mockLeads];
  },

  async addLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'lead_score'>): Promise<Lead> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const newLead: Lead = {
      ...lead,
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lead_score: 0,
    };
    mockLeads.push(newLead);
    return newLead;
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const lead = mockLeads.find((l) => l.id === id);
    if (!lead) throw new Error('Lead not found');
    lead.status = status;
    lead.updated_at = new Date().toISOString();
    return lead;
  },

  // Web Leads
  async getWebLeads(): Promise<WebLead[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...mockWebLeads];
  },
};
