import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { ProjectsTable } from '@/modules/admin/cms/projects/components/ProjectsTable';

export const metadata: Metadata = { title: 'Projects — CMS' };

export default function ProjectsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Projects"
        description="Showcase case studies and completed installations"
      />
      <ProjectsTable />
    </div>
  );
}
