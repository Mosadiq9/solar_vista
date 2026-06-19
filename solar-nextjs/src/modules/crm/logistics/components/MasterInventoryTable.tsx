'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { InventoryItem } from '../types';
import { useLogisticsStore } from '../store/useLogisticsStore';
import { Package, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MasterInventoryTable() {
  const { inventory, isLoading } = useLogisticsStore();

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Item',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90">{row.original.name}</div>
            <div className="text-2xs text-white/50">SKU: {row.original.sku || '-'}</div>
          </div>
        ),
      },
      {
        accessorKey: 'category_name',
        header: 'Category',
        cell: ({ row }) => (
          <div>
            <div className="text-sm text-white/70">{row.original.category_name}</div>
            <div className="text-2xs text-brand-primary">{row.original.brand_name}</div>
          </div>
        ),
      },
      {
        accessorKey: 'unit_price',
        header: 'Unit Price',
        cell: ({ getValue, row }) => (
          <div>
            <div className="text-sm font-semibold text-white/80">₹{getValue<number>().toLocaleString('en-IN')}</div>
            <div className="text-2xs text-white/40">+{row.original.tax_percentage}% GST</div>
          </div>
        ),
      },
      {
        accessorKey: 'stock_quantity',
        header: 'Stock Level',
        cell: ({ row }) => {
          const stock = row.original.stock_quantity;
          const min = row.original.min_threshold;
          const isLow = stock <= min;

          return (
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-sm font-bold',
                isLow ? 'text-red-400' : 'text-green-400'
              )}>
                {stock}
              </span>
              {isLow && (
                <span className="flex items-center gap-1 text-2xs font-medium text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                  <AlertTriangle className="h-3 w-3" />
                  Low Stock
                </span>
              )}
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
      data={inventory}
      isLoading={isLoading}
      emptyIcon={Package}
      emptyMessage="No inventory items found"
    />
  );
}
