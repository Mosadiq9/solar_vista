-- ========================================================================================
-- BHSQUARE SOLAR CRM v2.0 - MASTER DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ========================================================================================

-- ----------------------------------------------------------------------------------------
-- 1. CUSTOM ENUM TYPES
-- ----------------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'source', 'supervisor', 'technician', 'fabricator');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'closed', 'lost');
CREATE TYPE lead_source AS ENUM ('website', 'whatsapp', 'referral', 'social', 'direct', 'manual');
CREATE TYPE web_lead_status AS ENUM ('unread', 'read', 'contacted', 'converted', 'dismissed');
CREATE TYPE system_category AS ENUM ('residential', 'commercial', 'industrial');
CREATE TYPE customer_status AS ENUM ('active', 'installation_pending', 'installation_complete');
CREATE TYPE lifecycle_stage AS ENUM ('registration', 'kit_ready', 'dispatch', 'fabrication', 'wiring', 'final_stage', 'completed');
CREATE TYPE stage_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE wire_type AS ENUM ('DC', 'AC_1_Phase', 'AC_3_Phase', 'Earthing');
CREATE TYPE stock_item_type AS ENUM ('general', 'wiring');
CREATE TYPE transaction_type AS ENUM ('stock_in', 'stock_out', 'adjustment');
CREATE TYPE provider_type AS ENUM ('driver', 'fabricator', 'technician', 'supervisor');
CREATE TYPE vehicle_status AS ENUM ('available', 'in_transit', 'maintenance');
CREATE TYPE commission_type AS ENUM ('sales', 'fabricator', 'supervisor');
CREATE TYPE commission_status AS ENUM ('pending', 'paid', 'cancelled');
CREATE TYPE service_type AS ENUM ('routine_cleaning', 'inspection', 'repair');
CREATE TYPE service_status AS ENUM ('scheduled', 'completed', 'missed');
CREATE TYPE component_type AS ENUM ('panel', 'inverter', 'structure', 'workmanship');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved');
CREATE TYPE notification_type AS ENUM ('lead', 'project', 'inventory', 'system');
CREATE TYPE message_channel AS ENUM ('whatsapp', 'email', 'sms');
CREATE TYPE message_direction AS ENUM ('outbound', 'inbound');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'failed');


-- ----------------------------------------------------------------------------------------
-- 2. SYSTEM ADMIN & AUTHENTICATION
-- ----------------------------------------------------------------------------------------

-- Service Providers Registry (Workers/Fleet/Supervisors)
CREATE TABLE public.service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    type provider_type NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    default_rate_per_kw NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Admin Users (Extends Supabase Auth)
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'source',
    is_active BOOLEAN DEFAULT TRUE,
    provider_link_id UUID REFERENCES public.service_providers(id) ON DELETE SET NULL
);

-- System Settings
CREATE TABLE public.system_settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.admin_users(id)
);


-- ----------------------------------------------------------------------------------------
-- 3. BUSINESS DEVELOPMENT (LEADS & CUSTOMERS)
-- ----------------------------------------------------------------------------------------

-- Leads
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    source lead_source DEFAULT 'manual',
    system_kw NUMERIC,
    rooftop_area NUMERIC,
    monthly_bill NUMERIC,
    status lead_status DEFAULT 'new',
    assigned_to UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    notes TEXT,
    lead_score INTEGER DEFAULT 0
);

-- Web Leads
CREATE TABLE public.web_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT,
    status web_lead_status DEFAULT 'unread',
    dismiss_reason TEXT,
    converted_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL
);

-- Customers
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT,
    system_category system_category DEFAULT 'residential',
    system_kw NUMERIC NOT NULL,
    panel_type TEXT,
    inverter_type TEXT,
    consumer_number TEXT,
    discom TEXT,
    source TEXT,
    referred_by TEXT,
    status customer_status DEFAULT 'active',
    current_stage lifecycle_stage DEFAULT 'registration'
);

-- Customer Documents
CREATE TABLE public.customer_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- e.g., 'roof_photo', 'electric_meter'
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL
);

-- Quotations
CREATE TABLE public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'rejected', 'expired'
    system_kw NUMERIC,
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC DEFAULT 0,
    subsidy_amount NUMERIC DEFAULT 0,
    net_total NUMERIC DEFAULT 0,
    valid_until DATE,
    notes TEXT,
    shared_token UUID UNIQUE DEFAULT uuid_generate_v4(),
    pdf_url TEXT
);


-- ----------------------------------------------------------------------------------------
-- 4. LOGISTICS & STORES
-- ----------------------------------------------------------------------------------------

