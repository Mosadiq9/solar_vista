'use client';

import {
  GitBranch,
  Zap,
  MessageSquare,
  Brain,
  Bell,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';

interface WorkflowTemplate {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  icon: React.ElementType;
  color: string;
  status: 'ready' | 'ai-required';
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'new-lead-whatsapp',
    name: 'New Lead → WhatsApp',
    trigger: 'New lead submitted',
    actions: ['Send WhatsApp greeting', 'Assign to sales'],
    icon: MessageSquare,
    color: 'text-brand-accent',
    status: 'ready',
  },
  {
    id: 'lead-followup',
    name: 'Follow-Up Reminder',
    trigger: 'Lead idle for 24h',
    actions: ['Create reminder', 'Send push notification'],
    icon: Bell,
    color: 'text-brand-primary',
    status: 'ready',
  },
  {
    id: 'proposal-sent',
    name: 'Proposal Sent Sequence',
    trigger: 'Status → Proposal Sent',
    actions: ['Send proposal email', 'Schedule 3-day follow-up'],
    icon: CalendarClock,
    color: 'text-blue-400',
    status: 'ready',
  },
  {
    id: 'ai-lead-scoring',
    name: 'AI Lead Scoring',
    trigger: 'New lead created',
    actions: ['Analyze bill & location', 'Score 0–100', 'Auto-prioritize queue'],
    icon: Brain,
    color: 'text-violet-400',
    status: 'ai-required',
  },
  {
    id: 'ai-quote-generation',
    name: 'AI Quote Generation',
    trigger: 'Lead qualified',
    actions: ['Calculate system size', 'Generate PDF quote', 'Send via WhatsApp'],
    icon: Zap,
    color: 'text-brand-primary',
    status: 'ai-required',
  },
];

export function WorkflowsPlaceholder() {
  return (
    <div className="space-y-6">
      {/* Architecture banner */}
      <div className="flex items-start gap-4 rounded-xl border border-brand-primary/15 bg-brand-primary/5 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
          <GitBranch className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-white">
            Workflow Automation Engine — Ready for Activation
          </h3>
          <p className="mt-1 text-sm text-white/50">
            The automation architecture is fully designed. Connect Supabase Edge Functions, WhatsApp
            Business API, and AI services to activate these workflows. No rebuilding required — just
            connect and enable.
          </p>
        </div>
      </div>

      {/* Workflow templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {WORKFLOW_TEMPLATES.map((wf) => {
          const Icon = wf.icon;
          return (
            <AdminCard key={wf.id} padding="md" className="relative">
              {wf.status === 'ai-required' && (
                <div className="bg-violet-500/8 absolute right-3 top-3 rounded-full border border-violet-500/20 px-2 py-0.5 text-2xs text-violet-400">
                  AI Required
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className={`h-4 w-4 ${wf.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-sm font-semibold text-white">{wf.name}</h3>
                  <p className="mt-0.5 text-xs text-white/40">Trigger: {wf.trigger}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {wf.actions.map((action, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 shrink-0 text-white/15" />
                    <span className="text-xs text-white/50">{action}</span>
                  </div>
                ))}
              </div>
              <button
                disabled
                className="border-white/8 mt-4 w-full cursor-not-allowed rounded-lg border py-2 text-xs font-medium text-white/25"
              >
                Configure →
              </button>
            </AdminCard>
          );
        })}
      </div>

      {/* Integration guide */}
      <AdminCard padding="md">
        <h3 className="font-display text-sm font-semibold text-white">Integration Checklist</h3>
        <div className="mt-3 space-y-2">
          {[
            { item: 'Supabase Edge Functions', status: 'Ready to scaffold' },
            { item: 'WhatsApp Business API (360Dialog / WATI)', status: 'API keys required' },
            { item: 'Email provider (Resend / SendGrid)', status: 'API keys required' },
            { item: 'AI scoring engine (Claude API)', status: 'Architecture ready' },
            { item: 'Push notifications (web-push)', status: 'Ready to implement' },
          ].map(({ item, status }) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm text-white/60">{item}</span>
              <span className="text-xs text-brand-primary/70">{status}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
