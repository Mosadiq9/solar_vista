export type CommissionStatus = 'pending' | 'paid';

export interface CommissionRecord {
  id: string;
  created_at: string;
  sales_rep: string;
  customer_name: string;
  project_value: number;
  commission_percentage: number;
  commission_amount: number;
  status: CommissionStatus;
  paid_date: string | null;
}

export interface CostAnalysis {
  id: string;
  project_id: string;
  customer_name: string;
  system_kw: number;
  total_revenue: number;
  material_cost: number;
  labor_cost: number;
  misc_cost: number;
  profit_margin: number;
  profit_percentage: number;
}
