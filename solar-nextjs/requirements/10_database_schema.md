# 10 — Database Schema & Backend Architecture

> Covers: Complete Entity-Relationship Model, Supabase setup, RPCs, and RLS Policies

---

## 10.1 Complete ER Diagram Summary

The database is built on PostgreSQL (hosted via Supabase) utilizing strict foreign key constraints and ENUM types for data integrity.

**Core Entities:**
1. `admin_users` (Auth)
2. `leads` ↔ `web_leads`
3. `customers` (Central Hub)
4. `project_stages` (Lifecycle)
5. `inventory` ↔ `wiring_inventory`
6. `kit_bom` (Join table between Customers and Inventory)
7. `service_providers` (Workers/Fleet)
8. `commissions` (Finance)
9. `project_costs` (Finance)
10. `activity_logs` (Audit)
11. `notifications` (Comms)

---

## 10.2 Row Level Security (RLS) Matrix `[P0]`

Security is enforced at the database level using Supabase RLS policies. Every table will have policies defined based on the user's `role` from the `admin_users` table.

| Table | Policy (SELECT) | Policy (INSERT) | Policy (UPDATE) | Policy (DELETE) |
|-------|-----------------|-----------------|-----------------|-----------------|
| `leads` | Admin/Super = All<br>Source = Own | Admin/Super = All<br>Source = Own | Admin/Super = All<br>Source = Own | Admin/Super = All |
| `customers` | Admin/Super = All<br>Source/Provider = Assigned | Admin/Super = All | Admin/Super = All | Super Admin Only |
| `inventory` | Admin/Super = All<br>Others = Read Only | Admin/Super = All | Admin/Super = All | Super Admin Only |
| `commissions` | Admin/Super = All<br>Recipient = Own | System RPC Only | Admin/Super = All | Super Admin Only |
| `project_costs`| Super Admin Only | System RPC Only | System RPC Only | Super Admin Only |

---

## 10.3 Required RPC Functions (Stored Procedures) `[P1]`

Instead of doing complex multi-table updates in the frontend, we use Supabase RPCs (Remote Procedure Calls) to ensure transactional integrity.

| Function Name | Purpose | Behavior |
|---------------|---------|----------|
| `convert_lead_to_customer(lead_id)` | Creates Customer | Reads lead data, creates customer row, creates initial project_stage row, updates lead status, logs activity. |
| `deduct_kit_inventory(customer_id, items_json)` | BOM Management | Loops through items, checks stock >= qty, deducts stock, writes to `kit_bom`, writes to `stock_transactions`. If any stock fails, rolls back entirely. |
| `generate_commission(customer_id, type, provider_id)` | Finance | Calculates system_kw * rate, creates pending entry in `commissions` table. |
| `calculate_project_costs(customer_id)` | Profitability | Sums kit_bom + wiring + commissions + extra_costs and updates `project_costs` row. |

---

## 10.4 Supabase Storage Buckets `[P0]`

File storage is handled by Supabase Storage with the following buckets:

| Bucket Name | Access | Purpose |
|-------------|--------|---------|
| `customer-documents` | Private (Auth required) | Site surveys, Aadhar cards, electricity bills |
| `quotations` | Public (Read-only URLs) | Generated PDF quotations for sharing via WhatsApp |
| `inventory-images` | Public | Photos of panels/inverters for the UI |
| `user-avatars` | Public | Profile pictures for staff |

---

## 10.5 Deployment Strategy

1. Provide raw `.sql` files for table creation, enums, triggers, and RPCs.
2. The user will execute these in the **Supabase SQL Editor**.
3. Generate TypeScript types using Supabase CLI: `npx supabase gen types typescript --project-id XYZ > src/types/database.ts`
4. The Next.js frontend connects via `@supabase/ssr` (Server) and `@supabase/supabase-js` (Client).
