import { create } from 'zustand';
import { PortfolioItem, MaintenanceTask, SupportTicket } from '../types';
import { SupportService } from '../services/support.service';
import { toast } from 'sonner';

interface SupportState {
  portfolio: PortfolioItem[];
  maintenance: MaintenanceTask[];
  tickets: SupportTicket[];
  isLoading: boolean;
  error: string | null;

  fetchPortfolio: () => Promise<void>;
  fetchMaintenance: () => Promise<void>;
  fetchTickets: () => Promise<void>;
}

export const useSupportStore = create<SupportState>((set) => ({
  portfolio: [],
  maintenance: [],
  tickets: [],
  isLoading: false,
  error: null,

  fetchPortfolio: async () => {
    set({ isLoading: true, error: null });
    try {
      const portfolio = await SupportService.getPortfolio();
      set({ portfolio, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch completed portfolio');
    }
  },

  fetchMaintenance: async () => {
    set({ isLoading: true, error: null });
    try {
      const maintenance = await SupportService.getMaintenance();
      set({ maintenance, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch maintenance tasks');
    }
  },

  fetchTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      const tickets = await SupportService.getTickets();
      set({ tickets, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch support tickets');
    }
  },
}));
