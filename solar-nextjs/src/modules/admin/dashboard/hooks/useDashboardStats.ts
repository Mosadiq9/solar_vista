'use client';

import { useMemo } from 'react';
import { useAdminStore } from '@/modules/admin/store/adminStore';
import { formatCurrency } from '@/lib/utils';

export function useDashboardStats() {
  const { stats, leads } = useAdminStore();

  const metrics = useMemo(
    () => [
      {
        id: 'total-leads',
        label: 'Total Leads',
        value: stats.totalLeads,
        change: +12.5,
        positive: true,
        icon: 'Users',
        color: 'primary' as const,
      },
      {
        id: 'new-leads',
        label: 'New This Week',
        value: stats.newLeads,
        change: +8.3,
        positive: true,
        icon: 'UserPlus',
        color: 'accent' as const,
      },
      {
        id: 'converted',
        label: 'Converted',
        value: stats.convertedLeads,
        change: +5.1,
        positive: true,
        icon: 'CheckCircle',
        color: 'accent' as const,
      },
      {
        id: 'conversion-rate',
        label: 'Conversion Rate',
        value: `${stats.conversionRate}%`,
        change: -1.2,
        positive: false,
        icon: 'TrendingUp',
        color: 'primary' as const,
      },
      {
        id: 'active-projects',
        label: 'Active Projects',
        value: stats.activeProjects,
        change: +3.0,
        positive: true,
        icon: 'Zap',
        color: 'accent' as const,
      },
      {
        id: 'revenue',
        label: 'Total Revenue',
        value: formatCurrency(stats.totalRevenue),
        change: +18.7,
        positive: true,
        icon: 'IndianRupee',
        color: 'primary' as const,
      },
    ],
    [stats]
  );

  const recentLeads = useMemo(
    () => [...leads].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [leads]
  );

  const pendingFollowUps = useMemo(
    () => leads.filter((l) => l.followUpAt && l.followUpAt <= Date.now()),
    [leads]
  );

  return { metrics, recentLeads, pendingFollowUps, stats };
}
