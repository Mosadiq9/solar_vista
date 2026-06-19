// ─────────────────────────────────────────────────────────────────────────────
// ENTERPRISE ADMIN & CRM TYPE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth & Roles ──────────────────────────────────────────────────────────────
export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'support';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarUrl?: string;
  createdAt: number;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

// ── CRM Lead Management ───────────────────────────────────────────────────────
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'converted'
  | 'closed';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal_sent: 'Proposal Sent',
  converted: 'Converted',
  closed: 'Closed',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#F5A623',
  contacted: '#3B82F6',
  qualified: '#8B5CF6',
  proposal_sent: '#06B6D4',
  converted: '#00E676',
  closed: '#4A5568',
};

export interface LeadNote {
  id: string;
  authorName: string;
  authorRole: AdminRole;
  content: string;
  createdAt: number;
}

export interface AdminLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  monthlyBill: string;
  message?: string;
  status: LeadStatus;
  source: 'website' | 'chatbot' | 'whatsapp' | 'referral' | 'manual';
  notes: LeadNote[];
  createdAt: number;
  updatedAt: number;
  assignedTo?: string;
  leadScore?: number; // AI scoring readiness (0-100)
  followUpAt?: number;
}

// ── Filters / Sorting ─────────────────────────────────────────────────────────
export type LeadSortKey = 'createdAt_desc' | 'createdAt_asc' | 'leadScore_desc' | 'name_asc';

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
  source: AdminLead['source'] | 'all';
  city: string;
  sortBy: LeadSortKey;
  page: number;
  pageSize: number;
}

// ── CMS Models ────────────────────────────────────────────────────────────────
export type CMSLocale = 'en' | 'hi' | 'gu';

export interface BlogCMS {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  locale: CMSLocale;
  published: boolean;
  featured: boolean;
  coverImage?: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  readTimeMinutes: number;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectCMS {
  id: string;
  title: string;
  city: string;
  state: string;
  propertyType: 'residential' | 'commercial' | 'industrial';
  systemSizeKw: number;
  annualSavingsInr: number;
  co2OffsetTons: number;
  featured: boolean;
  coverImage?: string;
  gallery?: string[];
  completedAt: number;
  createdAt: number;
}

export interface TestimonialCMS {
  id: string;
  customerName: string;
  city: string;
  systemSize: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  verified: boolean;
  featured: boolean;
  createdAt: number;
}

// ── Dashboard Metrics ─────────────────────────────────────────────────────────
export interface DashboardMetric {
  label: string;
  value: number | string;
  change: number; // % change vs previous period
  positive: boolean;
  icon: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  conversionRate: number;
  activeProjects: number;
  totalRevenue: number;
  chatbotSessions: number;
  pendingFollowUps: number;
}

// ── Table System ──────────────────────────────────────────────────────────────
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// ── Workflow Automation (Future-Ready) ────────────────────────────────────────
export type WorkflowTrigger = 'new_lead' | 'lead_status_changed' | 'survey_booked' | 'quote_sent';
export type WorkflowAction = 'send_whatsapp' | 'send_email' | 'assign_to_sales' | 'ai_score_lead';

export interface AdminWorkflow {
  id: string;
  name: string;
  triggerEvent: WorkflowTrigger;
  conditions: Record<string, unknown>;
  actions: WorkflowAction[];
  active: boolean;
  createdAt: number;
}
