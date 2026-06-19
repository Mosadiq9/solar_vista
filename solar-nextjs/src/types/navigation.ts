// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string;
  external?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
