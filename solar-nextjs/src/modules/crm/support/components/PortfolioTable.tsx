'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { PortfolioItem } from '../types';
import { useSupportStore } from '../store/useSupportStore';
import { Star, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function PortfolioTable() {
  const { portfolio, isLoading } = useSupportStore();

  const columns = useMemo<ColumnDef<PortfolioItem>[]>(
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
        header: 'System Details',
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-brand-primary">{row.original.system_kw} KW System</div>
            <div className="text-2xs text-white/50 max-w-[180px] truncate">
              {row.original.panel_type} &bull; {row.original.inverter_type}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'installation_date',
        header: 'Installation Date',
        cell: ({ getValue }) => <div className="text-sm text-white/70">{format(new Date(getValue<string>()), 'MMM dd, yyyy')}</div>,
      },
      {
        accessorKey: 'warranty_expiry',
        header: 'Warranty Status',
        cell: ({ getValue }) => {
          const expiryDate = new Date(getValue<string>());
          const isExpired = expiryDate.getTime() < Date.now();
          
          return (
            <div className="flex flex-col gap-1">
              <span className={cn(
                'flex w-max items-center gap-1 text-xs px-2 py-0.5 rounded border font-medium',
                isExpired ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
              )}>
                <ShieldCheck className="h-3 w-3" />
                {isExpired ? 'Expired' : 'Active'}
              </span>
              <span className="text-2xs text-white/40 font-mono">Until {format(expiryDate, 'MM/yyyy')}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full capitalize',
              status === 'active' ? 'bg-white/5 text-white/70' : 'bg-red-500/10 text-red-400'
            )}>
              {status}
            </span>
          );
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
      data={portfolio}
      isLoading={isLoading}
      emptyIcon={Star}
      emptyMessage="No completed projects found in portfolio"
    />
  );
}
