'use client';

import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  sortKey?: string | null;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  selectedIds?: Set<string>;
  onSelectAll?: () => void;
  selectable?: boolean;
  onSelectRow?: (id: string) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  isLoading = false,
  emptyState,
  className,
  selectedIds,
  onSelectAll,
  selectable = false,
  onSelectRow,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {selectable && (
              <th className="w-10 py-3 pl-4">
                <input
                  type="checkbox"
                  checked={selectedIds?.size === data.length && data.length > 0}
                  onChange={onSelectAll}
                  className="h-3.5 w-3.5 rounded border-white/20 bg-brand-surface accent-brand-primary"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'py-3 pr-4 text-left font-medium text-white/40',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  !selectable && col === columns[0] && 'pl-4',
                  col.sortable && 'cursor-pointer select-none transition-colors hover:text-white/70'
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.header}
                  {col.sortable && (
                    <span className="text-white/20">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="h-3 w-3 text-brand-primary" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-brand-primary" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-0">
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const id = keyExtractor(row);
              const isSelected = selectedIds?.has(id);
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors duration-100',
                    onRowClick && 'cursor-pointer',
                    isSelected ? 'bg-brand-primary/5' : 'hover:bg-white/[0.02]'
                  )}
                >
                  {selectable && (
                    <td className="w-10 py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow?.(id)}
                        className="h-3.5 w-3.5 rounded border-white/20 bg-brand-surface accent-brand-primary"
                      />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key}
                      className={cn(
                        'py-3 pr-4 text-white/80',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        !selectable && colIndex === 0 && 'pl-4'
                      )}
                    >
                      {col.render(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
