export type SystemCategory = 'residential' | 'commercial' | 'industrial';
export type CustomerStatus = 'active' | 'installation_pending' | 'installation_complete';
export type LifecycleStage = 'registration' | 'kit_ready' | 'dispatch' | 'fabrication' | 'wiring' | 'final_stage' | 'completed';

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pin_code: string | null;
  system_category: SystemCategory;
  system_kw: number;
  panel_type: string | null;
  inverter_type: string | null;
  consumer_number: string | null;
  discom: string | null;
  source: string | null;
  referred_by: string | null;
  status: CustomerStatus;
  current_stage: LifecycleStage;
}
