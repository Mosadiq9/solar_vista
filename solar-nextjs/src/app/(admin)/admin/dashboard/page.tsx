'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import { useLeadsStore } from '@/modules/crm/leads/store/useLeadsStore';
import { useAuthStore } from '@/modules/crm/auth/store/useAuthStore';
import { useSupportStore } from '@/modules/crm/support/store/useSupportStore';
import { Users, Zap, Briefcase, HelpCircle } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser } = useAuthStore();
  const { leads, fetchLeads } = useLeadsStore();
  const { tickets, fetchTickets, portfolio, fetchPortfolio } = useSupportStore();

  useEffect(() => {
    fetchLeads();
    fetchTickets();
    fetchPortfolio();
  }, [fetchLeads, fetchTickets, fetchPortfolio]);

  const activeLeadsCount = leads.length;
  const activeProjectsCount = portfolio.filter(p => p.status === 'active').length;
  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Welcome back, ${currentUser?.full_name.split(' ')[0] || 'Admin'}! 👋`} 
        description="Here is what's happening with your solar operations today." 
      />

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard className="p-4 flex items-center gap-4 hover:border-brand-primary/30 transition-colors cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-2xs font-semibold text-white/40 uppercase tracking-wider mb-0.5">Active Leads</p>
            <p className="text-2xl font-bold text-white">{activeLeadsCount}</p>
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex items-center gap-4 hover:border-brand-primary/30 transition-colors cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <p className="text-2xs font-semibold text-white/40 uppercase tracking-wider mb-0.5">In Pipeline</p>
            <p className="text-2xl font-bold text-white">12</p>
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex items-center gap-4 hover:border-brand-primary/30 transition-colors cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
            <Zap className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-2xs font-semibold text-white/40 uppercase tracking-wider mb-0.5">Active Portfolio</p>
            <p className="text-2xl font-bold text-white">{activeProjectsCount}</p>
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex items-center gap-4 hover:border-brand-primary/30 transition-colors cursor-pointer">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <HelpCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-2xs font-semibold text-white/40 uppercase tracking-wider mb-0.5">Open Tickets</p>
            <p className="text-2xl font-bold text-white">{openTicketsCount}</p>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Chart Area */}
        <AdminCard className="p-5 min-h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/90 mb-4">Revenue Overview</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
            <p className="text-sm text-white/30">Revenue Chart Visualization Area</p>
          </div>
        </AdminCard>

        {/* Mock Activity Feed */}
        <AdminCard className="p-5 min-h-[300px] flex flex-col">
          <h3 className="text-sm font-semibold text-white/90 mb-4">Recent Activity</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
            <p className="text-sm text-white/30">Activity Feed Timeline Area</p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
