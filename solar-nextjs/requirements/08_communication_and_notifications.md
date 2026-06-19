# 08 — Communication & Automation Module

> Covers: WhatsApp Integration, Email, Notifications, Workflow Automation

*Note: This entire module addresses the #1 missing feature identified in the Gap Analysis. It is classified as NEW functionality required for 2026 industry standards.*

---

## 8.1 WhatsApp Business API Integration `[NEW]`

### 8.1.1 Lead Communication `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-COM-001** | **Direct Chat Link:** A "WhatsApp" icon button next to every phone number that opens WhatsApp Web/Desktop pre-filled with the number. |
| **REQ-COM-002** | **Automated Welcome:** (API Integration) Send automated welcome template when a new Web Lead is received. |
| **REQ-COM-003** | **Template Messages:** Allow Sales Agents to select from approved templates (e.g., "Hi [Name], following up on your solar inquiry...") directly from the CRM Lead Detail page. |

### 8.1.2 Customer Lifecycle Alerts `[P1]`

| Requirement | Details |
|-------------|---------|
| **REQ-COM-010** | **Quotation Delivery:** Send quotation PDF link directly via WhatsApp API. |
| **REQ-COM-011** | **Installation Updates:** Automated WhatsApp alerts to customer when project stage changes (e.g., "Your solar kit is ready for dispatch", "Technician assigned"). |
| **REQ-COM-012** | **Maintenance Reminders:** Automated reminder 7 days before scheduled maintenance. |

---

## 8.2 Email & SMS Integration `[NEW]`

### 8.2.1 System Emails `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-COM-020** | **Auth Emails:** Password resets, user invitations via Supabase Auth email templates. |
| **REQ-COM-021** | **Quotation Emails:** Send quotation PDF via email with standard company signature. |

### 8.2.2 Alert SMS `[P2]`

| Requirement | Details |
|-------------|---------|
| **REQ-COM-030** | Fallback SMS delivery for critical alerts if WhatsApp fails. |
| **REQ-COM-031** | Internal SMS alerts to Supervisors for urgent escalations. |

---

## 8.3 In-App Notifications `[NEW]`

### 8.3.1 Notification Center `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-COM-040** | **Bell Icon UI:** Header bell icon with unread badge counter. |
| **REQ-COM-041** | **Notification Dropdown:** List of recent notifications with timestamps, mark as read functionality. |
| **REQ-COM-042** | **Toast Alerts:** Real-time on-screen toast messages (using `sonner`) for immediate feedback (e.g., "Lead saved successfully"). |

### 8.3.2 Notification Triggers `[P1]`

| Action | Notifies | Message Example |
|--------|----------|-----------------|
| New Web Lead created | Admins / Sources | "New Web Lead: Rahul Sharma (3 KW)" |
| Lead Assigned | Assigned User | "You have been assigned a new lead: Amit Patel" |
| Stage changed to Wiring | Technician | "Wiring assigned for Project: Gupta Residence" |
| Stage changed to Final | Supervisor | "Final Stage inspection required for Project: Tata Motors" |
| Low Stock Alert | Admins | "Warning: Waaree 540W Panels stock below threshold (5 left)" |

---

## 8.4 Workflow Automation Engine `[NEW]`

### 8.4.1 Trigger-Action Rules `[P1]`

| Requirement | Details |
|-------------|---------|
| **REQ-COM-050** | Implement basic business logic rules using Supabase Database Webhooks / Edge Functions. |
| **REQ-COM-051** | **Auto-Status:** When Quotation is marked "Accepted", automatically convert Lead to Customer and create Registration stage entry. |
| **REQ-COM-052** | **Auto-Deduction:** When "Kit Ready" is marked complete, automatically deduct all BOM items from master inventory. |
| **REQ-COM-053** | **Commission Generation:** As defined in Finance, auto-create commission ledgers upon assignment. |

---

## 8.5 Database Schema (Communications)

### `notifications` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- user_id (uuid, FK → users.id)
- title (text)
- message (text)
- link (text, nullable) -- URL to navigate to when clicked
- is_read (boolean, default false)
- type (enum: lead, project, inventory, system)
```

### `message_logs` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- customer_id (uuid, FK → customers.id, nullable)
- channel (enum: whatsapp, email, sms)
- direction (enum: outbound, inbound)
- message_content (text)
- status (enum: sent, delivered, failed)
- template_used (text, nullable)
```
