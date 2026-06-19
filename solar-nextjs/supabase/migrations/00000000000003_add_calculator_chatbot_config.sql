-- ==============================================================================
-- MULTI-TENANT SAAS - CALCULATOR & CHATBOT CONFIGURATION TABLES
-- ==============================================================================

-- 1. CALCULATOR CONFIGURATIONS (Enables different tenants to set custom pricing and subsidy rules)
create table public.calculator_configurations (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade unique,
    base_cost_per_kw numeric not null default 60000.00, -- Rate per kW (e.g. ₹60,000)
    grid_tariff_rate numeric not null default 8.50, -- Price per unit of electricity (e.g. ₹8.5/kWh)
    average_sun_hours numeric not null default 5.0, -- Average sunlight hours per day (for calculation)
    subsidy_cap numeric not null default 78000.00, -- Maximum government subsidy cap (e.g. ₹78,000)
    subsidy_rules_json jsonb default '{"rules": [{"up_to_kw": 2, "rate_per_kw": 30000}, {"up_to_kw": 3, "rate_per_kw": 18000}]}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. CHATBOT KNOWLEDGE BASE (Allows custom AI responses per tenant)
create table public.chatbot_knowledge (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    category text not null, -- e.g., 'pricing', 'subsidy', 'warranty'
    question text not null,
    answer text not null,
    keywords text[] default '{}'::text[], -- e.g. {'subsidy', 'government', 'discount'}
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.calculator_configurations enable row level security;
alter table public.chatbot_knowledge enable row level security;

-- 1. Calculator Configuration Policies
create policy "Tenant admins can manage calculator settings" on public.calculator_configurations
    for all using (tenant_id in (select public.get_auth_user_tenant_ids()));

create policy "Public can view calculator settings for calculations" on public.calculator_configurations
    for select using (true);

-- 2. Chatbot Knowledge Policies
create policy "Tenant admins can manage chatbot knowledge" on public.chatbot_knowledge
    for all using (tenant_id in (select public.get_auth_user_tenant_ids()));

create policy "Public can read chatbot knowledge" on public.chatbot_knowledge
    for select using (true);

-- ==============================================================================
-- INDEXES & TIMESTAMPS
-- ==============================================================================
create index idx_calc_config_tenant_id on public.calculator_configurations(tenant_id);
create index idx_chatbot_knowledge_tenant_id on public.chatbot_knowledge(tenant_id);

create trigger trigger_calculator_configurations_updated_at before update on public.calculator_configurations for each row execute procedure public.handle_updated_at();
create trigger trigger_chatbot_knowledge_updated_at before update on public.chatbot_knowledge for each row execute procedure public.handle_updated_at();
