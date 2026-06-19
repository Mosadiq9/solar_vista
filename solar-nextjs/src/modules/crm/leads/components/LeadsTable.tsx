'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { Lead } from '../types';
import { format } from 'date-fns';
import { useLeadsStore } from '../store/useLeadsStore';
import { Users, MoreHorizontal } from 'lucide-react';
import { LeadStatusBadge } from '@/modules/admin/shared/components/ui';

export function LeadsTable() {
  const { leads, isLoading } = useLeadsStore();

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Lead Name',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90">{row.original.name}</div>
            <div className="text-2xs text-white/50">{row.original.email || 'No email'}</div>
          </div>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Contact',
        cell: ({ getValue }) => <div className="text-sm font-mono text-white/70">{getValue<string>()}</div>,
      },
      {
        accessorKey: 'city',
        header: 'Location',
        cell: ({ row }) => (
          <div className="text-sm text-white/70">
            {row.original.city ? `${row.original.city}, ${row.original.state}` : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'system_kw',
        header: 'Requirement',
        cell: ({ getValue }) => {
          const val = getValue<number | null>();
          return val ? <span className="text-white/80 font-medium">{val} KW</span> : <span className="text-white/30">-</span>;
        },
      },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ getValue }) => (
          <span className="capitalize text-white/60 text-xs px-2 py-1 bg-white/[0.03] rounded-md border border-white/[0.05]">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <LeadStatusBadge status={getValue<Lead['status']>()} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created On',
        cell: ({ getValue }) => (
          <div className="text-xs text-white/50">
            {format(new Date(getValue<string>()), 'dd MMM yyyy')}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          // Inside a cell component, we can use hooks if it was a separate component.
          // For simplicity, we just use the global store directly or a wrapper component.
          return <LeadActionCell lead={row.original} />;
        },
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={leads}
      isLoading={isLoading}
      emptyIcon={Users}
      emptyMessage="No leads found"
    />
  );
}

// Separate component to hook into Customers Store safely without breaking useMemo in LeadsTable
import { useCustomersStore } from '@/modules/crm/customers/store/useCustomersStore';

function LeadActionCell({ lead }: { lead: Lead }) {
  const { convertLeadToCustomer } = useCustomersStore();
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          if (confirm('Are you sure you want to convert this lead to a customer?')) {
            convertLeadToCustomer(lead.id, {
              name: lead.name,
              phone: lead.phone,
              email: lead.email,
              address: lead.address || '',
              city: lead.city || '',
              state: lead.state || '',
              system_kw: lead.system_kw || 0,
            });
          }
        }}
        className="px-3 py-1.5 text-xs font-medium bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-md transition-colors"
      >
        Convert
      </button>
      <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
