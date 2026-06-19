'use client';

import { X } from 'lucide-react';
import { FormSelect } from '@/modules/admin/shared/components/forms/FormSelect';
import { TableSearch } from '@/modules/admin/shared/components/tables/TableSearch';
import type { LeadFilters, LeadStatus } from '@/modules/admin/types';
import { LEAD_STATUS_LABELS } from '@/modules/admin/types';

interface LeadFiltersProps {
  filters: LeadFilters;
  statusCounts: Record<string, number>;
  onFilter: (f: Partial<LeadFilters>) => void;
  onReset: () => void;
}

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'website', label: 'Website' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'referral', label: 'Referral' },
  { value: 'manual', label: 'Manual' },
];

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'leadScore_desc', label: 'Highest Score' },
  { value: 'name_asc', label: 'Name A–Z' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  ...Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export function LeadFilters({ filters, statusCounts, onFilter, onReset }: LeadFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.status !== 'all' || filters.source !== 'all' || filters.city;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TableSearch
        value={filters.search}
        onChange={(v) => onFilter({ search: v })}
        placeholder="Search leads..."
        className="w-52"
      />

      <FormSelect
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(e) => onFilter({ status: e.target.value as LeadFilters['status'] })}
        className="h-8 w-36 text-xs"
      />

      <FormSelect
        options={SOURCE_OPTIONS}
        value={filters.source}
        onChange={(e) => onFilter({ source: e.target.value as LeadFilters['source'] })}
        className="h-8 w-32 text-xs"
      />

      <FormSelect
        options={SORT_OPTIONS}
        value={filters.sortBy}
        onChange={(e) => onFilter({ sortBy: e.target.value as LeadFilters['sortBy'] })}
        className="h-8 w-36 text-xs"
      />

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      )}
    </div>
  );
}
