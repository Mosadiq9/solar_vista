import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import type {
  AdminLead,
  AdminRole,
  LeadFilters,
  LeadNote,
  LeadStatus,
  DashboardStats,
  BlogCMS,
  ProjectCMS,
} from '../types';

// ── Default filters ────────────────────────────────────────────────────────────
const DEFAULT_FILTERS: LeadFilters = {
  search: '',
  status: 'all',
  source: 'all',
  city: '',
  sortBy: 'createdAt_desc',
  page: 1,
  pageSize: 20,
};

// ── Store shape ────────────────────────────────────────────────────────────────
interface AdminStore {
  // State
  leads: AdminLead[];
  filteredLeads: AdminLead[];
  selectedLead: AdminLead | null;
  filters: LeadFilters;
  stats: DashboardStats;
  sidebarCollapsed: boolean;
  activeModal: string | null;

  // Actions
  fetchLeads: () => Promise<void>;
  setFilters: (f: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  selectLead: (id: string | null) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  addNote: (leadId: string, content: string, authorName: string) => Promise<void>;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

// ── Filtered lead computation ──────────────────────────────────────────────────
function applyFilters(leads: AdminLead[], filters: LeadFilters): AdminLead[] {
  let result = [...leads];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
    );
  }

  if (filters.status !== 'all') result = result.filter((l) => l.status === filters.status);
  if (filters.source !== 'all') result = result.filter((l) => l.source === filters.source);
  if (filters.city)
    result = result.filter((l) => l.city.toLowerCase().includes(filters.city.toLowerCase()));

  switch (filters.sortBy) {
    case 'createdAt_asc':
      result.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case 'createdAt_desc':
      result.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'leadScore_desc':
      result.sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0));
      break;
    case 'name_asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

export const useAdminStore = create<AdminStore>()(
  devtools(
    (set, get) => ({
      leads: [],
      filteredLeads: [],
      selectedLead: null,
      filters: DEFAULT_FILTERS,
      stats: {
        totalLeads: 0,
        newLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        activeProjects: 0,
        totalRevenue: 0,
        chatbotSessions: 0,
        pendingFollowUps: 0,
      },
      sidebarCollapsed: false,
      activeModal: null,

      fetchLeads: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from(DB_TABLES.LEADS)
          .select(`*, crm_activities: ${DB_TABLES.CRM_ACTIVITIES} (*)`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mappedLeads = data.map((l: any) => ({
            id: l.id,
            name: l.name,
            phone: l.phone || '',
            email: l.email || '',
            city: l.metadata?.city || '',
            monthlyBill: l.metadata?.monthlyBill || '',
            status: l.status,
            source: l.source,
            leadScore: l.metadata?.leadScore || 50,
            notes: (l.crm_activities || []).map((n: any) => ({
              id: n.id,
              authorName: 'Staff Member',
              authorRole: 'admin' as const,
              content: n.notes,
              createdAt: new Date(n.created_at).getTime(),
            })),
            createdAt: new Date(l.created_at).getTime(),
            updatedAt: new Date(l.updated_at).getTime(),
          }));

          // Calculate counts
          const totalLeads = mappedLeads.length;
          const newLeads = mappedLeads.filter((l) => l.status === 'new').length;
          const convertedLeads = mappedLeads.filter((l) => l.status === 'converted').length;
          const conversionRate =
            totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

          set({
            leads: mappedLeads,
            filteredLeads: applyFilters(mappedLeads, get().filters),
            stats: {
              totalLeads,
              newLeads,
              convertedLeads,
              conversionRate,
              activeProjects: 0,
              totalRevenue: 0,
              chatbotSessions: 0,
              pendingFollowUps: 0,
            },
          });
        }
      },

      setFilters: (f) => {
        const filters = { ...get().filters, ...f, page: 1 };
        set({ filters, filteredLeads: applyFilters(get().leads, filters) });
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS, filteredLeads: get().leads });
      },

      selectLead: (id) => {
        const lead = id ? (get().leads.find((l) => l.id === id) ?? null) : null;
        set({ selectedLead: lead });
      },

      updateLeadStatus: async (id, status) => {
        const supabase = createClient();
        const { error } = await supabase
          .from(DB_TABLES.LEADS)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .update({ status: status as any, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (!error) {
          const leads = get().leads.map((l) =>
            l.id === id ? { ...l, status, updatedAt: Date.now() } : l
          );
          set({ leads, filteredLeads: applyFilters(leads, get().filters) });
          // Log status update note
          await get().addNote(id, `Status updated to ${status.replace('_', ' ')}`, 'System');
        }
      },

      addNote: async (leadId, content, authorName) => {
        const supabase = createClient();
        // Retrieve tenant_id associated with lead
        const leadObj = get().leads.find((l) => l.id === leadId);
        if (!leadObj) return;

        const { data: leadData } = await supabase
          .from(DB_TABLES.LEADS)
          .select('tenant_id')
          .eq('id', leadId)
          .single();

        if (leadData?.tenant_id) {
          const { data: newActivity, error } = await supabase
            .from(DB_TABLES.CRM_ACTIVITIES)
            .insert({
              tenant_id: leadData.tenant_id,
              lead_id: leadId,
              activity_type: 'note',
              notes: content,
            })
            .select('*')
            .single();

          if (!error && newActivity) {
            const note: LeadNote = {
              id: newActivity.id,
              authorName,
              authorRole: 'admin' as AdminRole,
              content: newActivity.notes ?? '',
              createdAt: new Date(newActivity.created_at).getTime(),
            };
            const leads = get().leads.map((l) =>
              l.id === leadId ? { ...l, notes: [note, ...l.notes] } : l
            );
            const selectedLead = leads.find((l) => l.id === leadId) ?? null;
            set({ leads, filteredLeads: applyFilters(leads, get().filters), selectedLead });
          }
        }
      },

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    { name: 'admin-store' }
  )
);
