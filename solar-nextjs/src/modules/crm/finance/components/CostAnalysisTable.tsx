'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/modules/admin/shared/components/ui';
import { CostAnalysis } from '../types';
import { useFinanceStore } from '../store/useFinanceStore';
import { PieChart, MoreHorizontal, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CostAnalysisTable() {
  const { costAnalysis, isLoading } = useFinanceStore();

  const columns = useMemo<ColumnDef<CostAnalysis>[]>(
    () => [
      {
        accessorKey: 'customer_name',
        header: 'Project Customer',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-white/90">{row.original.customer_name}</div>
            <div className="text-2xs text-brand-primary">{row.original.system_kw} KW System</div>
          </div>
        ),
      },
      {
        accessorKey: 'total_revenue',
        header: 'Total Revenue',
        cell: ({ getValue }) => <div className="text-sm font-semibold text-white/90 font-mono">₹{getValue<number>().toLocaleString('en-IN')}</div>,
      },
      {
        header: 'Costs Breakdown',
        cell: ({ row }) => (
          <div className="text-2xs text-white/60 space-y-0.5">
            <div className="flex justify-between w-32"><span className="text-white/40">Material:</span> <span>₹{row.original.material_cost.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between w-32"><span className="text-white/40">Labor:</span> <span>₹{row.original.labor_cost.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between w-32"><span className="text-white/40">Misc:</span> <span>₹{row.original.misc_cost.toLocaleString('en-IN')}</span></div>
          </div>
        ),
      },
      {
        accessorKey: 'profit_margin',
        header: 'Net Profit',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-bold text-green-400 font-mono flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              ₹{row.original.profit_margin.toLocaleString('en-IN')}
            </div>
            <div className="text-2xs font-semibold px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded w-max mt-1">
              {row.original.profit_percentage}% Margin
            </div>
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
      data={costAnalysis}
      isLoading={isLoading}
      emptyIcon={PieChart}
      emptyMessage="No cost analysis data found"
    />
  );
}
