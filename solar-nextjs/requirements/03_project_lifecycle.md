# 03 — Project Lifecycle Module

> Covers: Registration, Kit Ready, Dispatch, Fabrication, Wiring, Final Stage

The Project Lifecycle module tracks the physical execution of a solar installation. A customer project moves sequentially through these 6 stages.

---

## 3.1 Registration (Stage 1)

**Route:** `/admin/registration`

| Requirement | Details |
|-------------|---------|
| **REQ-LF-001** | **List View:** Display projects currently in the "Registration" stage |
| **REQ-LF-002** | **Columns:** Customer Name, Phone, Portal Status, Application ID, KW, Actions |
| **REQ-LF-003** | **Detail View:** Registration details modal or page |
| **REQ-LF-004** | Fields: Portal Name, Login ID, Password, Registration Date, Approval Status |
| **REQ-LF-005** | **Subsidy Info Tab:** Track PM-KUSUM or State Subsidy status |
| **REQ-LF-006** | Subsidy fields: Expected Amount, Approved Amount, Received Amount, Disbursal Date |
| **REQ-LF-007** | **DISCOM Integration `[P2]`**: Option to integrate with state DISCOM API to pull status automatically |
| **REQ-LF-008** | **Action:** "Move to Kit Ready" button — advances project to Stage 2 |

---

## 3.2 Kit Ready (Stage 2)

**Route:** `/admin/kit-ready`

| Requirement | Details |
|-------------|---------|
| **REQ-LF-010** | **List View:** Display projects in "Kit Ready" stage |
| **REQ-LF-011** | **Columns:** Customer Name, KW, Kit Status (Pending/Assembled), Actions |
| **REQ-LF-012** | **Kit Builder Modal:** UI to select components required for this specific installation |
| **REQ-LF-013** | **BOM Generation:** Select from Master Inventory (Panels, Inverter, Structure, Wire, BOS) |
| **REQ-LF-014** | Show current available stock next to each item during selection |
| **REQ-LF-015** | **Stock Deduction `[P0]`**: Upon finalizing the kit, automatically deduct quantities from Master Inventory |
| **REQ-LF-016** | **Cost Calculation:** Auto-calculate the total material cost for this project based on selected kit |
| **REQ-LF-017** | **Action:** "Move to Dispatch" button — advances project to Stage 3 |

---

## 3.3 Dispatch (Stage 3)

**Route:** `/admin/dispatch`

| Requirement | Details |
|-------------|---------|
| **REQ-LF-020** | **List View:** Display projects in "Dispatch" stage |
| **REQ-LF-021** | **Driver Directory:** Manage list of drivers (Add/Edit/Delete Driver: Name, Phone, License) |
| **REQ-LF-022** | **Assign Dispatch:** Modal to assign a Driver and a Vehicle (from Fleet) to a project delivery |
| **REQ-LF-023** | **Dispatch Status:** Scheduled, In Transit, Delivered |
| **REQ-LF-024** | **Delivery Notes `[P1]`**: Capture POD (Proof of Delivery) photo or signature upon arrival |
| **REQ-LF-025** | **Action:** "Move to Fabrication" button — advances project to Stage 4 |

---

## 3.4 Fabrication (Stage 4)

**Route:** `/admin/fabrication`

| Requirement | Details |
|-------------|---------|
| **REQ-LF-030** | **List View:** Display projects in "Fabrication" stage |
| **REQ-LF-031** | **Fabricator Registry:** Manage list of external or internal fabricators |
| **REQ-LF-032** | Fabricator fields: Name, Phone, Default Rate per KW (₹) |
| **REQ-LF-033** | **Assign Fabricator:** Modal to select a fabricator for the project |
| **REQ-LF-034** | **Commission Trigger `[P0]`**: Assigning a fabricator automatically creates a pending commission entry in the Finance module based on their Rate × System KW |
| **REQ-LF-035** | **Fabrication Status:** Pending, In Progress, Completed |
| **REQ-LF-036** | **Quality Check `[P1]`**: Require upload of 2+ structure photos before marking completed |
| **REQ-LF-037** | **Action:** "Move to Wiring" button — advances project to Stage 5 |

