'use client';

import { useRouter } from 'next/navigation';
import { FaqForm } from '@/modules/admin/cms/faq/components/FaqForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { FaqFormInput } from '@/modules/admin/cms/faq/validation/faqSchema';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import { useTenant } from '@/providers/TenantProvider';
import { useState } from 'react';

export default function NewFaqPage() {
  const router = useRouter();
  const { addToast } = useAdminUIStore();
  const { tenant } = useTenant();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: FaqFormInput) => {
    if (!tenant) {
      addToast({ type: 'error', title: 'Tenant context missing' });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from(DB_TABLES.FAQS).insert({
      tenant_id: tenant.id,
      category: data.category,
      question: data.question,
      answer: data.answer,
      sort_order: data.order || 0,
      is_active: true,
    });

    setSubmitting(false);

    if (error) {
      addToast({ type: 'error', title: 'Failed to create FAQ', description: error.message });
      return;
    }

    addToast({ type: 'success', title: 'FAQ created successfully' });
    router.push('/admin/faq');
  };

  return <FaqForm onSubmit={handleSubmit} isSubmitting={submitting} mode="create" />;
}
