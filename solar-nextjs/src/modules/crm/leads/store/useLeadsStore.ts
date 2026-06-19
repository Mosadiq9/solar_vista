import { create } from 'zustand';
import { Lead, WebLead } from '../types';
import { LeadsService } from '../services/leads.service';
import { toast } from 'sonner';

interface LeadsState {
  leads: Lead[];
  webLeads: WebLead[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLeads: () => Promise<void>;
  fetchWebLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'lead_score'>) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  webLeads: [],
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const leads = await LeadsService.getLeads();
      set({ leads, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch leads');
    }
  },

  fetchWebLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const webLeads = await LeadsService.getWebLeads();
      set({ webLeads, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch web leads');
    }
  },

  addLead: async (leadData) => {
    try {
      const newLead = await LeadsService.addLead(leadData);
      set((state) => ({ leads: [newLead, ...state.leads] }));
      toast.success('Lead created successfully');
    } catch (err: any) {
      toast.error('Failed to create lead');
      throw err;
    }
  },

  updateLeadStatus: async (id, status) => {
    try {
      const updatedLead = await LeadsService.updateLeadStatus(id, status);
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? updatedLead : l)),
      }));
      toast.success(`Status updated to ${status}`);
    } catch (err: any) {
      toast.error('Failed to update status');
      throw err;
    }
  },
}));
