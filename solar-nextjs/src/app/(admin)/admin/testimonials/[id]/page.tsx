'use client';

import { useRouter } from 'next/navigation';
import { TestimonialForm } from '@/modules/admin/cms/testimonials/components/TestimonialForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { TestimonialFormInput } from '@/modules/admin/cms/testimonials/validation/testimonialSchema';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import { useState, useEffect } from 'react';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useAdminUIStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testimonial, setTestimonial] = useState<Partial<TestimonialFormInput> | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadTestimonial() {
      const { data, error } = await supabase
        .from(DB_TABLES.TESTIMONIALS)
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        addToast({
          type: 'error',
          title: 'Failed to load testimonial',
          description: error.message,
        });
        router.push('/admin/testimonials');
        return;
      }

      if (data) {
        const city = (data.client_role || '').split(', ')[0] || '';
        setTestimonial({
          customerName: data.client_name,
          city: city,
          systemSize: data.system_size || '',
          quote: data.content,
          rating: (data.rating || 5) as any,
          featured: data.featured || false,
          verified: true,
        });
      }
      setLoading(false);
    }
    loadTestimonial();
  }, [params.id, router, addToast, supabase]);

  const handleSubmit = async (data: TestimonialFormInput) => {
    setSubmitting(true);
    const { error } = await supabase
      .from(DB_TABLES.TESTIMONIALS)
      .update({
        client_name: data.customerName,
        client_role: `${data.city}, Customer`,
        content: data.quote,
        rating: data.rating,
        system_size: data.systemSize,
        featured: data.featured || false,
      })
      .eq('id', params.id);

    setSubmitting(false);

    if (error) {
      addToast({
        type: 'error',
        title: 'Failed to update testimonial',
        description: error.message,
      });
      return;
    }

    addToast({ type: 'success', title: 'Testimonial updated successfully' });
    router.push('/admin/testimonials');
  };

  if (loading) {
    return <div className="p-5 text-sm text-white/40">Loading testimonial details...</div>;
  }

  return (
    <TestimonialForm
      onSubmit={handleSubmit}
      defaultValues={testimonial || undefined}
      isSubmitting={submitting}
      mode="edit"
    />
  );
}
