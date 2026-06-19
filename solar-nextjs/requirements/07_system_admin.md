# 07 — System Administration & Settings

> Covers: User Management, Roles, Backup, System Configuration, Audit Logging

---

## 7.1 User Management

**Route:** `/admin/users`

### 7.1.1 User Directory `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-SYS-001** | **List View:** Table displaying all system users |
| **REQ-SYS-002** | **Columns:** Email, Status (Enabled/Disabled toggle), Role, Actions (Edit/Delete) |
| **REQ-SYS-003** | **Create User Modal:** Fields for Email Address, Role (Dropdown), Password, Confirm Password |
| **REQ-SYS-004** | **Link to Technician/Provider:** If role is Technician or Fabricator, allow linking the user account to a specific entity in the `service_providers` registry |
| **REQ-SYS-005** | **Authentication:** Integration with Supabase Auth for login/session management |

### 7.1.2 Enhanced Security `[NEW]`

| Requirement | Priority | Details |
|-------------|----------|---------|
| **REQ-SYS-010** | `[P1]` | **Password Reset Flow:** standard forgot password email functionality via Supabase |
| **REQ-SYS-011** | `[P2]` | **2FA Support:** Enable Two-Factor Authentication via Authenticator app |

---

## 7.2 System Backup

**Route:** `/admin/backup`

### 7.2.1 Database Backup `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-SYS-020** | **Backup Dashboard:** Show Auto-Cloud status and access info |
| **REQ-SYS-021** | **Generate Backup Action:** Button to trigger a manual SQL dump of the database |
| **REQ-SYS-022** | **Backup History Table:** List of recent backups with creation timestamp |
| **REQ-SYS-023** | **Download Action:** Allow Super Admin to download the SQL backup file directly |
| **REQ-SYS-024** | **Implementation:** Since we use Supabase, we rely on Supabase's built-in Point-in-Time Recovery (PITR) or daily backups, but we will provide an admin UI to trigger/download pg_dump if needed via Edge Function. |

---

## 7.3 Audit & Logging `[NEW]`

**Route:** `/admin/audit-logs`

| Requirement | Priority | Details |
|-------------|----------|---------|
| **REQ-SYS-030** | `[P1]` | **Global Activity Log:** Centralized table showing EVERY action taken in the CRM |
| **REQ-SYS-031** | `[P1]` | **Log Structure:** Timestamp, User (Who), Action (Created/Updated/Deleted), Entity (Lead/Customer/Cost), Details (What changed) |
| **REQ-SYS-032** | `[P1]` | **Filtering:** Filter logs by User, Entity Type, Date range |
| **REQ-SYS-033** | `[P1]` | **Financial Audit:** Strict logging of any changes to Commissions or Project Costs |

---

## 7.4 System Configuration

**Route:** `/admin/settings`

### 7.4.1 Global Settings `[NEW]` `[P1]`

| Requirement | Details |
|-------------|---------|
| **REQ-SYS-040** | **Company Profile:** Company Name, Logo, Address, GST Number, Contact Info (used for Quotation PDF generation) |
| **REQ-SYS-041** | **Default Commission Rates:** Define default ₹/KW for Fabricators and Supervisors |
| **REQ-SYS-042** | **Theme Settings:** Toggle Dark/Light mode default |
| **REQ-SYS-043** | **Tax Rates:** Define default GST percentages for various component categories |

---

## 7.5 Database Schema (System Admin)

### `admin_users` table (Extends Supabase `auth.users`)
```sql
-- Tied to Supabase Auth via trigger
- id (uuid, PK, references auth.users)
- created_at (timestamptz)
- email (text, UNIQUE)
- full_name (text)
- role (enum: super_admin, admin, source, supervisor, technician, fabricator)
- is_active (boolean, default true)
- provider_link_id (uuid, nullable) -- Links to service_providers table
```

### `system_settings` table (Key-Value store)
```sql
- id (text, PK) -- e.g., 'company_info', 'default_rates'
- value (jsonb)
- updated_at (timestamptz)
- updated_by (uuid, FK → users.id)
```

### Supabase Architecture Note:
- Use **Row Level Security (RLS)** strictly based on the `role` defined in the `admin_users` table.
- Use Supabase Auth triggers to automatically create `admin_users` records when an auth user is created.
