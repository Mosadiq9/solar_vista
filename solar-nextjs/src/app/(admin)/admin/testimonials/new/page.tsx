'use client';

import { useRouter } from 'next/navigation';
import { TestimonialForm } from '@/modules/admin/cms/testimonials/components/TestimonialForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { TestimonialFormInput } from '@/modules/admin/cms/testimonials/validation/testimonialSchema';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import { useTenant } from '@/providers/TenantProvider';
import { useState } from 'react';

export default function NewTestimonialPage() {
  const router = useRouter();
  const { addToast } = useAdminUIStore();
  const { tenant } = useTenant();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: TestimonialFormInput) => {
    if (!tenant) {
      addToast({ type: 'error', title: 'Tenant context missing' });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.from(DB_TABLES.TESTIMONIALS).insert({
      tenant_id: tenant.id,
      client_name: data.customerName,
      client_role: `${data.city}, Customer`,
      content: data.quote,
      rating: data.rating,
      system_size: data.systemSize,
      savings_estimate: null,
      avatar_url: null,
      featured: data.featured || false,
      sort_order: 0,
    });

    setSubmitting(false);

    if (error) {
      addToast({ type: 'error', title: 'Failed to add testimonial', description: error.message });
      return;
    }

    addToast({ type: 'success', title: 'Testimonial added successfully' });
    router.push('/admin/testimonials');
  };

  return <TestimonialForm onSubmit={handleSubmit} isSubmitting={submitting} mode="create" />;
}
