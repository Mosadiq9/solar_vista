'use client';

import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Target,
  MessageSquare,
  GitBranch,
  Brain,
} from 'lucide-react';
import { AdminCard, AdminCardHeader } from '@/modules/admin/shared/components/ui/AdminCard';

interface PlaceholderChartProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  comingSoon?: string;
}

function PlaceholderChart({
  title,
  description,
  icon: Icon,
  color,
  comingSoon,
}: PlaceholderChartProps) {
  return (
    <AdminCard padding="md" className="relative overflow-hidden">
      <AdminCardHeader
        title={title}
        description={description}
        icon={<Icon className="h-4 w-4" />}
        action={
          comingSoon ? (
            <span className="rounded-full border border-brand-primary/20 px-2.5 py-0.5 text-2xs text-brand-primary/60">
              {comingSoon}
            </span>
          ) : undefined
        }
      />
      {/* Chart placeholder bars */}
      <div className="mt-5 flex h-24 items-end justify-between gap-1.5">
        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm opacity-30"
            style={{
              height: `${h}%`,
              background: `linear-gradient(to top, ${color}60, ${color}20)`,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/25">Jan — Dec 2025</p>
        <p className="text-xs font-medium text-white/20">Data pipeline ready</p>
      </div>
    </AdminCard>
  );
}

const ANALYTICS_MODULES = [
  {
    title: 'Lead Volume',
    description: 'Daily and weekly lead acquisition trends',
    icon: Users,
    color: '#F5A623',
    comingSoon: 'Live soon',
  },
  {
    title: 'Conversion Funnel',
    description: 'Lead → Qualified → Converted pipeline analysis',
    icon: Target,
    color: '#00E676',
    comingSoon: 'Live soon',
  },
  {
    title: 'Source Attribution',
    description: 'Website, chatbot, WhatsApp, referral breakdown',
    icon: GitBranch,
    color: '#8B5CF6',
  },
  {
    title: 'Quote Analytics',
    description: 'Quote request volume, system sizes, acceptance rates',
    icon: Zap,
    color: '#06B6D4',
  },
  {
    title: 'Revenue Forecast',
    description: 'Monthly revenue pipeline and conversion projections',
    icon: TrendingUp,
    color: '#F5A623',
  },
  {
    title: 'Chatbot Engagement',
    description: 'Session volume, completion rate, handoff events',
    icon: MessageSquare,
    color: '#00E676',
  },
] as const;

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* AI readiness banner */}
      <div className="flex items-start gap-4 rounded-xl border border-brand-primary/15 bg-brand-primary/5 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
          <Brain className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold text-white">
            Analytics Infrastructure Ready
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Data pipeline architecture is in place. Connect your analytics provider (Plausible,
            PostHog, or custom) to activate real-time dashboards. All chart components are
            scaffolded and waiting for data streams.
          </p>
        </div>
      </div>

      {/* KPI summary row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Sessions', value: '—', sub: 'Awaiting tracker' },
          { label: 'Lead Conv. Rate', value: '—', sub: 'Awaiting data' },
          { label: 'Avg. Lead Score', value: '72', sub: 'From mock data' },
          { label: 'Top Source', value: 'Website', sub: 'From lead data' },
        ].map((kpi) => (
          <AdminCard key={kpi.label} padding="md">
            <p className="text-2xs text-white/30">{kpi.label}</p>
            <p className="mt-1.5 font-display text-2xl font-bold text-white">{kpi.value}</p>
            <p className="mt-0.5 text-2xs text-white/20">{kpi.sub}</p>
          </AdminCard>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {ANALYTICS_MODULES.map((mod) => (
          <PlaceholderChart key={mod.title} {...mod} />
        ))}
      </div>

      {/* Integration guide */}
      <AdminCard padding="md">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-brand-primary" />
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              Recommended Analytics Stack
            </h3>
            <p className="mt-0.5 text-xs text-white/40">
              Plausible (privacy-first) · PostHog (product analytics) · Supabase Functions (custom
              events)
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
