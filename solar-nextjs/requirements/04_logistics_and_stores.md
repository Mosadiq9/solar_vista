# 04 — Logistics & Stores Module

> Covers: General Inventory, Wiring Inventory, Fleet Management

This module tracks all physical assets: solar components in the warehouse, wiring spools, and delivery vehicles.

---

## 4.1 Master Inventory (General)

**Route:** `/admin/inventory`

### 4.1.1 Stock List View `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-INV-001** | Data table showing all inventory items |
| **REQ-INV-002** | Columns: Name, Brand, Category, Unit Price, Tax %, Stock Qty, Value, Actions |
| **REQ-INV-003** | **KPI Dashboard:** Show Total Inventory Value (Sum of (Price + Tax) * Qty) |
| **REQ-INV-004** | Search bar and filter by Category / Brand |
| **REQ-INV-005** | **Low Stock Alert `[NEW]` `[P1]`**: Highlight rows in red/yellow if Stock Qty < Minimum Threshold |

### 4.1.2 Inventory Entities Management `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-INV-010** | **Brand Directory:** Add/Edit/Delete Brands (e.g., Adani, Waaree, Havells) |
| **REQ-INV-011** | **Category Vault:** Add/Edit/Delete Categories (e.g., Panel, Inverter, BOS, Structure) |
| **REQ-INV-012** | **Add/Edit Product Modal:** Fields for Name, Brand (dropdown), Category (dropdown), Unit Price (₹), Tax (%), Initial Stock |

### 4.1.3 Advanced Inventory Features `[NEW]`

| Requirement | Priority | Details |
|-------------|----------|---------|
| **REQ-INV-020** | `[P1]` | **Stock History Ledger:** View in/out transaction history for any product (e.g., "+50 manual addition", "-14 kit assembly for Project X") |
| **REQ-INV-021** | `[P1]` | **Purchase Orders:** Basic PO generation for suppliers when stock is low |
| **REQ-INV-022** | `[P2]` | **Multi-Warehouse:** Support multiple storage locations |

---

## 4.2 Wiring Inventory

**Route:** `/admin/wiring-inventory`

Wiring is tracked separately due to its unit of measurement (meters) and specific attributes (gauge, core, color).

### 4.2.1 Wiring Stock List `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-INV-030** | Data table for wiring stock |
| **REQ-INV-031** | Columns: Brand, Type (AC/DC), Gauge (sqmm), Color, Unit Price, Tax %, Stock (MTRS), Value |
| **REQ-INV-032** | Total Wiring Inventory Value displayed separately from general inventory |
| **REQ-INV-033** | Add/Edit Wire Modal: Brand Name, Wire Type (dropdown), Gauge (number), Color (dropdown), Price, Tax, Opening Stock |

---

## 4.3 Fleet Management

**Route:** `/admin/fleet`

### 4.3.1 Vehicle Registry `[BASELINE]` `[P0]`

| Requirement | Details |
|-------------|---------|
| **REQ-INV-040** | **List View:** Display all company and contracted delivery vehicles |
| **REQ-INV-041** | Columns: Vehicle No., Vehicle Type, Capacity (Ton/KW), Status, Current Driver |
| **REQ-INV-042** | **Register Vehicle Modal:** Registration No., Model, Payload Capacity |
| **REQ-INV-043** | Vehicle Status: Available, In Transit, Maintenance |

### 4.3.2 Fleet Operations `[NEW]` `[P1]`

| Requirement | Priority | Details |
|-------------|----------|---------|
| **REQ-INV-050** | `[P1]` | **Document Tracking:** Upload RC, Insurance, Pollution certs |
| **REQ-INV-051** | `[P1]` | **Expiry Alerts:** Notify admin 15 days before Insurance/Pollution expiry |
| **REQ-INV-052** | `[P2]` | **GPS Tracking:** Integration link to GPS tracking provider |

---

## 4.4 Database Schema (Logistics & Stores)

### `inventory_brands` table
```sql
- id (uuid, PK)
- name (text, UNIQUE, NOT NULL)
- created_at (timestamptz)
```

### `inventory_categories` table
```sql
- id (uuid, PK)
- name (text, UNIQUE, NOT NULL) -- 'Panel', 'Inverter', etc.
- is_wiring (boolean, default false)
- created_at (timestamptz)
```

### `inventory` table (General Products)
```sql
- id (uuid, PK)
- created_at (timestamptz)
- name (text, NOT NULL)
- brand_id (uuid, FK → inventory_brands.id)
- category_id (uuid, FK → inventory_categories.id)
- unit_price (numeric, default 0)
- tax_percentage (numeric, default 0)
- stock_quantity (numeric, default 0)
- min_threshold (numeric, default 0) -- For low stock alerts
- sku (text, UNIQUE, nullable)
```

### `wiring_inventory` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- brand_name (text)
- wire_type (enum: DC, AC_1_Phase, AC_3_Phase, Earthing)
- gauge_sqmm (numeric)
- color (text)
- unit_price (numeric, default 0)
- tax_percentage (numeric, default 0)
- stock_meters (numeric, default 0)
```

### `stock_transactions` table (Audit Ledger)
```sql
- id (uuid, PK)
- created_at (timestamptz)
- item_id (uuid) -- references either inventory.id or wiring_inventory.id
- item_type (enum: general, wiring)
- transaction_type (enum: stock_in, stock_out, adjustment)
- quantity_change (numeric) -- positive or negative
- previous_stock (numeric)
- new_stock (numeric)
- reference_id (uuid, nullable) -- e.g., customer_id if stock_out for Kit Ready
- notes (text)
- user_id (uuid, FK → users.id)
```

### `fleet` table
```sql
- id (uuid, PK)
- created_at (timestamptz)
- vehicle_number (text, UNIQUE, NOT NULL)
- model (text)
- payload_capacity_kg (numeric)
- status (enum: available, in_transit, maintenance)
- insurance_expiry (date)
- fitness_expiry (date)
```
