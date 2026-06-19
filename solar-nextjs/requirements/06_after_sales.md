# 06 — After Sales & Support Module

> Covers: Completed Projects Portfolio, Maintenance, Warranty Tracking, Customer Support

This module tracks the customer journey after the physical installation is complete, which is critical for referrals and recurring revenue.

---

## 6.1 Completed Projects Portfolio

**Route:** `/admin/completed`

### 6.1.1 Portfolio List `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-AFT-001** | **List View:** Display all projects that have passed the Final Stage |
| **REQ-AFT-002** | **KPI Banner:** Total Completed Project Count & Total Power Generation (Sum of KW) |
| **REQ-AFT-003** | **List Data:** Customer Name, Phone, Address, Install Date, Capacity (KW) |
| **REQ-AFT-004** | **Efficiency Metric:** Display project duration (Days taken from Registration to Completion) |
| **REQ-AFT-005** | **Filters:** Date range filter based on completion date |
| **REQ-AFT-006** | **Export:** "Export to Excel" button for the currently filtered list |
| **REQ-AFT-007** | **Detail View Access:** Click to view full customer history and documents |

---

## 6.2 Service & Maintenance `[NEW]`

**Route:** `/admin/maintenance`

*Note: This entire section is an enhancement over the baseline CRM to meet 2026 industry standards.*

### 6.2.1 Maintenance Scheduling `[NEW]` `[P1]`

| Requirement | Details |
|-------------|---------|
| **REQ-AFT-010** | **AMC Tracking:** Track Annual Maintenance Contract (AMC) status (Active, Expired, None) |
| **REQ-AFT-011** | **Schedule Maintenance:** Calendar UI to schedule panel cleaning or routine checkups |
| **REQ-AFT-012** | **Technician Assignment:** Assign service technicians to maintenance tasks |
| **REQ-AFT-013** | **Service Logs:** Record notes and photos of service visits |

### 6.2.2 Warranty Management `[NEW]` `[P1]`

| Requirement | Details |
|-------------|---------|
| **REQ-AFT-020** | **Component Warranties:** Track separate warranty periods for Panels (e.g., 25 yrs) and Inverters (e.g., 5-10 yrs) |
| **REQ-AFT-021** | **Warranty Claims:** Log if a component fails, track RMA process with manufacturer |
| **REQ-AFT-022** | **Expiry Alerts:** Notify admin 30 days before inverter warranty expires (upsell opportunity) |

---

## 6.3 Customer Support & Ticketing `[NEW]`

**Route:** `/admin/tickets`

### 6.3.1 Issue Tracking `[NEW]` `[P2]`

| Requirement | Details |
|-------------|---------|
| **REQ-AFT-030** | **Ticket System:** Allow creation of support tickets (e.g., "Inverter showing red light", "App not syncing") |
| **REQ-AFT-031** | **Ticket Status:** Open, In Progress, Resolved |
| **REQ-AFT-032** | **Priority Levels:** Low, Medium, High, Urgent |
| **REQ-AFT-033** | **Customer Self-Service:** Provide a public/authenticated portal for customers to log their own tickets |

---

## 6.4 Database Schema (After Sales)

### `maintenance_schedules` table
```sql
- id (uuid, PK)
- customer_id (uuid, FK → customers.id)
- scheduled_date (date)
- service_type (enum: routine_cleaning, inspection, repair)
- technician_id (uuid, FK → users.id)
- status (enum: scheduled, completed, missed)
- notes (text)
- completed_at (timestamptz)
```

### `warranties` table
```sql
- id (uuid, PK)
- customer_id (uuid, FK → customers.id)
- component (enum: panel, inverter, structure, workmanship)
- provider (text) -- Brand name
- serial_number (text)
- start_date (date)
- end_date (date)
- document_url (text)
```

### `support_tickets` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- ticket_number (text, UNIQUE) -- Auto-incrementing friendly ID like TK-1004
- customer_id (uuid, FK → customers.id)
- subject (text)
- description (text)
- priority (enum: low, medium, high, urgent)
- status (enum: open, in_progress, resolved)
- assigned_to (uuid, FK → users.id)
- resolved_at (timestamptz)
```
