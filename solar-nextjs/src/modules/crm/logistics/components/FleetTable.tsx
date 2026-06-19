'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { FleetVehicle } from '../types';
import { useLogisticsStore } from '../store/useLogisticsStore';
import { Truck, MoreHorizontal, CheckCircle, Clock, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function FleetTable() {
  const { fleet, isLoading } = useLogisticsStore();

  const columns = useMemo<ColumnDef<FleetVehicle>[]>(
    () => [
      {
        accessorKey: 'vehicle_number',
        header: 'Vehicle',
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-white/90 font-mono bg-white/[0.03] border border-white/[0.08] rounded px-2 py-0.5 w-max">
              {row.original.vehicle_number}
            </div>
            <div className="text-xs text-white/50 mt-1">{row.original.model}</div>
          </div>
        ),
      },
      {
        accessorKey: 'assigned_driver',
        header: 'Assigned Driver',
        cell: ({ getValue }) => <div className="text-sm font-medium text-white/80">{getValue<string>() || 'Unassigned'}</div>,
      },
      {
        accessorKey: 'payload_capacity_kg',
        header: 'Payload Capacity',
        cell: ({ getValue }) => <div className="text-sm text-brand-primary font-medium">{getValue<number>()} kg</div>,
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
                status === 'available' && 'bg-green-500/10 text-green-400 border-green-500/20',
                status === 'in_transit' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                status === 'maintenance' && 'bg-orange-500/10 text-orange-400 border-orange-500/20'
              )}
            >
              {status === 'available' && <CheckCircle className="h-3 w-3" />}
              {status === 'in_transit' && <Clock className="h-3 w-3" />}
              {status === 'maintenance' && <Wrench className="h-3 w-3" />}
              {status.replace('_', ' ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'fitness_expiry',
        header: 'Fitness Expiry',
        cell: ({ getValue }) => {
          const date = new Date(getValue<string>());
          const isExpiringSoon = date.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000; // < 30 days
          return (
            <div className={cn('text-sm font-medium', isExpiringSoon ? 'text-red-400' : 'text-white/70')}>
              {format(date, 'dd MMM yyyy')}
            </div>
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
      data={fleet}
      isLoading={isLoading}
      emptyIcon={Truck}
      emptyMessage="No vehicles registered in fleet"
    />
  );
}
