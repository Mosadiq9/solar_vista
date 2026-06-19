'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { MaintenanceTask } from '../types';
import { useSupportStore } from '../store/useSupportStore';
import { Settings, MoreHorizontal, Calendar, Droplets, Wrench, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function MaintenanceTable() {
  const { maintenance, isLoading } = useSupportStore();

  const columns = useMemo<ColumnDef<MaintenanceTask>[]>(
    () => [
      {
        accessorKey: 'customer_name',
        header: 'Customer',
        cell: ({ getValue }) => <div className="font-medium text-white/90">{getValue<string>()}</div>,
      },
      {
        accessorKey: 'task_type',
        header: 'Task Type',
        cell: ({ getValue }) => {
          const type = getValue<string>();
          return (
            <div className="flex items-center gap-2 text-sm text-white/70">
              {type === 'cleaning' && <Droplets className="h-3.5 w-3.5 text-blue-400" />}
              {type === 'inspection' && <Search className="h-3.5 w-3.5 text-yellow-400" />}
              {type === 'repair' && <Wrench className="h-3.5 w-3.5 text-orange-400" />}
              <span className="capitalize">{type}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'scheduled_date',
        header: 'Scheduled Date',
        cell: ({ getValue }) => {
          const date = new Date(getValue<string>());
          const isPast = date.getTime() < Date.now();
          return (
            <div className={cn('flex items-center gap-2 text-sm', isPast ? 'text-red-400' : 'text-white/80')}>
              <Calendar className="h-3.5 w-3.5" />
              {format(date, 'dd MMM yyyy')}
            </div>
          );
        },
      },
      {
        accessorKey: 'assigned_technician',
        header: 'Technician',
        cell: ({ getValue }) => <div className="text-sm font-medium text-white/60">{getValue<string>() || 'Unassigned'}</div>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              className={cn(
                'capitalize text-xs px-2.5 py-1 rounded-md border font-medium w-max',
                status === 'scheduled' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                status === 'in_progress' && 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                status === 'completed' && 'bg-green-500/10 text-green-400 border-green-500/20'
              )}
            >
              {status.replace('_', ' ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
        cell: ({ getValue }) => (
          <div className="text-xs text-white/40 truncate max-w-[200px]" title={getValue<string>() || ''}>
            {getValue<string>() || '-'}
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
      data={maintenance}
      isLoading={isLoading}
      emptyIcon={Settings}
      emptyMessage="No maintenance tasks scheduled"
    />
  );
}
