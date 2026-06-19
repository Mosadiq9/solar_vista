import { PortfolioItem, MaintenanceTask, SupportTicket } from '../types';

const mockPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    customer_id: 'c-99',
    customer_name: 'Vikram Singh',
    installation_date: new Date(Date.now() - 31536000000).toISOString(), // ~1 year ago
    system_kw: 15,
    panel_type: 'Monocrystalline 540W',
    inverter_type: 'Growatt 15kW 3-Phase',
    city: 'Rajkot',
    status: 'active',
    warranty_expiry: new Date(Date.now() + 126144000000).toISOString(), // ~4 years from now
  }
];

const mockMaintenance: MaintenanceTask[] = [
  {
    id: 'mt-1',
    portfolio_id: 'port-1',
    customer_name: 'Vikram Singh',
    scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    task_type: 'cleaning',
    status: 'scheduled',
    assigned_technician: 'Raju Bhai',
    notes: 'Standard quarterly panel cleaning',
  }
];

const mockTickets: SupportTicket[] = [
  {
    id: 'tkt-1',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    portfolio_id: 'port-1',
    customer_name: 'Vikram Singh',
    issue_title: 'Inverter showing Error Code 102',
    issue_description: 'Grid voltage high error, inverter tripping frequently in the afternoon.',
    priority: 'high',
    status: 'open',
    resolution_notes: null,
  }
];

export const SupportService = {
  async getPortfolio(): Promise<PortfolioItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockPortfolio];
  },
  
  async getMaintenance(): Promise<MaintenanceTask[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...mockMaintenance];
  },

  async getTickets(): Promise<SupportTicket[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockTickets];
  }
};
