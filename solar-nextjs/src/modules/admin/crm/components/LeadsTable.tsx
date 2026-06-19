'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Phone, Mail, ExternalLink } from 'lucide-react';
import { DataTable, type Column } from '@/modules/admin/shared/components/tables/DataTable';
import { TablePagination } from '@/modules/admin/shared/components/tables/TablePagination';
import { LeadStatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import { LeadScoreIndicator } from './LeadScoreIndicator';
import { EmptyState } from '@/modules/admin/shared/components/ui/EmptyState';
import { useLeads } from '@/modules/admin/crm/hooks/useLeads';
import { buildWhatsAppUrl } from '@/lib/utils';
import { Users } from 'lucide-react';
import type { AdminLead } from '@/modules/admin/types';

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const SOURCE_LABELS: Record<AdminLead['source'], string> = {
  website: 'Website',
  chatbot: 'Chatbot',
  whatsapp: 'WhatsApp',
  referral: 'Referral',
  manual: 'Manual',
};

export function LeadsTable() {
  const router = useRouter();
  const { leads, filters, pagination, setFilters } = useLeads();

  const columns: Column<AdminLead>[] = [
    {
      key: 'name',
      header: 'Lead',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-semibold text-brand-primary">
            {row.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white/85">{row.name}</p>
            <p className="truncate text-xs text-white/35">{row.city}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <LeadStatusBadge status={row.status} />,
    },
    {
      key: 'source',
      header: 'Source',
      render: (row) => <span className="text-xs text-white/50">{SOURCE_LABELS[row.source]}</span>,
    },
    {
      key: 'monthlyBill',
      header: 'Bill / mo',
      render: (row) => (
        <span className="text-xs text-white/60">₹{row.monthlyBill.replace('-', '–')}</span>
      ),
    },
    {
      key: 'leadScore',
      header: 'Score',
      sortable: true,
      render: (row) => <LeadScoreIndicator score={row.leadScore} size="sm" />,
    },
    {
      key: 'createdAt',
      header: 'Added',
      sortable: true,
      render: (row) => <span className="text-xs text-white/35">{timeAgo(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <a
            href={`tel:${row.phone}`}
            className="hover:bg-white/8 flex h-6 w-6 items-center justify-center rounded text-white/25 transition-colors hover:text-white/60"
            title="Call"
          >
            <Phone className="h-3 w-3" />
          </a>
          <a
            href={buildWhatsAppUrl(
              row.phone,
              `Hi ${row.name.split(' ')[0]}, following up on your solar inquiry.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-white/8 flex h-6 w-6 items-center justify-center rounded text-white/25 transition-colors hover:text-brand-accent"
            title="WhatsApp"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-brand-surface-2">
      <DataTable
        columns={columns}
        data={leads}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/crm/${row.id}`)}
        emptyState={
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No leads found"
            description="Try adjusting your filters or add a lead manually."
          />
        }
      />
      <div className="border-t border-white/[0.04]">
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onPageChange={(p) => setFilters({ page: p })}
          onPageSizeChange={(s) => setFilters({ pageSize: s, page: 1 })}
        />
      </div>
    </div>
  );
}
