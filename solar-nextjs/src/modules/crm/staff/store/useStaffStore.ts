import { create } from 'zustand';
import { StaffProfile } from '../types';
import { StaffService } from '../services/staff.service';
import { toast } from 'sonner';

interface StaffState {
  staff: StaffProfile[];
  isLoading: boolean;
  error: string | null;

  fetchStaff: () => Promise<void>;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [],
  isLoading: false,
  error: null,

  fetchStaff: async () => {
    set({ isLoading: true, error: null });
    try {
      const staff = await StaffService.getStaff();
      set({ staff, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch staff directory');
    }
  },
}));
