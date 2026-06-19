'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Star,
  HelpCircle,
  BarChart3,
  Settings,
  GitBranch,
  UserCog,
  ChevronLeft,
  Sun,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminUIStore } from '@/modules/admin/shared/store/adminUIStore';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  roles: string[]; // RBAC
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const ALL_ROLES = ['super_admin', 'sales', 'logistics', 'installer'];

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ALL_ROLES }
    ],
  },
  {
    label: 'Business Dev',
    items: [
      { href: '/admin/leads', label: 'Leads', icon: Users, roles: ['super_admin', 'sales'] },
      { href: '/admin/web-leads', label: 'Web Leads', icon: Users, roles: ['super_admin', 'sales'] },
      { href: '/admin/customers', label: 'Customers', icon: Briefcase, roles: ['super_admin', 'sales'] },
    ],
  },
  {
    label: 'Lifecycle',
    items: [
      { href: '/admin/registration', label: 'Registration', icon: FileText, roles: ['super_admin', 'sales'] },
      { href: '/admin/kit-ready', label: 'Kit Ready', icon: Zap, roles: ['super_admin', 'logistics'] },
      { href: '/admin/dispatch', label: 'Dispatch', icon: Zap, roles: ['super_admin', 'logistics'] },
      { href: '/admin/fabrication', label: 'Fabrication', icon: GitBranch, roles: ['super_admin', 'installer'] },
      { href: '/admin/wiring', label: 'Wiring', icon: Zap, roles: ['super_admin', 'installer'] },
      { href: '/admin/final-stage', label: 'Final Stage', icon: Star, roles: ['super_admin', 'installer', 'sales'] },
    ],
  },
  {
    label: 'Logistics & Stores',
    items: [
      { href: '/admin/inventory', label: 'Master Inventory', icon: FileText, roles: ['super_admin', 'logistics'] },
      { href: '/admin/wiring-inventory', label: 'Wiring Stock', icon: Zap, roles: ['super_admin', 'logistics', 'installer'] },
      { href: '/admin/fleet', label: 'Fleet Management', icon: Briefcase, roles: ['super_admin', 'logistics'] },
    ],
  },
  {
    label: 'Finance',
    items: [
      { href: '/admin/commissions', label: 'Commissions', icon: BarChart3, roles: ['super_admin'] },
      { href: '/admin/cost-analysis', label: 'Cost Analysis', icon: BarChart3, roles: ['super_admin'] },
    ],
  },
  {
    label: 'After Sales',
    items: [
      { href: '/admin/completed', label: 'Completed Portfolio', icon: Star, roles: ['super_admin', 'sales'] },
      { href: '/admin/maintenance', label: 'Maintenance', icon: Settings, roles: ['super_admin', 'installer', 'sales'] },
      { href: '/admin/tickets', label: 'Support Tickets', icon: HelpCircle, roles: ['super_admin', 'sales'] },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/staff', label: 'Staff Directory', icon: UserCog, roles: ['super_admin'] },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText, roles: ['super_admin'] },
      { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['super_admin'] },
    ],
  },
];

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}

function SidebarItem({ item, collapsed, active }: NavItemProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150',
        active
          ? 'bg-brand-primary/10 text-brand-primary'
          : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          active ? 'text-brand-primary' : 'text-white/35 group-hover:text-white/60'
        )}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge ? (
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary/15 px-1 text-2xs font-semibold text-brand-primary">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

import { useAuthStore } from '@/modules/crm/auth/store/useAuthStore';
import { RoleSwitcher } from '@/modules/crm/auth/components/RoleSwitcher';

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAdminUIStore();
  const { currentUser } = useAuthStore();

  const isActive = (href: string) =>
    href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href);

  // Filter groups and items based on the active user's role
  const filteredGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => currentUser && item.roles.includes(currentUser.role))
  })).filter(group => group.items.length > 0);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-fixed flex flex-col border-r border-white/[0.06] bg-brand-surface',
        'ease-out-expo transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-white/[0.06]',
          sidebarCollapsed ? 'justify-center px-3' : 'gap-2.5 px-4'
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15">
          <Sun className="h-4 w-4 text-brand-primary" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-xs font-bold tracking-wide text-white">
              CHAUHAN SOLAR
            </p>
            <p className="text-2xs text-white/30">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Role Switcher */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <RoleSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="scrollbar-hide flex-1 overflow-y-auto overflow-x-hidden py-3">
        {filteredGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!sidebarCollapsed && (
              <p className="mb-1 px-3 text-2xs font-semibold uppercase tracking-widest text-white/20">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5 px-2">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  collapsed={sidebarCollapsed}
                  active={isActive(item.href)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer — quick energy stat */}
      {!sidebarCollapsed && (
        <div className="mx-3 mb-3 rounded-lg border border-brand-accent/15 bg-brand-accent/5 p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-brand-accent" />
            <p className="text-xs font-medium text-brand-accent">47 Active Projects</p>
          </div>
          <p className="mt-0.5 text-2xs text-white/30">Powering Gujarat & beyond</p>
        </div>
      )}

      {/* Collapse toggle */}
      <div
        className={cn(
          'border-t border-white/[0.06] p-2',
          sidebarCollapsed && 'flex justify-center'
        )}
      >
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-8 w-full items-center justify-center gap-2 rounded-lg text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              sidebarCollapsed && 'rotate-180'
            )}
          />
          {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
