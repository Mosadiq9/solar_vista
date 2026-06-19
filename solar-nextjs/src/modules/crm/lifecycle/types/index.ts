export type ProjectStageStatus = 'pending' | 'in_progress' | 'completed';

export interface ProjectStage {
  id: string;
  created_at: string;
  customer_id: string;
  stage_name: string; // 'registration' | 'kit_ready' | etc.
  status: ProjectStageStatus;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  
  // Joins
  customer_name?: string;
  system_kw?: number;
  city?: string;
}

export interface FinalStageChecklist {
  customer_id: string;
  is_approved: boolean;
  is_fill_dp: boolean;
  is_inspection: boolean;
  is_solder: boolean;
  is_submission: boolean;
}