-- Inventory Brands
CREATE TABLE public.inventory_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Categories
CREATE TABLE public.inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    is_wiring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Inventory (General)
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    brand_id UUID REFERENCES public.inventory_brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.inventory_categories(id) ON DELETE SET NULL,
    unit_price NUMERIC DEFAULT 0,
    tax_percentage NUMERIC DEFAULT 0,
    stock_quantity NUMERIC DEFAULT 0,
    min_threshold NUMERIC DEFAULT 0,
    sku TEXT UNIQUE
);

-- Wiring Inventory
CREATE TABLE public.wiring_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    brand_name TEXT,
    wire_type wire_type NOT NULL,
    gauge_sqmm NUMERIC NOT NULL,
    color TEXT NOT NULL,
    unit_price NUMERIC DEFAULT 0,
    tax_percentage NUMERIC DEFAULT 0,
    stock_meters NUMERIC DEFAULT 0
);

-- Stock Transactions Ledger
CREATE TABLE public.stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    item_id UUID NOT NULL,
    item_type stock_item_type NOT NULL,
    transaction_type transaction_type NOT NULL,
    quantity_change NUMERIC NOT NULL,
    previous_stock NUMERIC NOT NULL,
    new_stock NUMERIC NOT NULL,
    reference_id UUID,
    notes TEXT,
    user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL
);

-- Fleet Management
CREATE TABLE public.fleet (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    vehicle_number TEXT UNIQUE NOT NULL,
    model TEXT,
    payload_capacity_kg NUMERIC,
    status vehicle_status DEFAULT 'available',
    insurance_expiry DATE,
    fitness_expiry DATE
);

-- Add vehicle_id to service_providers (for drivers)
ALTER TABLE public.service_providers ADD COLUMN vehicle_id UUID REFERENCES public.fleet(id) ON DELETE SET NULL;


-- ----------------------------------------------------------------------------------------
-- 5. PROJECT LIFECYCLE
-- ----------------------------------------------------------------------------------------

-- Project Stages Log
CREATE TABLE public.project_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    stage_name lifecycle_stage NOT NULL,
    status stage_status DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT
);

-- Kit BOM (Bill of Materials)
CREATE TABLE public.kit_bom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
    quantity_used NUMERIC NOT NULL,
    unit_cost_at_time NUMERIC NOT NULL,
    total_cost NUMERIC NOT NULL
);

-- Project Assignments (Drivers, Fabricators, Technicians)
CREATE TABLE public.project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    stage lifecycle_stage NOT NULL,
    provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Final Stage Checklist
CREATE TABLE public.final_stage_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID UNIQUE NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_fill_dp BOOLEAN DEFAULT FALSE,
    is_inspection BOOLEAN DEFAULT FALSE,
    is_solder BOOLEAN DEFAULT FALSE,
    is_submission BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------------------------------
-- 6. FINANCE & COMMISSIONS
-- ----------------------------------------------------------------------------------------

-- Commissions
CREATE TABLE public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    commission_type commission_type NOT NULL,
    recipient_id UUID, -- Either user_id or provider_id
    recipient_name TEXT NOT NULL,
    system_kw NUMERIC NOT NULL,
    rate_per_kw NUMERIC NOT NULL,
    calculated_amount NUMERIC NOT NULL,
    final_amount NUMERIC NOT NULL,
    status commission_status DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    notes TEXT
);

-- Project Costs (Profitability Ledger)
CREATE TABLE public.project_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID UNIQUE NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    revenue_amount NUMERIC DEFAULT 0,
    kit_cost NUMERIC DEFAULT 0,
    wire_cost NUMERIC DEFAULT 0,
    fabricator_cost NUMERIC DEFAULT 0,
    supervisor_cost NUMERIC DEFAULT 0,
    extra_costs NUMERIC DEFAULT 0,
    extra_cost_notes TEXT,
    total_cost NUMERIC DEFAULT 0,
    profit_amount NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------------------------------
-- 7. AFTER SALES & SUPPORT
-- ----------------------------------------------------------------------------------------

-- Maintenance Schedules
CREATE TABLE public.maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    service_type service_type NOT NULL,
    technician_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    status service_status DEFAULT 'scheduled',
    notes TEXT,
    completed_at TIMESTAMPTZ
);

-- Warranties
CREATE TABLE public.warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    component component_type NOT NULL,
    provider TEXT,
    serial_number TEXT,
    start_date DATE,
    end_date DATE,
    document_url TEXT
);

-- Support Tickets
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ticket_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority DEFAULT 'medium',
    status ticket_status DEFAULT 'open',
    assigned_to UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ
);


-- ----------------------------------------------------------------------------------------
-- 8. COMMUNICATIONS & LOGGING
-- ----------------------------------------------------------------------------------------

-- Activity Logs
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    user_name TEXT
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    type notification_type DEFAULT 'system'
);

-- Message Logs
CREATE TABLE public.message_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    channel message_channel NOT NULL,
    direction message_direction NOT NULL,
    message_content TEXT NOT NULL,
    status message_status DEFAULT 'sent',
    template_used TEXT
);
