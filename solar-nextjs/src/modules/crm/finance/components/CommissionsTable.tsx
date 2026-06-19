'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { CommissionRecord } from '../types';
import { useFinanceStore } from '../store/useFinanceStore';
import { Banknote, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function CommissionsTable() {
  const { commissions, isLoading } = useFinanceStore();

  const columns = useMemo<ColumnDef<CommissionRecord>[]>(
    () => [
      {
        accessorKey: 'sales_rep',
        header: 'Sales Representative',
        cell: ({ getValue }) => <div className="font-medium text-white/90">{getValue<string>()}</div>,
      },
      {
        accessorKey: 'customer_name',
        header: 'Project Customer',
        cell: ({ getValue }) => <div className="text-sm text-white/70">{getValue<string>()}</div>,
      },
      {
        accessorKey: 'project_value',
        header: 'Project Value',
        cell: ({ getValue }) => <div className="text-sm font-mono text-white/60">₹{getValue<number>().toLocaleString('en-IN')}</div>,
      },
      {
        accessorKey: 'commission_amount',
        header: 'Commission Amount',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-bold text-brand-primary">₹{row.original.commission_amount.toLocaleString('en-IN')}</div>
            <div className="text-2xs text-brand-primary/50">{row.original.commission_percentage}% rate</div>
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
                'capitalize text-xs px-2.5 py-1 rounded-md border font-medium',
                status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'paid_date',
        header: 'Paid Date',
        cell: ({ getValue }) => {
          const val = getValue<string | null>();
          return <div className="text-xs text-white/50">{val ? format(new Date(val), 'dd MMM yyyy') : '-'}</div>;
        },
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
      data={commissions}
      isLoading={isLoading}
      emptyIcon={Banknote}
      emptyMessage="No commission records found"
    />
  );
}
