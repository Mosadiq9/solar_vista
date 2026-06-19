# 11 — UI/UX & Design Standards

> Covers: Design System, Component Guidelines, Responsiveness, Form Validation

To ensure the CRM feels like a premium, enterprise-grade application (2026 standard), strict UI/UX guidelines must be followed.

---

## 11.1 Design System

### 11.1.1 Color Palette
- **Primary Brand:** Solar Yellow/Gold (`#F59E0B` to `#D97706`)
- **Secondary:** Deep Navy/Charcoal (`#0F172A`) for sidebars and headers
- **Background:** Off-white (`#F8FAFC`) for data density readability
- **Status Colors:**
  - Success/Completed: Green (`#10B981`)
  - Warning/Pending: Yellow/Orange (`#F59E0B`)
  - Error/Lost: Red (`#EF4444`)
  - Info/New: Blue (`#3B82F6`)

### 11.1.2 Typography
- **Primary Font:** Inter or Roboto (Clean, highly legible for data tables)
- **Data Tables:** Tabular lining numbers (monospaced digits) for prices and KW capacities so columns align perfectly.

---

## 11.2 Component Guidelines

### 11.2.1 Data Tables `[P0]`
- Must use `TanStack Table` for performance.
- Fixed header while scrolling vertically.
- Alternating row colors (zebra striping) for readability.
- Hover state on rows (slight grey background).
- Skeleton loaders while fetching data (no spinning circles for tables).

### 11.2.2 Forms & Validation `[P0]`
- **Library:** `react-hook-form` + `zod`.
- **Validation:** Instant inline validation on `onBlur`. Do not wait for submit to show errors.
- **Save Buttons:** Must show loading spinner state `disabled={isSubmitting}` to prevent double-clicks.
- **Phone Numbers:** Auto-format as Indian standard (+91 XXXXX XXXXX).

### 11.2.3 Modals & Drawers `[P0]`
- Use **Slide-out Drawers** (Right side) for complex data entry (e.g., Add Lead, Add Customer) so the user doesn't lose context of the table behind it.
- Use **Center Modals** for simple confirmations (e.g., "Are you sure you want to delete?").

---

## 11.3 Responsive Design `[P0]`

The system must be fully functional on tablets and mobile phones for field workers (Technicians, Fabricators).

| Breakpoint | Layout Adjustment |
|------------|-------------------|
| **Desktop (lg+)** | Full sidebar fixed left. Max width data tables. |
| **Tablet (md)** | Sidebar collapses to icons only. Drawers take 70% width. |
| **Mobile (sm)** | Sidebar disappears (Hamburger menu). Tables switch to card-based layout (vertical scrolling instead of horizontal). |

### 11.3.1 Mobile-Specific Patterns
- Data tables on mobile are unreadable. On screens `< 768px`, table rows must transform into **Cards**.
- Example Mobile Card:
  ```text
  [Rahul Sharma]            [Badge: In Progress]
  +91 98765 43210
  5 KW Residential
  [Action: View] [Action: Call]
  ```

---

## 11.4 Feedback & Micro-interactions

- **Toast Notifications:** Use `sonner` for non-blocking success/error messages at bottom-right.
- **Empty States:** When a table has 0 rows, show an illustration with a helpful message (e.g., "No leads found. Create one to get started.") instead of just an empty header.
- **Transitions:** Subtle 150ms ease-in-out transitions on buttons, row hovers, and modal opens.
