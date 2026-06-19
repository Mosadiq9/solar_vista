'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { LeadsTable } from '@/modules/crm/leads/components/LeadsTable';
import { LeadsPipelineBoard } from '@/modules/crm/leads/components/LeadsPipelineBoard';
import { LeadFormDrawer } from '@/modules/crm/leads/components/LeadFormDrawer';
import { useLeadsStore } from '@/modules/crm/leads/store/useLeadsStore';
import { Plus, List, KanbanSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'table' | 'board';

export default function LeadsPage() {
  const { fetchLeads } = useLeadsStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <PageHeader title="Leads" description="Manage and track all inbound enquiries" />
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-white/[0.06] bg-brand-surface p-1">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                viewMode === 'table' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/40 hover:text-white/70'
              )}
            >
              <List className="mr-1.5 h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={cn(
                'flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                viewMode === 'board' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/40 hover:text-white/70'
              )}
            >
              <KanbanSquare className="mr-1.5 h-3.5 w-3.5" />
              Board
            </button>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-primary/90 shadow-glow"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === 'table' ? <LeadsTable /> : <LeadsPipelineBoard />}

      {/* Slide-out Form Drawer */}
      <LeadFormDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
