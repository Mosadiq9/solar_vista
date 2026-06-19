import { create } from 'zustand';
import { ProjectStage, FinalStageChecklist } from '../types';
import { LifecycleService } from '../services/lifecycle.service';
import { toast } from 'sonner';

interface LifecycleState {
  stages: Record<string, ProjectStage[]>; // Map stage_name -> array of stages
  isLoading: boolean;
  error: string | null;

  fetchStages: (stageName: string) => Promise<void>;
  updateStageStatus: (id: string, stageName: string, status: ProjectStage['status']) => Promise<void>;
}

export const useLifecycleStore = create<LifecycleState>((set, get) => ({
  stages: {},
  isLoading: false,
  error: null,

  fetchStages: async (stageName: string) => {
    set({ isLoading: true, error: null });
    try {
      const stageData = await LifecycleService.getStagesByName(stageName);
      set((state) => ({
        stages: {
          ...state.stages,
          [stageName]: stageData,
        },
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error(`Failed to fetch ${stageName} stages`);
    }
  },

  updateStageStatus: async (id, stageName, status) => {
    try {
      const updatedStage = await LifecycleService.updateStageStatus(id, status);
      set((state) => ({
        stages: {
          ...state.stages,
          [stageName]: (state.stages[stageName] || []).map((s) => (s.id === id ? updatedStage : s)),
        },
      }));
      toast.success(`Stage marked as ${status.replace('_', ' ')}`);
      
      // If completed, maybe re-fetch or rely on the UI to pull next stage if needed
    } catch (err: any) {
      toast.error('Failed to update stage');
      throw err;
    }
  },

  toggleChecklist: async (customerId: string, field: keyof FinalStageChecklist) => {
    // Optimistic UI for toggling checklist fields on the final stage
    toast.success(`Updated checklist for project`);
  }
}));
