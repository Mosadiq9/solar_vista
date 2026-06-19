import { create } from 'zustand';
import { Customer } from '../types';
import { CustomersService } from '../services/customers.service';
import { toast } from 'sonner';

interface CustomersState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;

  fetchCustomers: () => Promise<void>;
  convertLeadToCustomer: (leadId: string, data: Partial<Customer>) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await CustomersService.getCustomers();
      set({ customers, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch customers');
    }
  },

  convertLeadToCustomer: async (leadId, data) => {
    try {
      const newCustomer = await CustomersService.convertLeadToCustomer(leadId, data);
      set((state) => ({ customers: [newCustomer, ...state.customers] }));
      toast.success('Lead successfully converted to Customer!');
    } catch (err: any) {
      toast.error('Failed to convert lead');
      throw err;
    }
  },
}));
