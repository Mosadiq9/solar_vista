-- ==============================================================================
-- MULTI-TENANT SAAS ARCHITECTURE - INITIAL SCHEMA
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('super_admin', 'tenant_admin', 'tenant_member');
create type tenant_status as enum ('active', 'suspended', 'trial', 'churned');
create type lead_status as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');

-- ==============================================================================
-- CORE TABLES
-- ==============================================================================

-- TENANTS: The root table for all multi-tenant isolation
create table public.tenants (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique, -- For subdomain mapping (e.g., chauhan.platform.com)
    custom_domain text unique, -- Optional custom domain (e.g., www.chauhansolar.com)
    status tenant_status default 'trial',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- TENANT SETTINGS: White-label configuration per tenant
create table public.tenant_settings (
    tenant_id uuid primary key references public.tenants(id) on delete cascade,
    company_name text not null,
    contact_email text,
    contact_phone text,
    logo_url text,
    favicon_url text,
    primary_color text default '#FFB000',
    secondary_color text default '#1A1A1A',
    font_family text default 'Inter',
    seo_title text,
    seo_description text,
    features jsonb default '{"chatbot": true, "calculator": true, "multilingual": true}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- TENANT USERS: Users associated with specific tenants
create table public.tenant_users (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references public.tenants(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    role user_role default 'tenant_member',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(tenant_id, user_id)
);

-- ==============================================================================
-- BUSINESS DATA TABLES (MUST have tenant_id)
-- ==============================================================================

-- LEADS / CRM
create table public.leads (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    name text not null,
    email text,
    phone text,
    status lead_status default 'new',
    source text, -- e.g., 'calculator', 'chatbot', 'contact_form'
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- QUOTE REQUESTS (From Solar Calculator)
create table public.quote_requests (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    lead_id uuid references public.leads(id) on delete set null,
    monthly_bill numeric,
    roof_size numeric,
    connection_type text,
    estimated_system_size numeric,
    status text default 'pending',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.tenants enable row level security;
alter table public.tenant_settings enable row level security;
alter table public.tenant_users enable row level security;
alter table public.leads enable row level security;
alter table public.quote_requests enable row level security;

-- HELPER FUNCTION: Get current user's tenant_id (from JWT or database lookup)
create or replace function public.get_auth_user_tenant_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
    select tenant_id from public.tenant_users where user_id = auth.uid();
$$;

-- HELPER FUNCTION: Is user Super Admin?
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select exists (
        select 1 from public.tenant_users 
        where user_id = auth.uid() and role = 'super_admin'
    );
$$;

-- 1. TENANTS POLICIES
-- Super admins can see all. Tenant users can see their own tenant.
-- Anonymous users can read tenant details via their domain/slug for white-label routing.
create policy "Public can read active tenants" on public.tenants
    for select using (status = 'active');

create policy "Super admins can manage tenants" on public.tenants
    for all using (public.is_super_admin());

-- 2. TENANT SETTINGS POLICIES
-- Public needs to read settings to render the white-label UI.
create policy "Public can read tenant settings" on public.tenant_settings
    for select using (
        tenant_id in (select id from public.tenants where status = 'active')
    );

create policy "Tenant admins can update settings" on public.tenant_settings
    for update using (
        tenant_id in (
            select tenant_id from public.tenant_users 
            where user_id = auth.uid() and role = 'tenant_admin'
        )
    );

-- 3. BUSINESS DATA POLICIES (Strict Tenant Isolation)
-- LEADS
create policy "Users can only see their tenant's leads" on public.leads
    for all using (tenant_id in (select public.get_auth_user_tenant_ids()));

-- Anonymous can insert leads via website forms (public access)
create policy "Public can insert leads" on public.leads
    for insert with check (true); 

-- QUOTE REQUESTS
create policy "Users can only see their tenant's quotes" on public.quote_requests
    for all using (tenant_id in (select public.get_auth_user_tenant_ids()));

create policy "Public can insert quote requests" on public.quote_requests
    for insert with check (true);

-- ==============================================================================
-- INDEXES FOR MULTI-TENANT SCALABILITY
-- ==============================================================================
create index idx_tenants_slug on public.tenants(slug);
create index idx_tenants_custom_domain on public.tenants(custom_domain);
create index idx_tenant_users_user_id on public.tenant_users(user_id);
create index idx_leads_tenant_id on public.leads(tenant_id);
create index idx_quote_requests_tenant_id on public.quote_requests(tenant_id);

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_tenants_updated_at before update on public.tenants for each row execute procedure public.handle_updated_at();
create trigger trigger_tenant_settings_updated_at before update on public.tenant_settings for each row execute procedure public.handle_updated_at();
create trigger trigger_leads_updated_at before update on public.leads for each row execute procedure public.handle_updated_at();
