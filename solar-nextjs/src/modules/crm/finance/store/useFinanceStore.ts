import { create } from 'zustand';
import { CommissionRecord, CostAnalysis } from '../types';
import { FinanceService } from '../services/finance.service';
import { toast } from 'sonner';

interface FinanceState {
  commissions: CommissionRecord[];
  costAnalysis: CostAnalysis[];
  isLoading: boolean;
  error: string | null;

  fetchCommissions: () => Promise<void>;
  fetchCostAnalysis: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  commissions: [],
  costAnalysis: [],
  isLoading: false,
  error: null,

  fetchCommissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const commissions = await FinanceService.getCommissions();
      set({ commissions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch commissions');
    }
  },

  fetchCostAnalysis: async () => {
    set({ isLoading: true, error: null });
    try {
      const costAnalysis = await FinanceService.getCostAnalysis();
      set({ costAnalysis, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch cost analysis data');
    }
  },
}));
