'use client';

import { useMemo } from 'react';
import { useAdminStore } from '@/modules/admin/store/adminStore';
import type { LeadFilters, AdminLead, LeadStatus } from '@/modules/admin/types';

export function useLeads() {
  const {
    leads,
    filteredLeads,
    filters,
    selectedLead,
    setFilters,
    resetFilters,
    selectLead,
    updateLeadStatus,
    addNote,
    fetchLeads,
  } = useAdminStore();

  const pagination = useMemo(() => {
    const total = filteredLeads.length;
    const { page, pageSize } = filters;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedLeads = filteredLeads.slice(start, start + pageSize);
    return { total, totalPages, paginatedLeads, page, pageSize };
  }, [filteredLeads, filters.page, filters.pageSize]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, [leads]);

  return {
    leads: pagination.paginatedLeads,
    allLeads: leads,
    filteredCount: pagination.total,
    filters,
    pagination,
    statusCounts,
    selectedLead,
    setFilters,
    resetFilters,
    selectLead,
    updateLeadStatus,
    addNote,
    fetchLeads,
  };
}

export function useLeadDetail(id: string | null) {
  const { leads, selectedLead, selectLead, updateLeadStatus, addNote } = useAdminStore();

  const lead = useMemo(() => {
    if (!id) return null;
    return leads.find((l) => l.id === id) ?? null;
  }, [leads, id]);

  return { lead: lead ?? selectedLead, selectLead, updateLeadStatus, addNote };
}
