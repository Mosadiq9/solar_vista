'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { SupportTicket } from '../types';
import { useSupportStore } from '../store/useSupportStore';
import { HelpCircle, MoreHorizontal, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function TicketsTable() {
  const { tickets, isLoading } = useSupportStore();

  const columns = useMemo<ColumnDef<SupportTicket>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Ticket ID',
        cell: ({ getValue }) => <div className="text-xs font-mono text-brand-primary/80">#{getValue<string>().split('-')[1]}</div>,
      },
      {
        accessorKey: 'customer_name',
        header: 'Customer',
        cell: ({ getValue }) => <div className="font-medium text-white/90">{getValue<string>()}</div>,
      },
      {
        accessorKey: 'issue_title',
        header: 'Issue Details',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90 mb-0.5">{row.original.issue_title}</div>
            <div className="text-2xs text-white/50 max-w-[250px] truncate">{row.original.issue_description}</div>
          </div>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ getValue }) => {
          const priority = getValue<string>();
          return (
            <span
              className={cn(
                'flex items-center gap-1.5 w-max capitalize text-xs px-2.5 py-1 rounded-md border font-medium',
                priority === 'low' && 'bg-white/5 text-white/60 border-white/10',
                priority === 'medium' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                priority === 'high' && 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                priority === 'critical' && 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
              )}
            >
              {priority === 'critical' && <AlertOctagon className="h-3 w-3" />}
              {priority}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              className={cn(
                'capitalize text-xs px-2.5 py-1 rounded-md border font-medium',
                status === 'open' && 'bg-red-500/10 text-red-400 border-red-500/20',
                status === 'in_progress' && 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                status === 'resolved' && 'bg-green-500/10 text-green-400 border-green-500/20',
                status === 'closed' && 'bg-white/5 text-white/40 border-white/10'
              )}
            >
              {status.replace('_', ' ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Opened At',
        cell: ({ getValue }) => (
          <div className="text-xs text-white/60 font-mono">
            {format(new Date(getValue<string>()), 'dd MMM, HH:mm')}
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
      data={tickets}
      isLoading={isLoading}
      emptyIcon={HelpCircle}
      emptyMessage="No support tickets found"
    />
  );
}
