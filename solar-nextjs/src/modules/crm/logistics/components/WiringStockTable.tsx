'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { WiringItem } from '../types';
import { useLogisticsStore } from '../store/useLogisticsStore';
import { Zap, MoreHorizontal, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WiringStockTable() {
  const { wiring, isLoading } = useLogisticsStore();

  const columns = useMemo<ColumnDef<WiringItem>[]>(
    () => [
      {
        accessorKey: 'wire_type',
        header: 'Type & Specification',
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white/90">{row.original.wire_type.replace(/_/g, ' ')}</span>
              <span className="text-xs font-mono text-brand-primary">{row.original.gauge_sqmm} sq.mm</span>
            </div>
            <div className="text-2xs text-white/50">{row.original.brand_name}</div>
          </div>
        ),
      },
      {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ getValue }) => {
          const color = getValue<string>();
          return (
            <div className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full border border-white/20 shadow-sm" 
                style={{ backgroundColor: color.toLowerCase() }} 
              />
              <span className="text-sm text-white/70">{color}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'unit_price',
        header: 'Price (per meter)',
        cell: ({ getValue, row }) => (
          <div>
            <div className="text-sm font-semibold text-white/80">₹{getValue<number>()} / m</div>
            <div className="text-2xs text-white/40">+{row.original.tax_percentage}% GST</div>
          </div>
        ),
      },
      {
        accessorKey: 'stock_meters',
        header: 'Available Stock (Meters)',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5 text-sm font-mono text-white/90">
            <Link className="h-3.5 w-3.5 text-white/40" />
            {getValue<number>().toLocaleString('en-IN')} m
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
      data={wiring}
      isLoading={isLoading}
      emptyIcon={Zap}
      emptyMessage="No wiring stock found"
    />
  );
}
