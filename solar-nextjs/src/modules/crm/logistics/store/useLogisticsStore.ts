import { create } from 'zustand';
import { InventoryItem, WiringItem, FleetVehicle } from '../types';
import { LogisticsService } from '../services/logistics.service';
import { toast } from 'sonner';

interface LogisticsState {
  inventory: InventoryItem[];
  wiring: WiringItem[];
  fleet: FleetVehicle[];
  isLoading: boolean;
  error: string | null;

  fetchInventory: () => Promise<void>;
  fetchWiring: () => Promise<void>;
  fetchFleet: () => Promise<void>;
}

export const useLogisticsStore = create<LogisticsState>((set) => ({
  inventory: [],
  wiring: [],
  fleet: [],
  isLoading: false,
  error: null,

  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    try {
      const inventory = await LogisticsService.getInventory();
      set({ inventory, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch master inventory');
    }
  },

  fetchWiring: async () => {
    set({ isLoading: true, error: null });
    try {
      const wiring = await LogisticsService.getWiring();
      set({ wiring, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch wiring stock');
    }
  },

  fetchFleet: async () => {
    set({ isLoading: true, error: null });
    try {
      const fleet = await LogisticsService.getFleet();
      set({ fleet, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Failed to fetch fleet data');
    }
  },
}));
