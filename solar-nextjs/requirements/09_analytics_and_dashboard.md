# 09 — Analytics & Dashboard Module

> Covers: Global Dashboard, KPIs, Charts, Reports

*Note: The baseline CRM has a very basic dashboard. This module specifies the enhancements required for a comprehensive 2026-level executive view.*

---

## 9.1 Executive Dashboard `[ENHANCED]` `[P0]`

**Route:** `/admin/dashboard`

### 9.1.1 Top-Level KPIs (Metric Cards)

| KPI | Source | Visual Treatment |
|-----|--------|------------------|
| **Total Leads** | Count of `leads` (all time or filtered date) | Up/Down trend indicator vs previous period |
| **Active Projects** | Count of projects in Stages 1-5 | Progress bar showing % of total pipeline |
| **Completed Installs** | Count of projects in Stage 6 (Completed) | Green success color |
| **Total Revenue** | Sum of `net_cost` from `quotations` for completed projects | Formatted in INR (₹) |
| **Inventory Value** | Sum of (stock_quantity * unit_price) | Red warning if high ratio of dead stock |
| **Pending Commissions**| Sum of `final_amount` where status=Pending | Actionable link to Commissions page |

### 9.1.2 Visual Charts `[NEW]` `[P1]`

Using Recharts/Chart.js:

| Chart Type | Name | Description |
|------------|------|-------------|
| **Bar Chart** | **Lead Sources** | Number of leads grouped by source (Website vs WhatsApp vs Referral) |
| **Funnel Chart**| **Sales Pipeline** | Leads → Qualified → Proposals Sent → Won (Converted) |
| **Line Chart** | **Revenue Trend** | Monthly revenue over the last 12 months |
| **Pie Chart** | **Project Types** | Residential vs Commercial vs Industrial breakdown (by KW) |
| **Bar Chart** | **Stage Bottlenecks** | Number of projects currently sitting in each of the 6 lifecycle stages |

### 9.1.3 Quick Action Panels `[NEW]` `[P0]`

| Panel | Functionality |
|-------|---------------|
| **Recent Activity** | Stream of the latest 10 logs from `activity_logs` |
| **Tasks/Alerts** | List of unread notifications or low-stock alerts |
| **Fast Create** | Floating action buttons to quickly Add Lead, Add Customer, Create Ticket |

---

## 9.2 Custom Reports `[NEW]` `[P2]`

**Route:** `/admin/reports`

| Requirement | Details |
|-------------|---------|
| **REQ-ANA-010** | **Report Builder UI:** Allow admin to select Data Source (Leads, Projects, Commissions), Date Range, and Columns. |
| **REQ-ANA-011** | **Saved Reports:** Ability to save a specific filter configuration as a named report (e.g., "Q1 Sales Agent Performance"). |
| **REQ-ANA-012** | **Export:** Export any generated report directly to CSV/Excel. |
| **REQ-ANA-013** | **Scheduled Reports:** Auto-email specific reports to Super Admin every Monday morning. |

---

## 9.3 Role-Based Views `[NEW]` `[P0]`

| Role | Dashboard Experience |
|------|----------------------|
| **Super Admin** | Sees everything (Financials, Inventory, Pipeline). |
| **Admin** | Sees Pipeline, Inventory, Operations. Cannot see Profitability/Net Costs. |
| **Source (Sales)** | Sees ONLY their own leads count, conversion rate, and their own pending commissions. |
| **Supervisor/Fabricator**| Sees ONLY their assigned active jobs and their own commission ledger. |
