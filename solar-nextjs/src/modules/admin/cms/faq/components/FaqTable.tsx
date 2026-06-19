'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, HelpCircle, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { DataTable, type Column } from '@/modules/admin/shared/components/tables/DataTable';
import { StatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import { EmptyState } from '@/modules/admin/shared/components/ui/EmptyState';
import { ConfirmModal } from '@/modules/admin/shared/components/ui/ConfirmModal';
import { FormSelect } from '@/modules/admin/shared/components/forms/FormSelect';
import { FAQ_CATEGORIES } from '@/modules/admin/cms/faq/validation/faqSchema';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

const CATEGORY_FILTER = [
  { value: 'all', label: 'All Categories' },
  ...FAQ_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export function FaqTable() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchFaqs() {
    setLoading(true);
    const { data, error } = await supabase
      .from(DB_TABLES.FAQS)
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setFaqs(data as FaqItem[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;

    const { error } = await supabase.from(DB_TABLES.FAQS).delete().eq('id', deleteId);

    if (!error) {
      setFaqs((prev) => prev.filter((f) => f.id !== deleteId));
    }
    setDeleteId(null);
  }

  const filtered = faqs.filter((f) => category === 'all' || f.category === category);

  const columns: Column<FaqItem>[] = [
    {
      key: 'order',
      header: '',
      width: '40px',
      render: () => <GripVertical className="h-4 w-4 cursor-grab text-white/15" />,
    },
    {
      key: 'question',
      header: 'Question',
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-white/85">{row.question}</p>
          <p className="mt-0.5 max-w-sm truncate text-xs text-white/35">{row.answer}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <StatusBadge label={row.category} variant="neutral" />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/faq/${row.id}`}
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
        <FormSelect
          options={CATEGORY_FILTER}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-8 w-44 text-xs"
        />
        <Link
          href="/admin/faq/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light"
        >
          <Plus className="h-3.5 w-3.5" /> Add FAQ
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-brand-surface-2">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyState={
            <EmptyState
              icon={<HelpCircle className="h-6 w-6" />}
              title="No FAQs yet"
              description="Add frequently asked questions to help customers."
            />
          }
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete FAQ?"
        description="This will remove the question from your website."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
