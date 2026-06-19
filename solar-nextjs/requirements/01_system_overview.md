# 01 — System Overview & Architecture

## 1.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14+ (App Router) | SSR, routing, API routes |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State** | Zustand | Lightweight client state |
| **Forms** | React Hook Form + Zod | Form handling + validation |
| **Tables** | TanStack Table (React Table v8) | Data tables with sort/filter/paginate |
| **Charts** | Recharts | Dashboard visualizations |
| **Backend** | Supabase | PostgreSQL, Auth, Storage, Edge Functions |
| **Auth** | Supabase Auth | Email/password, role-based access |
| **File Storage** | Supabase Storage | Documents, photos, PDFs |
| **PDF Generation** | @react-pdf/renderer or jsPDF | Quotations, reports |
| **Notifications** | Sonner (toast) | In-app toast notifications |
| **Icons** | Lucide React | Consistent icon set |
| **Date Handling** | date-fns | Date formatting/manipulation |

---

## 1.2 Application Architecture

### Route Structure (Next.js App Router)

```
src/app/
├── (public)/                    # Public website (existing)
│   └── [locale]/
│       ├── page.tsx             # Landing page
│       ├── about/
│       ├── contact/
│       └── ...
│
├── (admin)/                     # CRM Application
│   └── admin/
│       ├── layout.tsx           # CRM shell (sidebar + header)
│       ├── page.tsx             # Redirect to dashboard
│       ├── login/               # Auth
│       │
│       ├── dashboard/           # [OVERVIEW]
│       │   └── page.tsx
│       │
│       ├── leads/               # [BUSINESS DEVELOPMENT]
│       │   ├── page.tsx         # Leads list
│       │   └── [id]/page.tsx    # Lead detail
│       │
│       ├── web-leads/
│       │   └── page.tsx
│       │
│       ├── customers/
│       │   ├── page.tsx         # Customer list
│       │   └── [id]/page.tsx    # Customer detail (tabs: info, survey, quotation)
│       │
│       ├── registration/        # [PROJECT LIFECYCLE]
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       │
│       ├── kit-ready/
│       │   └── page.tsx
│       │
│       ├── dispatch/
│       │   └── page.tsx
│       │
│       ├── fabrication/
│       │   └── page.tsx
│       │
│       ├── wiring/
│       │   └── page.tsx
│       │
│       ├── final-stage/
│       │   └── page.tsx
│       │
│       ├── inventory/           # [LOGISTICS & STORES]
│       │   └── page.tsx
│       │
│       ├── wiring-inventory/
│       │   └── page.tsx
│       │
│       ├── fleet/
│       │   └── page.tsx
│       │
│       ├── commissions/         # [FINANCE]
│       │   └── page.tsx
│       │
│       ├── supervisor-commissions/
│       │   └── page.tsx
│       │
│       ├── fabricator-commissions/
│       │   └── page.tsx
│       │
│       ├── cost-analysis/
│       │   └── page.tsx
│       │
│       ├── completed/           # [AFTER SALES]
│       │   └── page.tsx
│       │
│       ├── maintenance/
│       │   └── page.tsx
│       │
│       ├── backup/              # [SYSTEM]
│       │   └── page.tsx
│       │
│       ├── users/
│       │   └── page.tsx
│       │
│       └── settings/
│           └── page.tsx
│
└── api/                         # API routes (if needed)
    └── ...
```

---

## 1.3 User Roles & Permissions

### `[BASELINE]` Role Definitions

| Role | Code | Access Level |
|------|------|-------------|
| **Super Admin** | `super_admin` | Full system access, user management, backup, settings |
| **Admin** | `admin` | Full CRM access except system settings |
| **Source (Sales Agent)** | `source` | Leads, Customers, limited lifecycle view |
| **Supervisor** | `supervisor` | Final Stage, own commissions, limited view |
| **Technician** | `technician` | Wiring tasks, own assignments |
| **Fabricator** | `fabricator` | Fabrication tasks, own commissions |

### `[NEW]` Permission Matrix `[P1]`

| Module | Super Admin | Admin | Source | Supervisor | Technician | Fabricator |
|--------|:-----------:|:-----:|:------:|:----------:|:----------:|:----------:|
| Dashboard | ✅ Full | ✅ Full | ✅ Own stats | ✅ Own stats | ❌ | ❌ |
| Leads | ✅ CRUD | ✅ CRUD | ✅ CRUD (own) | ❌ | ❌ | ❌ |
| Web Leads | ✅ CRUD | ✅ CRUD | ✅ Read | ❌ | ❌ | ❌ |
| Customers | ✅ CRUD | ✅ CRUD | ✅ Read (own) | ✅ Read (assigned) | ❌ | ❌ |
| Registration | ✅ CRUD | ✅ CRUD | ✅ Read | ❌ | ❌ | ❌ |
| Kit Ready | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ❌ | ❌ |
| Dispatch | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ❌ | ❌ |
| Fabrication | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ❌ | ✅ Own tasks |
| Wiring | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ✅ Own tasks | ❌ |
| Final Stage | ✅ CRUD | ✅ CRUD | ❌ | ✅ Own tasks | ❌ | ❌ |
| Inventory | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ❌ | ❌ |
| Wiring Inventory | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ✅ Read | ❌ |
| Fleet | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ❌ | ❌ |
| Commissions | ✅ CRUD | ✅ CRUD | ✅ Read (own) | ✅ Read (own) | ❌ | ✅ Read (own) |
| Cost Analysis | ✅ Read | ✅ Read | ❌ | ❌ | ❌ | ❌ |
| Completed | ✅ Read | ✅ Read | ❌ | ✅ Read | ❌ | ❌ |
| Maintenance | ✅ CRUD | ✅ CRUD | ❌ | ❌ | ✅ Own tasks | ❌ |
| Backup | ✅ Full | ❌ | ❌ | ❌ | ❌ | ❌ |
| Users | ✅ CRUD | ❌ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ Full | ✅ Read | ❌ | ❌ | ❌ | ❌ |

---

## 1.4 Non-Functional Requirements

### Performance `[P0]`
- Page load time: < 2 seconds on 4G
- Dashboard render: < 3 seconds with full data
- Table pagination: 25/50/100 rows per page
- Search response: < 500ms debounced
- Lighthouse score: > 80 (Performance)

### Security `[P0]`
- Supabase RLS on every table
- HTTPS only
- Password minimum: 8 characters
- Session timeout: 24 hours
- Input sanitization on all forms
- CSRF protection via Next.js

### Reliability `[P0]`
- Supabase auto-backups (daily)
- Manual backup trigger (SQL dump to cloud)
- Error boundaries on all pages
- Graceful error handling with user-friendly messages

### Scalability `[P1]`
- Support up to 10,000 leads
- Support up to 5,000 customers
- Support up to 50 concurrent users
- Support up to 500 inventory items

### Accessibility `[P1]`
- Keyboard navigable
- Screen reader compatible
- Color contrast ratio: 4.5:1 minimum
- Focus indicators on all interactive elements

### Responsiveness `[P0]`
- Desktop: Full sidebar + content layout
- Tablet (768px-1024px): Collapsible sidebar
- Mobile (< 768px): Bottom tab nav or hamburger menu
- All modals: Responsive, scrollable on mobile
