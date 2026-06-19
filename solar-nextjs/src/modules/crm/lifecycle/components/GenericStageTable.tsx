'use client';

import { useEffect, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { ProjectStage } from '../types';
import { format } from 'date-fns';
import { useLifecycleStore } from '../store/useLifecycleStore';
import { CheckCircle, AlertCircle, PlayCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenericStageTableProps {
  stageName: string;
  emptyMessage: string;
  icon: React.ElementType;
}

export function GenericStageTable({ stageName, emptyMessage, icon }: GenericStageTableProps) {
  const { stages, isLoading, fetchStages, updateStageStatus } = useLifecycleStore();

  useEffect(() => {
    fetchStages(stageName);
  }, [fetchStages, stageName]);

  const currentStages = stages[stageName] || [];

  const columns = useMemo<ColumnDef<ProjectStage>[]>(
    () => [
      {
        accessorKey: 'customer_name',
        header: 'Customer Details',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90">{row.original.customer_name}</div>
            <div className="text-2xs text-white/50">{row.original.city}</div>
          </div>
        ),
      },
      {
        accessorKey: 'system_kw',
        header: 'System',
        cell: ({ getValue }) => <div className="text-sm font-semibold text-brand-primary">{getValue<number>()} KW</div>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              className={cn(
                'flex w-max items-center gap-1.5 capitalize text-xs px-2.5 py-1 rounded-md border',
                status === 'pending' && 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                status === 'in_progress' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                status === 'completed' && 'bg-green-500/10 text-green-400 border-green-500/20'
              )}
            >
              {status === 'pending' && <AlertCircle className="h-3 w-3" />}
              {status === 'in_progress' && <Loader2 className="h-3 w-3 animate-spin" />}
              {status === 'completed' && <CheckCircle className="h-3 w-3" />}
              {status.replace('_', ' ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'notes',
        header: 'Stage Notes',
        cell: ({ getValue }) => (
          <div className="text-sm text-white/60 truncate max-w-[250px]" title={getValue<string>() || ''}>
            {getValue<string>() || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'started_at',
        header: 'Start Date',
        cell: ({ getValue }) => {
          const val = getValue<string | null>();
          return <div className="text-xs text-white/50 font-mono">{val ? format(new Date(val), 'dd MMM yyyy') : '-'}</div>;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const status = row.original.status;
          const isPending = status === 'pending';
          const isInProgress = status === 'in_progress';
          const isCompleted = status === 'completed';

          return (
            <div className="flex items-center gap-2">
              {isPending && (
                <button
                  onClick={() => updateStageStatus(row.original.id, stageName, 'in_progress')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  Start
                </button>
              )}
              {isInProgress && (
                <button
                  onClick={() => updateStageStatus(row.original.id, stageName, 'completed')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Complete
                </button>
              )}
              {isCompleted && (
                <span className="text-xs text-white/30 px-3 py-1.5 font-medium">Done</span>
              )}
            </div>
          );
        },
      },
    ],
    [updateStageStatus, stageName]
  );

  return (
    <DataTable
      columns={columns}
      data={currentStages}
      isLoading={isLoading}
      emptyIcon={icon}
      emptyMessage={emptyMessage}
    />
  );
}
