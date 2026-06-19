'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/modules/admin/cms/projects/components/ProjectForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { ProjectFormInput } from '@/modules/admin/cms/projects/validation/projectSchema';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import { useState, useEffect } from 'react';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useAdminUIStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<Partial<ProjectFormInput> | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadProject() {
      const { data, error } = await supabase
        .from(DB_TABLES.PROJECTS)
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        addToast({ type: 'error', title: 'Failed to load project', description: error.message });
        router.push('/admin/projects');
        return;
      }

      if (data) {
        const [city, state] = (data.location || '').split(', ');
        const sizeKw = parseFloat(data.capacity || '0');
        // Extract numbers from savings string (e.g., ₹84 Lakhs/Yr -> 84 * 100000)
        let savingsInr = 0;
        const savingsMatch = (data.savings || '').match(/[\d.]+/);
        if (savingsMatch) {
          const val = parseFloat(savingsMatch[0]);
          if ((data.savings || '').includes('Lakhs')) {
            savingsInr = val * 100000;
          } else {
            savingsInr = val;
          }
        }

        setProject({
          title: data.title,
          city: city || '',
          state: state || '',
          propertyType: data.category as any,
          systemSizeKw: sizeKw,
          annualSavingsInr: savingsInr,
          co2OffsetTons: sizeKw * 0.84, // simple dynamic estimator
          featured: data.featured || false,
          coverImage: data.image_url || '',
          completedAt: new Date(data.created_at).toISOString().split('T')[0],
        });
      }
      setLoading(false);
    }
    loadProject();
  }, [params.id, router, addToast, supabase]);

  const handleSubmit = async (data: ProjectFormInput) => {
    setSubmitting(true);

    const savingsStr = data.annualSavingsInr
      ? `₹${(data.annualSavingsInr / 100000).toFixed(1)} Lakhs/Yr`
      : '₹0/Yr';

    const { error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .update({
        title: data.title,
        category: data.propertyType,
        location: `${data.city}, ${data.state}`,
        capacity: `${data.systemSizeKw} kW`,
        savings: savingsStr,
        image_url: data.coverImage || null,
      })
      .eq('id', params.id);

    setSubmitting(false);

    if (error) {
      addToast({ type: 'error', title: 'Failed to update project', description: error.message });
      return;
    }

    addToast({ type: 'success', title: 'Project updated successfully' });
    router.push('/admin/projects');
  };

  if (loading) {
    return <div className="p-5 text-sm text-white/40">Loading project details...</div>;
  }

  return (
    <ProjectForm
      onSubmit={handleSubmit}
      defaultValues={project || undefined}
      isSubmitting={submitting}
      mode="edit"
    />
  );
}
