# 02 — Business Development Module

> Covers: Leads, Web Leads, Customers (Sales Pipeline)

---

## 2.1 Leads Management

### 2.1.1 Leads List View `[BASELINE]` `[P0]`

**Route:** `/admin/leads`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-001** | Display all leads in a sortable, filterable data table |
| **REQ-BD-002** | Columns: Name, Phone, Address/City, Source, System KW, Status, Created Date, Assigned To |
| **REQ-BD-003** | Status badge colors: New (blue), Contacted (yellow), Qualified (green), Proposal (purple), Closed (dark green), Lost (red) |
| **REQ-BD-004** | Source tracking: Website, WhatsApp, Referral, Social, Direct, Manual |
| **REQ-BD-005** | Search by name, phone, or email |
| **REQ-BD-006** | "Add New Lead" button opens modal |

### 2.1.2 Add/Edit Lead Modal `[BASELINE]` `[P0]`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | Text input | ✅ | Min 2 chars |
| Phone | Phone input | ✅ | 10-digit Indian mobile (regex: `^[6-9]\d{9}$`) |
| Email | Email input | ❌ | Valid email format |
| Address | Textarea | ❌ | Max 500 chars |
| City | Text input | ❌ | - |
| State | Dropdown | ❌ | Indian states list |
| Source | Dropdown | ✅ | Enum: website, whatsapp, referral, social, direct, manual |
| System Capacity (KW) | Number input | ❌ | Min 1, Max 500, step 0.1 |
| Rooftop Area (sq ft) | Number input | ❌ | Min 50 |
| Monthly Bill (₹) | Number input | ❌ | Min 0 |
| Status | Dropdown | ✅ | Enum: new, contacted, qualified, proposal, closed, lost |
| Assigned To | Dropdown | ❌ | List of users with role=source |
| Notes | Textarea | ❌ | Max 2000 chars |

### 2.1.3 Lead Detail View `[ENHANCED]` `[P0]`

**Route:** `/admin/leads/[id]`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-007** | Full lead information card |
| **REQ-BD-008** | `[NEW]` Activity timeline showing all interactions (calls, notes, status changes) |
| **REQ-BD-009** | `[NEW]` Quick actions: Change Status, Assign To, Add Note, Convert to Customer |
| **REQ-BD-010** | `[NEW]` "Convert to Customer" button — auto-creates customer record from lead data |

### 2.1.4 Enhanced Lead Features `[NEW]`

| Requirement | Priority | Details |
|-------------|----------|---------|
| **REQ-BD-011** | `[P1]` | **Kanban/Pipeline View** — Drag-and-drop board with columns: New → Contacted → Qualified → Proposal → Closed/Lost |
| **REQ-BD-012** | `[P1]` | **Lead Assignment** — Assign leads to sales agents (Source role users) |
| **REQ-BD-013** | `[P1]` | **Bulk Operations** — Multi-select with checkboxes for bulk status change, bulk assign, bulk delete |
| **REQ-BD-014** | `[P1]` | **Advanced Filters** — Filter by: status, source, date range, assigned to, city, system KW range |
| **REQ-BD-015** | `[P1]` | **Sort Options** — Sort by any column (name, date, status, source, KW) |
| **REQ-BD-016** | `[P2]` | **Lead Scoring** — Rule-based scoring: system KW (weight 30%), rooftop area (20%), bill amount (30%), response speed (20%) |
| **REQ-BD-017** | `[P1]` | **Export** — Export leads to CSV/Excel with current filters applied |
| **REQ-BD-018** | `[P1]` | **Activity Log** — Every status change, assignment, note, or edit is recorded with timestamp + user |

---

## 2.2 Web Leads

### 2.2.1 Web Leads List View `[BASELINE]` `[P0]`

**Route:** `/admin/web-leads`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-020** | Display all leads captured from the public website contact form |
| **REQ-BD-021** | Columns: Name, Email, Phone, Service Interested, Message, Submitted Date, Status |
| **REQ-BD-022** | Status: Unread (new), Read, Contacted, Converted, Dismissed |
| **REQ-BD-023** | Click row to open detail modal |

### 2.2.2 Web Lead Detail Modal `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-024** | Show full contact information + message |
| **REQ-BD-025** | `[NEW]` "Convert to Lead" button — creates a lead record from web lead data |
| **REQ-BD-026** | `[NEW]` "Mark as Contacted" quick action |
| **REQ-BD-027** | `[NEW]` "Dismiss" action with reason field (spam, duplicate, etc.) |

### 2.2.3 Web Lead Integration `[NEW]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-028** | Auto-save web form submissions to `web_leads` table in Supabase |
| **REQ-BD-029** | `[P1]` Auto-notification to admin when new web lead arrives (in-app toast + bell notification) |
| **REQ-BD-030** | `[P2]` Auto-reply email to the customer acknowledging receipt |

---

## 2.3 Customer Management

### 2.3.1 Customer List View `[BASELINE]` `[P0]`

**Route:** `/admin/customers`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-040** | Data table with all converted customers |
| **REQ-BD-041** | Columns: Customer Name, Phone, System KW, Type (Residential/Commercial), Source, Status, Created Date |
| **REQ-BD-042** | Status badges: Active, Installation Pending, Installation Complete |
| **REQ-BD-043** | Search by name, phone, or email |
| **REQ-BD-044** | `[NEW]` Filter by: status, system type, date range, source |

### 2.3.2 Customer Detail View `[ENHANCED]` `[P0]`

**Route:** `/admin/customers/[id]`

This is a **tabbed detail page** with the following tabs:

#### Tab 1: Customer Info `[BASELINE]`

| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | ✅ |
| Phone | Phone | ✅ |
| Email | Email | ❌ |
| Address (Full) | Textarea | ✅ |
| City | Text | ✅ |
| State | Dropdown | ✅ |
| Pin Code | Text | ✅ |
| System Category | Dropdown: Residential / Commercial / Industrial | ✅ |
| System Capacity (KW) | Number | ✅ |
| Panel Type | Text | ❌ |
| Inverter Type | Text | ❌ |
| Consumer Number | Text | ❌ |
| DISCOM | Text | ❌ |
| Source | Dropdown | ✅ |
| Referred By | Text | ❌ |

#### Tab 2: Site Survey & Documents `[BASELINE]`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-050** | Upload site survey photos (multiple file upload) |
| **REQ-BD-051** | Upload site survey documents (PDF, images) |
| **REQ-BD-052** | Document viewer — preview uploaded files |
| **REQ-BD-053** | `[NEW]` Document categorization: Roof Photo, Electric Meter, Electricity Bill, Aadhar/ID, Site Plan |
| **REQ-BD-054** | Storage: Supabase Storage bucket `customer-documents` |
| **REQ-BD-055** | Max file size: 10MB per file |

#### Tab 3: Quotation `[BASELINE]`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-060** | Generate quotation with line items |
| **REQ-BD-061** | Quotation fields: System size, Panel details, Inverter details, Structure, BOS, Installation charges, Subsidy deduction |
| **REQ-BD-062** | Auto-calculate: Total Cost, Subsidy, Net Payable, EMI options |
| **REQ-BD-063** | PDF export with company branding |
| **REQ-BD-064** | `[NEW]` Quotation versioning — keep history of sent quotations |
| **REQ-BD-065** | `[NEW]` Quotation status: Draft, Sent, Accepted, Rejected, Expired |
| **REQ-BD-066** | `[NEW]` Share quotation via link (public URL with read-only access) |

#### Tab 4: Activity Timeline `[NEW]` `[P1]`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-070** | Chronological list of all actions taken on this customer |
| **REQ-BD-071** | Auto-log: Status changes, document uploads, quotation sent, notes added |
| **REQ-BD-072** | Manual note entry with user attribution |
| **REQ-BD-073** | Each entry shows: Action type icon, description, user name, timestamp |

#### Tab 5: Project Tracking `[NEW]` `[P1]`

| Requirement | Details |
|-------------|---------|
| **REQ-BD-080** | Visual pipeline showing current project stage |
| **REQ-BD-081** | Stages: Registration → Kit Ready → Dispatch → Fabrication → Wiring → Final Stage → Completed |
| **REQ-BD-082** | Each stage shows: Status (pending/in-progress/done), date started, date completed |
| **REQ-BD-083** | Links to the respective module page for that stage |

---

## 2.4 Data Relationships

```
Web Lead → (convert) → Lead → (convert) → Customer → Project Lifecycle
```

- A **Web Lead** can be converted to a **Lead**
- A **Lead** can be converted to a **Customer**
- A **Customer** is linked to **one project** (the installation)
- The **project** flows through the lifecycle stages

---

## 2.5 Supabase Tables Required

### `leads` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- updated_at (timestamptz)
- name (text, NOT NULL)
- phone (text, NOT NULL)
- email (text)
- address (text)
- city (text)
- state (text)
- source (enum: website, whatsapp, referral, social, direct, manual)
- system_kw (numeric)
- rooftop_area (numeric)
- monthly_bill (numeric)
- status (enum: new, contacted, qualified, proposal, closed, lost)
- assigned_to (uuid, FK → users.id)
- notes (text)
- lead_score (integer)
- converted_customer_id (uuid, FK → customers.id, nullable)
```

### `web_leads` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- name (text, NOT NULL)
- email (text, NOT NULL)
- phone (text)
- service (text)
- message (text)
- status (enum: unread, read, contacted, converted, dismissed)
- dismiss_reason (text)
- converted_lead_id (uuid, FK → leads.id, nullable)
```

### `customers` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- updated_at (timestamptz)
- lead_id (uuid, FK → leads.id)
- name (text, NOT NULL)
- phone (text, NOT NULL)
- email (text)
- address (text, NOT NULL)
- city (text, NOT NULL)
- state (text, NOT NULL)
- pin_code (text)
- system_category (enum: residential, commercial, industrial)
- system_kw (numeric, NOT NULL)
- panel_type (text)
- inverter_type (text)
- consumer_number (text)
- discom (text)
- source (text)
- referred_by (text)
- status (enum: active, installation_pending, installation_complete)
- current_stage (enum: registration, kit_ready, dispatch, fabrication, wiring, final_stage, completed)
```

### `customer_documents` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- customer_id (uuid, FK → customers.id)
- document_type (enum: roof_photo, electric_meter, electricity_bill, id_proof, site_plan, quotation, other)
- file_name (text)
- file_url (text)
- file_size (integer)
- uploaded_by (uuid, FK → users.id)
```

### `quotations` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- customer_id (uuid, FK → customers.id)
- version (integer, default 1)
- status (enum: draft, sent, accepted, rejected, expired)
- system_kw (numeric)
- line_items (jsonb)  -- Array of {name, description, quantity, unit_price, total}
- subtotal (numeric)
- subsidy_amount (numeric)
- net_total (numeric)
- valid_until (date)
- notes (text)
- shared_token (uuid, unique)  -- For public share link
- pdf_url (text)
```

### `activity_logs` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- entity_type (enum: lead, customer, web_lead, project, inventory, commission, ...)
- entity_id (uuid)
- action (text)  -- e.g., "status_changed", "note_added", "document_uploaded"
- details (jsonb)  -- e.g., {"from": "new", "to": "contacted"}
- user_id (uuid, FK → users.id)
- user_name (text)  -- Denormalized for fast display
```
