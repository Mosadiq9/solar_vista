-- ==============================================================================
-- MULTI-TENANT SAAS - CMS & CHAT TABLE ADDITIONS
-- ==============================================================================

-- 1. FAQS
create table public.faqs (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    category text not null, -- e.g., 'finance', 'installation', 'support'
    question text not null,
    answer text not null,
    sort_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. TESTIMONIALS
create table public.testimonials (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    client_name text not null,
    client_role text, -- e.g., 'Factory Owner, Surat'
    content text not null,
    rating integer default 5 check (rating >= 1 and rating <= 5),
    system_size text, -- e.g., '50 kW'
    savings_estimate text, -- e.g., '₹5.8L/yr'
    avatar_url text,
    sort_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. PROJECTS
create table public.projects (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    title text not null,
    category text not null, -- 'residential', 'commercial', 'industrial'
    location text not null, -- e.g., 'Surat, Gujarat'
    capacity text not null, -- e.g., '1.2 MW'
    savings text not null, -- e.g., '₹84 Lakhs/Yr'
    image_url text,
    case_study_slug text,
    sort_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. BLOGS
create table public.blogs (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    title text not null,
    slug text not null,
    content text not null, -- Markdown or HTML
    excerpt text,
    cover_image text,
    published_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(tenant_id, slug)
);

-- 5. CHATBOT CONVERSATIONS (For CRM / Lead Tracking)
create table public.chatbot_conversations (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    session_id text not null, -- Client browser tracking ID
    messages jsonb default '[]'::jsonb, -- Array of conversation exchange
    lead_id uuid references public.leads(id) on delete set null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.projects enable row level security;
alter table public.blogs enable row level security;
alter table public.chatbot_conversations enable row level security;

-- Public can read active tenant's CMS resources
create policy "Public can read faqs" on public.faqs for select using (true);
create policy "Public can read testimonials" on public.testimonials for select using (true);
create policy "Public can read projects" on public.projects for select using (true);
create policy "Public can read blogs" on public.blogs for select using (true);

-- Admins / Members have full access to manage CMS resources
create policy "Admins can manage faqs" on public.faqs for all using (tenant_id in (select public.get_auth_user_tenant_ids()));
create policy "Admins can manage testimonials" on public.testimonials for all using (tenant_id in (select public.get_auth_user_tenant_ids()));
create policy "Admins can manage projects" on public.projects for all using (tenant_id in (select public.get_auth_user_tenant_ids()));
create policy "Admins can manage blogs" on public.blogs for all using (tenant_id in (select public.get_auth_user_tenant_ids()));

-- Chatbot policies (Anonymous insertion & tracking)
create policy "Public can create/update chatbot sessions" on public.chatbot_conversations 
    for all using (true) with check (true);

-- ==============================================================================
-- INDEXES & TIMESTAMPS
-- ==============================================================================
create index idx_faqs_tenant_id on public.faqs(tenant_id);
create index idx_testimonials_tenant_id on public.testimonials(tenant_id);
create index idx_projects_tenant_id on public.projects(tenant_id);
create index idx_blogs_tenant_id on public.blogs(tenant_id);
create index idx_chatbot_conversations_tenant_id on public.chatbot_conversations(tenant_id);

create trigger trigger_faqs_updated_at before update on public.faqs for each row execute procedure public.handle_updated_at();
create trigger trigger_testimonials_updated_at before update on public.testimonials for each row execute procedure public.handle_updated_at();
create trigger trigger_projects_updated_at before update on public.projects for each row execute procedure public.handle_updated_at();
create trigger trigger_blogs_updated_at before update on public.blogs for each row execute procedure public.handle_updated_at();
create trigger trigger_chatbot_conversations_updated_at before update on public.chatbot_conversations for each row execute procedure public.handle_updated_at();
