# 05 — Finance & Commissions Module

> Covers: General Commissions, Supervisor/Fabricator Commissions, Cost Analysis

The Finance module handles the complex multi-party payout structures typical in Indian solar installations, as well as per-project profitability tracking.

---

## 5.1 Commission Management Engine

### 5.1.1 Commission Structure `[BASELINE]` `[P0]`

The system tracks three distinct commission channels for every project:

1. **Sales / Source Commission:** Payout to the agent/referrer who brought the lead.
2. **Fabricator Commission:** Payout to the team installing the physical structure.
3. **Supervisor Commission:** Payout to the site supervisor overseeing Final Stage.

### 5.1.2 Sales / General Commissions `[BASELINE]` `[P0]`

**Route:** `/admin/commissions`

| Requirement | Details |
|-------------|---------|
| **REQ-FIN-001** | **List View:** Table showing Customer Name, System KW, Rate/KW, Total Commission, Status, Actions |
| **REQ-FIN-002** | **Set Commission Modal:** Calculate `System KW × Custom Rate/KW` = Preview Amount |
| **REQ-FIN-003** | **Manual Override:** Allow admin to manually type a flat commission amount overriding the formula |
| **REQ-FIN-004** | **Status Dropdown:** Track payment status (Pending, Paid, Cancelled) |
| **REQ-FIN-005** | Include Lead Source information next to the customer name |

### 5.1.3 Supervisor Commissions `[BASELINE]` `[P0]`

**Route:** `/admin/supervisor-commissions`

| Requirement | Details |
|-------------|---------|
| **REQ-FIN-010** | **List View:** Table showing Customer, Supervisor Name, System KW, Rate/KW (Default ₹500), Total, Actions |
| **REQ-FIN-011** | **Auto-Creation:** Entry is created automatically when a Supervisor is assigned in Final Stage |
| **REQ-FIN-012** | **Update Modal:** Modify the rate or manual amount if required, update status to Paid |

### 5.1.4 Fabricator Commissions `[BASELINE]` `[P0]`

**Route:** `/admin/fabricator-commissions`

| Requirement | Details |
|-------------|---------|
| **REQ-FIN-020** | **List View:** Table showing Customer, Fabricator Name, System KW, Rate/KW (Default ₹800), Total, Actions |
| **REQ-FIN-021** | **Auto-Creation:** Entry is created automatically when a Fabricator is assigned in Fabrication Stage |
| **REQ-FIN-022** | **Update Modal:** Modify the rate or manual amount, update status |

---

## 5.2 Cost Analysis & Profitability

**Route:** `/admin/cost-analysis`

### 5.2.1 Project Economics Dashboard `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-FIN-030** | **Aggregate KPIs:** Show Total Completed Units (count) and Total Revenue (Sum of Net Cost from Quotations) |
| **REQ-FIN-031** | **Date Filter:** Filter analysis by completion date range |
| **REQ-FIN-032** | **Per-Project Breakdown Table:** Row per customer showing exact costs |
| **REQ-FIN-033** | **Cost Columns:** Kit Cost (BOM), Wire Cost, Fabricator Payout, Supervisor Payout, Extra Costs |
| **REQ-FIN-034** | **Net Total Column:** Sum of all costs for that project |
| **REQ-FIN-035** | **Adjust Extra Cost Modal:** Allow admin to add miscellaneous expenses (e.g., transport, bribe, extra material) per project |

### 5.2.2 Advanced Analytics `[NEW]` `[P1]`

| Requirement | Priority | Details |
|-------------|----------|---------|
| **REQ-FIN-040** | `[P1]` | **Profit Margin Calculation:** Display `(Project Revenue - Total Cost) = Profit (₹)` and `Profit Margin (%)` per row |
| **REQ-FIN-041** | `[P1]` | **Export:** Export complete cost analysis table to Excel for accounting |
| **REQ-FIN-042** | `[P2]` | **Visual Charts:** Cost breakdown pie chart, Profitability trend line over time |

---

## 5.3 Database Schema (Finance)

### `commissions` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- customer_id (uuid, FK → customers.id)
- commission_type (enum: sales, fabricator, supervisor)
- recipient_id (uuid, nullable) -- Can be user_id or service_provider_id
- recipient_name (text) -- Denormalized
- system_kw (numeric)
- rate_per_kw (numeric)
- calculated_amount (numeric) -- kw * rate
- final_amount (numeric) -- actual payout, allows manual override
- status (enum: pending, paid, cancelled)
- paid_at (timestamptz, nullable)
- notes (text)
```

### `project_costs` table (Cost Analysis Ledger)
```sql
- id (uuid, PK)
- customer_id (uuid, FK → customers.id, UNIQUE)
- revenue_amount (numeric) -- Pulled from accepted quotation
- kit_cost (numeric) -- Sum from kit_bom
- wire_cost (numeric) -- Calculated from wiring inventory usage
- fabricator_cost (numeric) -- Pulled from paid fabricator commission
- supervisor_cost (numeric) -- Pulled from paid supervisor commission
- extra_costs (numeric, default 0) -- Manually adjusted
- extra_cost_notes (text)
- total_cost (numeric) -- Generated column: sum of all costs
- profit_amount (numeric) -- Generated: revenue - total_cost
- updated_at (timestamptz)
```

### Supabase RPC Functions required:
1. `calculate_project_costs(customer_uuid)`: A stored procedure that aggregates BOM, Commissions, and Extra costs to update the `project_costs` table automatically whenever underlying data changes.
