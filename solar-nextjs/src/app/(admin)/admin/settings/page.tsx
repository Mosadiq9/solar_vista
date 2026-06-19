import type { Metadata } from 'next';
import { PageHeader } from '@/modules/admin/shared/components/ui/PageHeader';
import { SettingsPanel } from '@/modules/admin/settings/components/SettingsPanel';

export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Settings" description="Platform configuration and integrations" />
      <SettingsPanel />
    </div>
  );
}
