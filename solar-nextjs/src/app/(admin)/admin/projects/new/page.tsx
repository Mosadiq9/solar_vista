'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/modules/admin/cms/projects/components/ProjectForm';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';
import type { ProjectFormInput } from '@/modules/admin/cms/projects/validation/projectSchema';
import { createClient } from '@/services/supabase/client';
import { DB_TABLES } from '@/config/db-tables';
import { useTenant } from '@/providers/TenantProvider';
import { useState } from 'react';

export default function NewProjectPage() {
  const router = useRouter();
  const { addToast } = useAdminUIStore();
  const { tenant } = useTenant();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ProjectFormInput) => {
    if (!tenant) {
      addToast({ type: 'error', title: 'Tenant context missing' });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const savingsStr = data.annualSavingsInr
      ? `₹${(data.annualSavingsInr / 100000).toFixed(1)} Lakhs/Yr`
      : '₹0/Yr';

    const { error } = await supabase.from(DB_TABLES.PROJECTS).insert({
      tenant_id: tenant.id,
      title: data.title,
      category: data.propertyType,
      location: `${data.city}, ${data.state}`,
      capacity: `${data.systemSizeKw} kW`,
      savings: savingsStr,
      image_url: data.coverImage || null,
      case_study_slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      featured: false,
      sort_order: 0,
    });

    setSubmitting(false);

    if (error) {
      addToast({ type: 'error', title: 'Failed to create project', description: error.message });
      return;
    }

    addToast({
      type: 'success',
      title: 'Project created',
      message: `"${data.title}" has been saved.`,
    });
    router.push('/admin/projects');
  };

  return <ProjectForm onSubmit={handleSubmit} isSubmitting={submitting} mode="create" />;
}
