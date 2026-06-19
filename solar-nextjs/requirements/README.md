# 📋 BHSquare Solar CRM — Requirements Specification

> **Project:** Solar Installation CRM for BHSquare  
> **Version:** v2.0 (New Build)  
> **Tech Stack:** Next.js 14+ (App Router) + Supabase (PostgreSQL + Auth + Storage)  
> **Created:** June 19, 2026  

---

## 📂 Requirements Folder Structure

| File | Purpose |
|------|---------|
| [01_system_overview.md](./01_system_overview.md) | Tech stack, architecture, user roles, non-functional requirements |
| [02_business_development.md](./02_business_development.md) | Leads, Web Leads, Customers — all sales pipeline features |
| [03_project_lifecycle.md](./03_project_lifecycle.md) | Registration, Kit Ready, Dispatch, Fabrication, Wiring, Final Stage |
| [04_logistics_and_stores.md](./04_logistics_and_stores.md) | Inventory, Wiring Inventory, Fleet Management |
| [05_finance.md](./05_finance.md) | Commissions (3 types), Cost Analysis, Revenue Tracking |
| [06_after_sales.md](./06_after_sales.md) | Completed Projects, Maintenance, Warranty, Support Tickets |
| [07_system_admin.md](./07_system_admin.md) | Users, Roles, Permissions, Backup, Audit Logs, Settings |
| [08_communication_and_notifications.md](./08_communication_and_notifications.md) | WhatsApp, Email, SMS, In-App Notifications |
| [09_analytics_and_dashboard.md](./09_analytics_and_dashboard.md) | Dashboard KPIs, Charts, Reports, Data Export |
| [10_database_schema.md](./10_database_schema.md) | Supabase tables, RLS policies, RPC functions, Storage buckets |
| [11_ui_ux_standards.md](./11_ui_ux_standards.md) | Design system, component library, responsive design, accessibility |

---

## 🏷️ Requirement Classification

Each requirement is tagged with:

| Tag | Meaning |
|-----|---------|
| `[BASELINE]` | Feature exists in the reference CRM (from screenshots) — **must** be replicated |
| `[ENHANCED]` | Feature exists but will be improved in our version |
| `[NEW]` | Brand new feature not in the reference CRM |
| `[P0]` | Critical — Must have for MVP launch |
| `[P1]` | Important — Should have within first 3 months |
| `[P2]` | Nice to have — Can be added later |

---

## 🎯 Scope Summary

### What We're Building
A **full-featured Solar Installation CRM** that includes:
- ✅ Everything from the reference BHSquare CRM (48 screens analyzed)
- ✅ Communication layer (WhatsApp, Email, SMS)
- ✅ Advanced dashboard with charts and analytics
- ✅ Workflow automation
- ✅ Activity/audit logging
- ✅ Responsive design (mobile-friendly)
- ✅ Proper form validation and UX polish

### Backend Strategy
- **Supabase** as the sole backend (PostgreSQL + Auth + Storage + Edge Functions)
- **RPC Functions** for complex business logic (commission calculations, stock deductions, etc.)
- **Row Level Security (RLS)** for role-based data access
- **Supabase Realtime** for live updates (optional, P2)
- **I will provide SQL/RPC code → You manually execute in Supabase Dashboard**

### What We're NOT Building (Out of Scope)
- ❌ Native mobile app (will be responsive web only for now)
- ❌ IoT integration for panel monitoring (future scope)
- ❌ Solar design tool (Aurora-level)
- ❌ Payment gateway integration
- ❌ Multi-tenant SaaS (single company use)
