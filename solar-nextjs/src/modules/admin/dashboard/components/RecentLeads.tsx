'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { AdminCard, AdminCardHeader } from '@/modules/admin/shared/components/ui/AdminCard';
import { LeadStatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import type { AdminLead } from '@/modules/admin/types';

interface RecentLeadsProps {
  leads: AdminLead[];
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  return (
    <AdminCard padding="none">
      <div className="p-5 pb-3">
        <AdminCardHeader
          title="Recent Leads"
          description="Latest enquiries from all channels"
          action={
            <Link
              href="/admin/crm"
              className="flex items-center gap-1 text-xs text-brand-primary transition-colors hover:text-brand-primary-light"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
      </div>

      <div className="divide-y divide-white/[0.04]">
        {leads.map((lead) => (
          <Link
            key={lead.id}
            href={`/admin/crm/${lead.id}`}
            className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
          >
            {/* Avatar initial */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-semibold text-brand-primary">
              {lead.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-white/80">{lead.name}</p>
                <LeadStatusBadge status={lead.status} size="sm" showDot={false} />
              </div>
              <p className="mt-0.5 truncate text-xs text-white/35">
                {lead.city} · {lead.monthlyBill.replace('-', ' – ')} ₹/mo
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-2xs text-white/30">{timeAgo(lead.createdAt)}</p>
              {lead.leadScore !== undefined && (
                <p className="mt-0.5 text-xs font-semibold text-brand-primary">
                  {lead.leadScore}
                  <span className="font-normal text-white/20">/100</span>
                </p>
              )}
            </div>
          </Link>
        ))}

        {leads.length === 0 && (
          <p className="px-5 py-6 text-center text-xs text-white/25">No recent leads</p>
        )}
      </div>
    </AdminCard>
  );
}
