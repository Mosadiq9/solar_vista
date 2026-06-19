'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { StaffProfile } from '../types';
import { useStaffStore } from '../store/useStaffStore';
import { Users, MoreHorizontal, ShieldAlert, Shield, ShieldCheck, HardHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function StaffTable() {
  const { staff, isLoading } = useStaffStore();

  const columns = useMemo<ColumnDef<StaffProfile>[]>(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Staff Member',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90">{row.original.full_name}</div>
            <div className="text-2xs text-white/50">{row.original.email}</div>
          </div>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue }) => <div className="text-sm font-mono text-white/70">{getValue<string>()}</div>,
      },
      {
        accessorKey: 'role',
        header: 'Role & Access',
        cell: ({ getValue }) => {
          const role = getValue<string>();
          return (
            <span
              className={cn(
                'flex w-max items-center gap-1.5 capitalize text-xs px-2.5 py-1 rounded-md border font-medium',
                role === 'super_admin' && 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                role === 'sales' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                role === 'logistics' && 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                role === 'installer' && 'bg-green-500/10 text-green-400 border-green-500/20'
              )}
            >
              {role === 'super_admin' && <ShieldAlert className="h-3 w-3" />}
              {role === 'sales' && <Shield className="h-3 w-3" />}
              {role === 'logistics' && <ShieldCheck className="h-3 w-3" />}
              {role === 'installer' && <HardHat className="h-3 w-3" />}
              {role.replace('_', ' ')}
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
            <span className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'last_login',
        header: 'Last Login',
        cell: ({ getValue }) => {
          const val = getValue<string | null>();
          return <div className="text-xs text-white/50">{val ? format(new Date(val), 'dd MMM yyyy, HH:mm') : 'Never'}</div>;
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
      data={staff}
      isLoading={isLoading}
      emptyIcon={Users}
      emptyMessage="No staff members found"
    />
  );
}
