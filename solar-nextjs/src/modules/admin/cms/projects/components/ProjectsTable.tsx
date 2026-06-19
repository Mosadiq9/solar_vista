'use client';

import Link from 'next/link';
import { Edit2, Trash2, Plus, Briefcase, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DataTable, type Column } from '@/modules/admin/shared/components/tables/DataTable';
import { StatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import { EmptyState } from '@/modules/admin/shared/components/ui/EmptyState';
import { ConfirmModal } from '@/modules/admin/shared/components/ui/ConfirmModal';
import { TableSearch } from '@/modules/admin/shared/components/tables/TableSearch';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';

interface ProjectCMS {
  id: string;
  title: string;
  category: string;
  location: string;
  capacity: string;
  savings: string;
  featured?: boolean;
}

const PROPERTY_LABELS: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
};

export function ProjectsTable() {
  const [projects, setProjects] = useState<ProjectCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setProjects(
        data.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          location: p.location,
          capacity: p.capacity,
          savings: p.savings,
          featured: p.featured || false,
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;

    const { error } = await supabase.from(DB_TABLES.PROJECTS).delete().eq('id', deleteId);

    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    }
    setDeleteId(null);
  }

  const filtered = projects.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<ProjectCMS>[] = [
    {
      key: 'title',
      header: 'Project',
      render: (row) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-white/85">{row.title}</p>
            {row.featured && <Star className="h-3 w-3 shrink-0 text-brand-primary" />}
          </div>
          <p className="text-xs text-white/35">{row.location}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Type',
      render: (row) => (
        <StatusBadge
          label={PROPERTY_LABELS[row.category] || row.category}
          variant={
            row.category === 'residential'
              ? 'info'
              : row.category === 'commercial'
                ? 'warning'
                : 'neutral'
          }
        />
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (row) => <span className="text-sm font-semibold text-white/80">{row.capacity}</span>,
    },
    {
      key: 'savings',
      header: 'Savings',
      render: (row) => <span className="text-sm font-medium text-brand-accent">{row.savings}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/projects/${row.id}`}
            className="hover:bg-white/8 flex h-7 w-7 items-center justify-center rounded text-white/25 transition-colors hover:text-white/60"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setDeleteId(row.id)}
            className="flex h-7 w-7 items-center justify-center rounded text-white/25 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <TableSearch
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
          className="w-52"
        />
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light"
        >
          <Plus className="h-3.5 w-3.5" /> New Project
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-brand-surface-2">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyState={
            <EmptyState
              icon={<Briefcase className="h-6 w-6" />}
              title="No projects yet"
              description="Add your first case study project."
            />
          }
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete project?"
        description="This will remove the project from the website permanently."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
