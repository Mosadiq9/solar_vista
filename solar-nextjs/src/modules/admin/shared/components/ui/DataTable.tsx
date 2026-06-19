'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from './EmptyState';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyIcon?: React.ElementType;
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyIcon,
  emptyMessage = 'No data found',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col rounded-xl border border-white/[0.06] bg-brand-surface shadow-card">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full text-left text-sm text-white/70">
          <thead className="border-b border-white/[0.06] bg-white/[0.02]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'whitespace-nowrap px-4 py-3.5 font-medium text-white/50',
                        header.column.getCanSort() && 'cursor-pointer select-none hover:text-white'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-white/30">
                            {{
                              asc: <ArrowUp className="h-3 w-3 text-brand-primary" />,
                              desc: <ArrowDown className="h-3 w-3 text-brand-primary" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-4">
                      <div className="h-4 animate-pulse rounded bg-white/[0.05]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-48">
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyMessage}
                    description="When you create records, they will appear here."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] p-4">
          <div className="text-xs text-white/40">
            Page <span className="font-medium text-white/80">{table.getState().pagination.pageIndex + 1}</span> of{' '}
            <span className="font-medium text-white/80">{table.getPageCount()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-white/60 disabled:opacity-50 hover:bg-white/[0.05]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-white/60 disabled:opacity-50 hover:bg-white/[0.05]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