---

## 3.5 Wiring (Stage 5)

**Route:** `/admin/wiring`

| Requirement | Details |
|-------------|---------|
| **REQ-LF-040** | **List View:** Display projects in "Wiring" stage |
| **REQ-LF-041** | **Technician Registry:** Manage list of electrical technicians |
| **REQ-LF-042** | Technician fields: Name, Phone, Certification Level, Status |
| **REQ-LF-043** | **Assign Technician:** Modal to select one or more technicians for the wiring job |
| **REQ-LF-044** | **Wiring Status:** Pending, In Progress, Testing, Completed |
| **REQ-LF-045** | **Safety Checklist `[P1]`**: Pre-wiring safety checklist mandatory before "In Progress" |
| **REQ-LF-046** | **Action:** "Move to Final Stage" button — advances project to Stage 6 |

---

## 3.6 Final Stage (Stage 6)

**Route:** `/admin/final-stage`

| Requirement | Details |
|-------------|---------|
| **REQ-LF-050** | **List View:** Display projects in "Final Stage" |
| **REQ-LF-051** | **Supervisor Registry:** Manage list of supervisors |
| **REQ-LF-052** | Supervisor fields: Name, Phone, Default Rate per KW (₹) |
| **REQ-LF-053** | **Assign Supervisor:** Modal to assign supervisor, triggering commission entry |
| **REQ-LF-054** | **Workflow Checklist (5 Steps):** Visual checklist UI for completion steps |
| **REQ-LF-055** | Step 1: **Approved** (NOC / Discom approval received) |
| **REQ-LF-056** | Step 2: **Fill DP** (Documentation packet complete) |
| **REQ-LF-057** | Step 3: **Inspection** (CEIG / Discom inspection passed) |
| **REQ-LF-058** | Step 4: **Solder** (Final connections & net meter installation) |
| **REQ-LF-059** | Step 5: **Submission** (Final handover to customer) |
| **REQ-LF-060** | **Status Update Modal:** Dropdown to mark each step Pending/Done |
| **REQ-LF-061** | **Action:** "Complete Project" button — moves customer to "Completed" (After Sales) and finalizes all pending commissions |

---

## 3.7 Database Schema (Project Lifecycle)

### `project_stages` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- customer_id (uuid, FK → customers.id)
- stage_name (enum: registration, kit_ready, dispatch, fabrication, wiring, final_stage, completed)
- status (enum: pending, in_progress, completed)
- started_at (timestamptz)
- completed_at (timestamptz)
- notes (text)
```

### `kit_bom` table (Bill of Materials)
```sql
- id (uuid, PK)
- customer_id (uuid, FK → customers.id)
- inventory_id (uuid, FK → inventory.id)
- quantity_used (numeric)
- unit_cost_at_time (numeric)
- total_cost (numeric)
```

### `service_providers` table (Unifies Drivers, Fabricators, Technicians, Supervisors)
```sql
- id (uuid, PK)
- created_at (timestamptz)
- type (enum: driver, fabricator, technician, supervisor)
- name (text, NOT NULL)
- phone (text)
- vehicle_id (uuid, FK → fleet.id, nullable) -- for drivers
- default_rate_per_kw (numeric) -- for fabricators/supervisors
- is_active (boolean, default true)
```

### `project_assignments` table
```sql
- id (uuid, PK)
- customer_id (uuid, FK → customers.id)
- stage (enum: dispatch, fabrication, wiring, final_stage)
- provider_id (uuid, FK → service_providers.id)
- assigned_at (timestamptz)
```

### `final_stage_checklists` table
```sql
- id (uuid, PK)
- customer_id (uuid, FK → customers.id, UNIQUE)
- is_approved (boolean, default false)
- is_fill_dp (boolean, default false)
- is_inspection (boolean, default false)
- is_solder (boolean, default false)
- is_submission (boolean, default false)
- updated_at (timestamptz)
```
