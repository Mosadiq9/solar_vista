'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { Customer } from '../types';
import { format } from 'date-fns';
import { useCustomersStore } from '../store/useCustomersStore';
import { Briefcase, MoreHorizontal } from 'lucide-react';
import { StatusBadge } from '@/modules/admin/shared/components/ui';

export function CustomersTable() {
  const { customers, isLoading } = useCustomersStore();

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Customer Details',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90">{row.original.name}</div>
            <div className="text-2xs text-white/50">{row.original.phone}</div>
          </div>
        ),
      },
      {
        accessorKey: 'address',
        header: 'Installation Address',
        cell: ({ row }) => (
          <div className="text-sm text-white/70">
            <div>{row.original.address}</div>
            <div className="text-2xs text-white/40">{row.original.city}, {row.original.state} {row.original.pin_code}</div>
          </div>
        ),
      },
      {
        accessorKey: 'system_kw',
        header: 'System Size',
        cell: ({ getValue }) => <div className="text-sm font-semibold text-brand-primary">{getValue<number>()} KW</div>,
      },
      {
        accessorKey: 'discom',
        header: 'DISCOM',
        cell: ({ row }) => (
          <div>
            <div className="text-sm text-white/70">{row.original.discom || '-'}</div>
            <div className="text-2xs font-mono text-white/40">{row.original.consumer_number || '-'}</div>
          </div>
        ),
      },
      {
        accessorKey: 'current_stage',
        header: 'Lifecycle Stage',
        cell: ({ getValue }) => (
          <span className="capitalize text-white/60 text-xs px-2 py-1 bg-brand-primary/10 rounded-md border border-brand-primary/20 text-brand-primary">
            {getValue<string>().replace('_', ' ')}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Account Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<Customer['status']>()} />,
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
      data={customers}
      isLoading={isLoading}
      emptyIcon={Briefcase}
      emptyMessage="No active customers"
    />
  );
}
