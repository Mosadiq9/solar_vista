'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { DataTable, type Column } from '@/modules/admin/shared/components/tables/DataTable';
import { StatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import { EmptyState } from '@/modules/admin/shared/components/ui/EmptyState';
import { ConfirmModal } from '@/modules/admin/shared/components/ui/ConfirmModal';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';

interface TestimonialCMS {
  id: string;
  clientName: string;
  clientRole: string | null;
  content: string;
  rating: number;
  systemSize: string | null;
  savingsEstimate: string | null;
  avatarUrl: string | null;
  featured?: boolean;
}

export function TestimonialsTable() {
  const [testimonials, setTestimonials] = useState<TestimonialCMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from(DB_TABLES.TESTIMONIALS)
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setTestimonials(
        data.map((t) => ({
          id: t.id,
          clientName: t.client_name,
          clientRole: t.client_role,
          content: t.content,
          rating: t.rating,
          systemSize: t.system_size,
          savingsEstimate: t.savings_estimate,
          avatarUrl: t.avatar_url,
          featured: t.featured || false,
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;

    const { error } = await supabase.from(DB_TABLES.TESTIMONIALS).delete().eq('id', deleteId);

    if (!error) {
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
    }
    setDeleteId(null);
  }

  const columns: Column<TestimonialCMS>[] = [
    {
      key: 'clientName',
      header: 'Customer',
      render: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white/85">{row.clientName}</p>
            {row.featured && <Star className="h-3 w-3 text-brand-primary" />}
          </div>
          <p className="text-xs text-white/35">
            {row.clientRole} · {row.systemSize}
          </p>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row) => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < row.rating ? 'fill-brand-primary text-brand-primary' : 'text-white/15'}`}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'quote',
      header: 'Quote',
      render: (row) => (
        <p className="max-w-xs truncate text-xs text-white/50">&ldquo;{row.content}&rdquo;</p>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/testimonials/${row.id}`}
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
      <div className="flex justify-end">
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light"
        >
          <Plus className="h-3.5 w-3.5" /> Add Testimonial
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-brand-surface-2">
        <DataTable
          columns={columns}
          data={testimonials}
          keyExtractor={(r) => r.id}
          emptyState={
            <EmptyState
              icon={<MessageSquare className="h-6 w-6" />}
              title="No testimonials yet"
              description="Add customer reviews to build trust."
            />
          }
        />
      </div>
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete testimonial?"
        description="This will remove the review from your website."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
