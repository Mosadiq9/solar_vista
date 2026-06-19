export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface PortfolioItem {
  id: string;
  customer_id: string;
  customer_name: string;
  installation_date: string;
  system_kw: number;
  panel_type: string;
  inverter_type: string;
  city: string;
  status: 'active' | 'decommissioned';
  warranty_expiry: string;
}

export interface MaintenanceTask {
  id: string;
  portfolio_id: string;
  customer_name: string;
  scheduled_date: string;
  task_type: 'cleaning' | 'inspection' | 'repair';
  status: MaintenanceStatus;
  assigned_technician: string | null;
  notes: string | null;
}

export interface SupportTicket {
  id: string;
  created_at: string;
  portfolio_id: string;
  customer_name: string;
  issue_title: string;
  issue_description: string;
  priority: TicketPriority;
  status: TicketStatus;
  resolution_notes: string | null;
}
