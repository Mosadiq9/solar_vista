import { ProjectStage } from '../types';

const mockStages: ProjectStage[] = [
  {
    id: 's-1',
    created_at: new Date(Date.now() - 400000).toISOString(),
    customer_id: 'c-1',
    stage_name: 'registration',
    status: 'in_progress',
    started_at: new Date(Date.now() - 400000).toISOString(),
    completed_at: null,
    notes: 'Awaiting DISCOM approval',
    customer_name: 'Suresh Kumar',
    system_kw: 10,
    city: 'Gandhinagar',
  },
  {
    id: 's-2',
    created_at: new Date(Date.now() - 800000).toISOString(),
    customer_id: 'c-2',
    stage_name: 'kit_ready',
    status: 'pending',
    started_at: null,
    completed_at: null,
    notes: 'Waiting for Monocrystalline panels from warehouse',
    customer_name: 'Ramesh Patel',
    system_kw: 5,
    city: 'Ahmedabad',
  },
  {
    id: 's-3',
    created_at: new Date(Date.now() - 1000000).toISOString(),
    customer_id: 'c-3',
    stage_name: 'fabrication',
    status: 'in_progress',
    started_at: new Date(Date.now() - 200000).toISOString(),
    completed_at: null,
    notes: 'Structure being built on site',
    customer_name: 'Anjali Desai',
    system_kw: 3,
    city: 'Surat',
  }
];

export const LifecycleService = {
  async getStagesByName(stageName: string): Promise<ProjectStage[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockStages.filter(s => s.stage_name === stageName);
  },

  async updateStageStatus(id: string, status: ProjectStage['status']): Promise<ProjectStage> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const stage = mockStages.find(s => s.id === id);
    if (!stage) throw new Error('Stage not found');
    
    stage.status = status;
    if (status === 'completed') {
      stage.completed_at = new Date().toISOString();
      // In a real RPC, completing a stage would generate the next stage automatically.
      const stagesFlow = ['registration', 'kit_ready', 'dispatch', 'fabrication', 'wiring', 'final_stage', 'completed'];
      const currentIndex = stagesFlow.indexOf(stage.stage_name);
      if (currentIndex !== -1 && currentIndex < stagesFlow.length - 1) {
        mockStages.push({
          id: Math.random().toString(36).substring(7),
          created_at: new Date().toISOString(),
          customer_id: stage.customer_id,
          stage_name: stagesFlow[currentIndex + 1],
          status: 'pending',
          started_at: new Date().toISOString(),
          completed_at: null,
          notes: null,
          customer_name: stage.customer_name,
          system_kw: stage.system_kw,
          city: stage.city,
        });
      }
    } else if (status === 'in_progress') {
      stage.started_at = new Date().toISOString();
    }
    
    return stage;
  }
};
