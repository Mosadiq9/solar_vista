'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function TablePagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: TablePaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const btnBase =
    'flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/8 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-30';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <p className="text-xs text-white/30">
        {total === 0 ? 'No results' : `${start}–${end} of ${total}`}
      </p>
      <div className="flex items-center gap-1">
        {onPageSizeChange && (
          <div className="mr-3 flex items-center gap-2">
            <span className="text-xs text-white/30">Rows</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 rounded-md border border-white/10 bg-brand-surface px-2 text-xs text-white/60 outline-none focus:border-brand-primary/40"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s} className="bg-brand-surface">
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className={btnBase}
          aria-label="First page"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={btnBase}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-[4rem] text-center text-xs text-white/50">
          {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={btnBase}
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className={btnBase}
          aria-label="Last page"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
