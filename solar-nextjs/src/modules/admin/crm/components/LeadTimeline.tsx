'use client';

import { Circle, UserCheck, Send, Phone, FileText, Star } from 'lucide-react';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import type { AdminLead, LeadStatus } from '@/modules/admin/types';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: 'created' | 'status_change' | 'note_added' | 'call' | 'proposal';
  label: string;
  time: number;
  icon: React.ElementType;
  color: string;
}

function buildTimeline(lead: AdminLead): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: 'created',
      type: 'created',
      label: `Lead created via ${lead.source}`,
      time: lead.createdAt,
      icon: Star,
      color: 'text-brand-primary',
    },
  ];

  if (lead.status !== 'new') {
    events.push({
      id: 'contacted',
      type: 'status_change',
      label: 'Marked as contacted',
      time: lead.createdAt + 3600000,
      icon: Phone,
      color: 'text-blue-400',
    });
  }

  if (['qualified', 'proposal_sent', 'converted'].includes(lead.status)) {
    events.push({
      id: 'qualified',
      type: 'status_change',
      label: 'Lead qualified',
      time: lead.createdAt + 86400000,
      icon: UserCheck,
      color: 'text-violet-400',
    });
  }

  if (['proposal_sent', 'converted'].includes(lead.status)) {
    events.push({
      id: 'proposal',
      type: 'proposal',
      label: 'Proposal sent',
      time: lead.updatedAt - 86400000,
      icon: Send,
      color: 'text-cyan-400',
    });
  }

  lead.notes.forEach((note, i) => {
    events.push({
      id: `note-${note.id}`,
      type: 'note_added',
      label: `Note added by ${note.authorName}`,
      time: note.createdAt,
      icon: FileText,
      color: 'text-white/40',
    });
  });

  return events.sort((a, b) => b.time - a.time);
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function LeadTimeline({ lead }: { lead: AdminLead }) {
  const events = buildTimeline(lead);

  return (
    <AdminCard padding="none">
      <div className="border-b border-white/[0.06] p-4">
        <h3 className="font-display text-sm font-semibold text-white">Activity Timeline</h3>
        <p className="mt-0.5 text-xs text-white/30">Future AI activity tracking ready</p>
      </div>

      <div className="p-4">
        <ol className="relative space-y-4 border-l border-white/[0.06] pl-4">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <li key={event.id} className="relative">
                <div className="absolute -left-[1.3125rem] flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-brand-surface-2">
                  <Icon className={cn('h-2.5 w-2.5', event.color)} />
                </div>
                <p className="text-xs text-white/60">{event.label}</p>
                <p className="mt-0.5 text-2xs text-white/25">{timeAgo(event.time)}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 rounded-lg border border-dashed border-white/[0.08] p-3">
          <p className="text-center text-2xs text-white/20">
            AI-powered activity tracking · WhatsApp events · Call logs — coming soon
          </p>
        </div>
      </div>
    </AdminCard>
  );
}
