'use client';

import { useRouter } from 'next/navigation';
import { FaqForm } from '@/modules/admin/cms/faq/components/FaqForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { FaqFormInput } from '@/modules/admin/cms/faq/validation/faqSchema';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import { useState, useEffect } from 'react';

export default function EditFaqPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useAdminUIStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [faq, setFaq] = useState<Partial<FaqFormInput> | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadFaq() {
      const { data, error } = await supabase
        .from(DB_TABLES.FAQS)
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        addToast({ type: 'error', title: 'Failed to load FAQ', description: error.message });
        router.push('/admin/faq');
        return;
      }

      if (data) {
        setFaq({
          question: data.question,
          answer: data.answer,
          category: data.category,
          order: data.sort_order,
          published: true, // fallback default
        });
      }
      setLoading(false);
    }
    loadFaq();
  }, [params.id, router, addToast, supabase]);

  const handleSubmit = async (data: FaqFormInput) => {
    setSubmitting(true);
    const { error } = await supabase
      .from(DB_TABLES.FAQS)
      .update({
        category: data.category,
        question: data.question,
        answer: data.answer,
        sort_order: data.order || 0,
      })
      .eq('id', params.id);

    setSubmitting(false);

    if (error) {
      addToast({ type: 'error', title: 'Failed to update FAQ', description: error.message });
      return;
    }

    addToast({ type: 'success', title: 'FAQ updated successfully' });
    router.push('/admin/faq');
  };

  if (loading) {
    return <div className="p-5 text-sm text-white/40">Loading FAQ details...</div>;
  }

  return (
    <FaqForm
      onSubmit={handleSubmit}
      defaultValues={faq || undefined}
      isSubmitting={submitting}
      mode="edit"
    />
  );
}
