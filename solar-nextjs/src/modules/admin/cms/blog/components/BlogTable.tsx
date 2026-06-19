'use client';

import Link from 'next/link';
import { Edit2, Trash2, Eye, EyeOff, Plus, FileText } from 'lucide-react';
import { DataTable, type Column } from '@/modules/admin/shared/components/tables/DataTable';
import { StatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import { EmptyState } from '@/modules/admin/shared/components/ui/EmptyState';
import { TableSearch } from '@/modules/admin/shared/components/tables/TableSearch';
import { ConfirmModal } from '@/modules/admin/shared/components/ui/ConfirmModal';
import { useBlog } from '@/modules/admin/cms/blog/hooks/useBlog';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BlogCMS } from '@/modules/admin/types';

const FILTER_TABS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
] as const;

export function BlogTable() {
  const { posts, counts, search, setSearch, filter, setFilter, togglePublish, deletePost } =
    useBlog();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: Column<BlogCMS>[] = [
    {
      key: 'title',
      header: 'Post',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/85">{row.title}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-white/35">{row.category}</span>
            <span className="text-white/15">·</span>
            <span className="text-xs text-white/35">{row.readTimeMinutes ?? '—'} min read</span>
            <span className="text-white/15">·</span>
            <span className="text-xs uppercase text-white/25">{row.locale}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'published',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          label={row.published ? 'Published' : 'Draft'}
          variant={row.published ? 'success' : 'neutral'}
        />
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (row) =>
        row.featured ? (
          <StatusBadge label="Featured" variant="warning" />
        ) : (
          <span className="text-xs text-white/20">—</span>
        ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-white/35">
          {new Date(row.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '100px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => togglePublish(row.id)}
            title={row.published ? 'Unpublish' : 'Publish'}
            className="hover:bg-white/8 flex h-7 w-7 items-center justify-center rounded text-white/25 transition-colors hover:text-white/60"
          >
            {row.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <Link
            href={`/admin/blog/${row.id}`}
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
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-brand-surface-2 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filter === tab.value
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-white/40 hover:text-white/70'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-2xs',
                  filter === tab.value
                    ? 'bg-brand-primary/15 text-brand-primary'
                    : 'bg-white/8 text-white/30'
                )}
              >
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search posts..."
            className="w-48"
          />
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light"
          >
            <Plus className="h-3.5 w-3.5" /> New Post
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-brand-surface-2">
        <DataTable
          columns={columns}
          data={posts}
          keyExtractor={(r) => r.id}
          emptyState={
            <EmptyState
              icon={<FileText className="h-6 w-6" />}
              title="No posts found"
              description="Create your first blog post."
              action={
                <Link
                  href="/admin/blog/new"
                  className="rounded-lg bg-brand-primary/10 px-4 py-2 text-xs font-medium text-brand-primary transition-colors hover:bg-brand-primary/20"
                >
                  Write a post
                </Link>
              }
            />
          }
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deletePost(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete post?"
        description="This action cannot be undone. The post will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
