'use client';

import { useDashboardStats } from '@/modules/admin/dashboard/hooks/useDashboardStats';
import { StatCard } from './StatCard';
import { RecentLeads } from './RecentLeads';
import { QuickActions } from './QuickActions';
import { AdminCard } from '@/modules/admin/shared/components/ui/AdminCard';
import { AlertCircle, Clock } from 'lucide-react';

export function DashboardOverview() {
  const { metrics, recentLeads, pendingFollowUps, stats } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Pending follow-ups alert */}
      {pendingFollowUps.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-brand-primary" />
          <p className="text-sm text-white/70">
            <span className="font-semibold text-brand-primary">
              {pendingFollowUps.length} leads
            </span>{' '}
            are overdue for follow-up.
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <StatCard key={m.id} {...m} />
        ))}
      </div>

      {/* Main content row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent leads — takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentLeads leads={recentLeads} />
        </div>

        {/* Quick actions + chatbot stats */}
        <div className="flex flex-col gap-4">
          <QuickActions />

          {/* Chatbot sessions mini-stat */}
          <AdminCard padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40">Chatbot Sessions</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {stats.chatbotSessions}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10">
                <Clock className="h-5 w-5 text-brand-accent" />
              </div>
            </div>
            <p className="mt-3 text-2xs text-white/25">AI chatbot ready for activation</p>
            <div className="mt-2 h-1 rounded-full bg-white/5">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-brand-primary/40 to-brand-accent/40" />
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Conversion funnel placeholder */}
      <AdminCard padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold text-white">Conversion Funnel</h3>
            <p className="mt-0.5 text-xs text-white/35">Lead pipeline overview</p>
          </div>
          <span className="rounded-full border border-brand-primary/20 px-2.5 py-0.5 text-xs text-brand-primary/70">
            Analytics coming soon
          </span>
        </div>

        <div className="mt-4 flex items-end gap-2">
          {[
            { label: 'New', count: stats.newLeads, pct: 100 },
            { label: 'Contacted', count: 34, pct: 72 },
            { label: 'Qualified', count: 22, pct: 47 },
            { label: 'Proposal', count: 18, pct: 38 },
            { label: 'Converted', count: stats.convertedLeads, pct: 25 },
          ].map((stage) => (
            <div key={stage.label} className="flex flex-1 flex-col items-center gap-1.5">
              <p className="font-display text-base font-bold text-white">{stage.count}</p>
              <div
                className="w-full rounded-t-sm bg-brand-primary/5"
                style={{ height: `${stage.pct * 0.8}px` }}
              >
                <div className="h-full w-full rounded-t-sm bg-gradient-to-t from-brand-primary/30 to-brand-primary/60 transition-all duration-700" />
              </div>
              <p className="text-2xs text-white/35">{stage.label}</p>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
