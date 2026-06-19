import { CommissionRecord, CostAnalysis } from '../types';

const mockCommissions: CommissionRecord[] = [
  {
    id: 'comm-1',
    created_at: new Date(Date.now() - 100000000).toISOString(),
    sales_rep: 'Sales Rep (u-2)',
    customer_name: 'Vikram Singh',
    project_value: 450000,
    commission_percentage: 2,
    commission_amount: 9000,
    status: 'paid',
    paid_date: new Date(Date.now() - 50000000).toISOString(),
  },
  {
    id: 'comm-2',
    created_at: new Date(Date.now() - 5000000).toISOString(),
    sales_rep: 'Sales Rep (u-2)',
    customer_name: 'Anjali Desai',
    project_value: 120000,
    commission_percentage: 2.5,
    commission_amount: 3000,
    status: 'pending',
    paid_date: null,
  }
];

const mockCostAnalysis: CostAnalysis[] = [
  {
    id: 'cost-1',
    project_id: 'port-1',
    customer_name: 'Vikram Singh',
    system_kw: 15,
    total_revenue: 450000,
    material_cost: 320000,
    labor_cost: 25000,
    misc_cost: 15000,
    profit_margin: 90000,
    profit_percentage: 20,
  }
];

export const FinanceService = {
  async getCommissions(): Promise<CommissionRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockCommissions];
  },
  
  async getCostAnalysis(): Promise<CostAnalysis[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...mockCostAnalysis];
  }
};
