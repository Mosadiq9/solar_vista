'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { WebLead } from '../types';
import { format } from 'date-fns';
import { useLeadsStore } from '../store/useLeadsStore';
import { Globe, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WebLeadsTable() {
  const { webLeads, isLoading } = useLeadsStore();

  const columns = useMemo<ColumnDef<WebLead>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Contact Name',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90">{row.original.name}</div>
            <div className="text-2xs text-white/50">{row.original.email}</div>
          </div>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue }) => <div className="text-sm font-mono text-white/70">{getValue<string>() || '-'}</div>,
      },
      {
        accessorKey: 'service',
        header: 'Service Interested',
        cell: ({ getValue }) => <div className="text-sm text-white/70">{getValue<string>() || 'General Inquiry'}</div>,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ getValue }) => (
          <div className="text-sm text-white/50 truncate max-w-[250px]" title={getValue<string>()}>
            {getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              className={cn(
                'capitalize text-xs px-2 py-1 rounded-md border',
                status === 'unread' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                status === 'read' && 'bg-white/5 text-white/60 border-white/10',
                status === 'contacted' && 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                status === 'converted' && 'bg-green-500/10 text-green-400 border-green-500/20',
                status === 'dismissed' && 'bg-red-500/10 text-red-400 border-red-500/20'
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Received On',
        cell: ({ getValue }) => (
          <div className="text-xs text-white/50">
            {format(new Date(getValue<string>()), 'dd MMM yyyy HH:mm')}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: () => (
          <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={webLeads}
      isLoading={isLoading}
      emptyIcon={Globe}
      emptyMessage="No web leads yet"
    />
  );
}
