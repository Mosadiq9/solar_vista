'use client';

import { Settings, Globe, Bell, Shield, Database, Zap, Palette } from 'lucide-react';
import { AdminCard, AdminCardHeader } from '@/modules/admin/shared/components/ui/AdminCard';
import { FormField } from '@/modules/admin/shared/components/forms/FormField';
import { FormToggle } from '@/modules/admin/shared/components/forms/FormToggle';
import { useState } from 'react';

export function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [chatbot, setChatbot] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);

  return (
    <div className="max-w-3xl space-y-5">
      {/* Site Settings */}
      <AdminCard padding="md">
        <AdminCardHeader
          title="Site Configuration"
          icon={<Globe className="h-4 w-4" />}
          className="mb-4"
        />
        <div className="space-y-3">
          <FormField label="Company Name" defaultValue="Chauhan Solar LLP" />
          <FormField label="Contact Phone" defaultValue="+91 98765 43210" />
          <FormField label="Contact Email" defaultValue="info@chauhansolar.com" />
          <FormField
            label="WhatsApp Number"
            defaultValue="+91 98765 43210"
            hint="Used for WhatsApp CTA buttons"
          />
        </div>
      </AdminCard>

      {/* Feature Flags */}
      <AdminCard padding="md">
        <AdminCardHeader
          title="Feature Flags"
          icon={<Zap className="h-4 w-4" />}
          className="mb-4"
        />
        <div className="space-y-4">
          <FormToggle
            label="AI Chatbot"
            description="Enable the AI-powered chat widget on the public site"
            checked={chatbot}
            onChange={setChatbot}
          />
          <FormToggle
            label="WhatsApp Integration"
            description="Show WhatsApp CTA buttons throughout the site"
            checked={whatsapp}
            onChange={setWhatsapp}
          />
          <FormToggle
            label="Admin Notifications"
            description="Receive browser notifications for new leads"
            checked={notifications}
            onChange={setNotifications}
          />
        </div>
      </AdminCard>

      {/* RBAC Info */}
      <AdminCard padding="md">
        <AdminCardHeader
          title="Security & Access"
          icon={<Shield className="h-4 w-4" />}
          className="mb-4"
        />
        <div className="space-y-2 text-sm text-white/50">
          <p>
            Authentication is powered by <span className="text-white/70">Supabase Auth</span>.
          </p>
          <p>
            Row Level Security (RLS) policies enforce role-based data access at the database level.
          </p>
          <p className="mt-3 text-xs text-white/30">
            Configure Supabase Auth settings at your Supabase project dashboard.
          </p>
        </div>
      </AdminCard>

      {/* Database */}
      <AdminCard padding="md">
        <AdminCardHeader
          title="Database"
          icon={<Database className="h-4 w-4" />}
          className="mb-4"
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-brand-surface px-3 py-2.5">
            <div>
              <p className="text-sm text-white/70">Supabase Connection</p>
              <p className="text-xs text-white/30">
                {process.env.NEXT_PUBLIC_SUPABASE_URL
                  ? 'Connected'
                  : 'Not configured — set NEXT_PUBLIC_SUPABASE_URL'}
              </p>
            </div>
            <div
              className={`h-2 w-2 rounded-full ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'bg-brand-accent' : 'bg-red-400'}`}
            />
          </div>
          <FormField
            label="Supabase URL"
            placeholder="https://your-project.supabase.co"
            defaultValue={process.env.NEXT_PUBLIC_SUPABASE_URL || ''}
            disabled
            hint="Set via environment variable NEXT_PUBLIC_SUPABASE_URL"
          />
        </div>
      </AdminCard>

      <button className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-primary-light">
        Save Settings
      </button>
    </div>
  );
}
