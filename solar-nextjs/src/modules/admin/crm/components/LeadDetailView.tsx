'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, Zap, Globe, Calendar, ExternalLink } from 'lucide-react';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import { LeadStatusBadge } from '@/modules/admin/shared/components/ui/StatusBadge';
import { LeadScoreIndicator } from './LeadScoreIndicator';
import { LeadNotesPanel } from './LeadNotesPanel';
import { LeadTimeline } from './LeadTimeline';
import { FormSelect } from '@/modules/admin/shared/components/forms/FormSelect';
import { buildWhatsAppUrl } from '@/lib/utils';
import type { AdminLead, LeadStatus } from '@/modules/admin/types';
import { LEAD_STATUS_LABELS } from '@/modules/admin/types';

interface LeadDetailViewProps {
  lead: AdminLead;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, content: string, authorName: string) => void;
}

const STATUS_OPTIONS = Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const SOURCE_LABELS: Record<AdminLead['source'], string> = {
  website: 'Website Form',
  chatbot: 'AI Chatbot',
  whatsapp: 'WhatsApp',
  referral: 'Referral',
  manual: 'Manual Entry',
};

const BILL_LABELS: Record<string, string> = {
  'below-1000': 'Below ₹1,000',
  '1000-3000': '₹1,000 – ₹3,000',
  '3000-7000': '₹3,000 – ₹7,000',
  '7000-15000': '₹7,000 – ₹15,000',
  '15000-50000': '₹15,000 – ₹50,000',
  'above-50000': 'Above ₹50,000',
};

export function LeadDetailView({ lead, onUpdateStatus, onAddNote }: LeadDetailViewProps) {
  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <Link
          href="/admin/crm"
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-xl font-bold text-white">{lead.name}</h1>
            <LeadStatusBadge status={lead.status} />
            {lead.leadScore !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/30">AI Score:</span>
                <LeadScoreIndicator score={lead.leadScore} />
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-white/40">
            {lead.city} · Added{' '}
            {new Date(lead.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Status change */}
        <div className="shrink-0">
          <FormSelect
            options={STATUS_OPTIONS}
            value={lead.status}
            onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
            className="h-8 w-40 text-xs"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main details — 2 cols */}
        <div className="space-y-4 lg:col-span-2">
          {/* Contact info */}
          <AdminCard padding="md">
            <h2 className="mb-4 font-display text-sm font-semibold text-white">Contact Details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow icon={Phone} label="Phone" value={lead.phone} href={`tel:${lead.phone}`} />
              <InfoRow icon={Mail} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
              <InfoRow icon={MapPin} label="City" value={lead.city} />
              <InfoRow
                icon={Zap}
                label="Monthly Bill"
                value={BILL_LABELS[lead.monthlyBill] ?? lead.monthlyBill}
              />
              <InfoRow icon={Globe} label="Source" value={SOURCE_LABELS[lead.source]} />
              {lead.assignedTo && (
                <InfoRow icon={Calendar} label="Assigned To" value={lead.assignedTo} />
              )}
            </div>

            {lead.message && (
              <div className="mt-4 rounded-lg border border-white/[0.06] bg-brand-surface p-3">
                <p className="text-xs font-medium text-white/40">Message</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{lead.message}</p>
              </div>
            )}
          </AdminCard>

          {/* Quick contact actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/80"
            >
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white/80"
            >
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
            <a
              href={buildWhatsAppUrl(
                lead.phone,
                `Hi ${lead.name.split(' ')[0]}, following up on your solar inquiry from Chauhan Solar.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-brand-accent/20 bg-brand-accent/5 px-4 py-2 text-sm text-brand-accent transition-colors hover:bg-brand-accent/10"
            >
              <ExternalLink className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>

          {/* Notes */}
          <LeadNotesPanel lead={lead} onAddNote={onAddNote} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* AI readiness card */}
          <AdminCard padding="md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-white/60">
                  AI Lead Score
                </h3>
                {lead.leadScore !== undefined ? (
                  <p className="mt-2 font-display text-4xl font-bold text-brand-primary">
                    {lead.leadScore}
                    <span className="text-lg font-normal text-white/20">/100</span>
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-white/30">Not scored yet</p>
                )}
              </div>
            </div>
            <div className="bg-white/8 mt-3 h-1.5 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-700"
                style={{ width: `${lead.leadScore ?? 0}%` }}
              />
            </div>
            <p className="mt-2 text-2xs text-white/25">AI scoring engine ready for activation</p>
          </AdminCard>

          {/* Timeline */}
          <LeadTimeline lead={lead} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/30">
        <Icon className="h-3 w-3" />
      </div>
      <div className="min-w-0">
        <p className="text-2xs text-white/30">{label}</p>
        {href ? (
          <a
            href={href}
            className="block truncate text-sm text-white/75 transition-colors hover:text-brand-primary"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-sm text-white/75">{value}</p>
        )}
      </div>
    </div>
  );
}
