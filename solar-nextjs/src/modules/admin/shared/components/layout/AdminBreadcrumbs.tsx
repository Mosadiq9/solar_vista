'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  crm: 'Leads',
  blog: 'Blog',
  new: 'New',
  projects: 'Projects',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  analytics: 'Analytics',
  users: 'Users',
  settings: 'Settings',
  workflows: 'Workflows',
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = SEGMENT_LABELS[seg] ?? (seg.length === 24 ? 'Detail' : seg);
    const isLast = i === segments.length - 1;
    return { href, label, isLast, key: `${seg}-${i}` };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
      <Link
        href="/admin/dashboard"
        className="shrink-0 text-white/30 transition-colors hover:text-white/60"
        aria-label="Dashboard"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.slice(1).map((crumb) => (
        <span key={crumb.key} className="flex min-w-0 items-center gap-1">
          <ChevronRight className="h-3 w-3 shrink-0 text-white/15" />
          {crumb.isLast ? (
            <span className="truncate text-xs font-medium text-white/70">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="truncate text-xs text-white/30 transition-colors hover:text-white/60"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
