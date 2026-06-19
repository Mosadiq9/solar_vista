-- ========================================================================================
-- BHSQUARE SOLAR CRM v2.0 - RPC, TRIGGERS & RLS POLICIES
-- ========================================================================================

-- ----------------------------------------------------------------------------------------
-- 1. TRIGGERS: SYNC AUTH.USERS TO ADMIN_USERS
-- ----------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, full_name, role, is_active)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'source'),
    TRUE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ----------------------------------------------------------------------------------------
-- 2. RPC: CONVERT LEAD TO CUSTOMER
-- ----------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.convert_lead_to_customer(p_lead_id UUID, p_user_id UUID, p_user_name TEXT)
RETURNS UUID AS $$
DECLARE
    v_customer_id UUID;
    v_lead_record RECORD;
BEGIN
    -- Get the lead
    SELECT * INTO v_lead_record FROM public.leads WHERE id = p_lead_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lead not found';
    END IF;

    -- Insert into customers
    INSERT INTO public.customers (
        lead_id, name, phone, email, address, city, state, system_kw, source, status, current_stage
    ) VALUES (
        p_lead_id,
        v_lead_record.name,
        v_lead_record.phone,
        v_lead_record.email,
        COALESCE(v_lead_record.address, 'Pending Address'),
        COALESCE(v_lead_record.city, 'Pending City'),
        COALESCE(v_lead_record.state, 'Pending State'),
        COALESCE(v_lead_record.system_kw, 0),
        v_lead_record.source::text,
        'active',
        'registration'
    ) RETURNING id INTO v_customer_id;

    -- Update lead status
    UPDATE public.leads SET status = 'closed' WHERE id = p_lead_id;

    -- Create first project stage
    INSERT INTO public.project_stages (customer_id, stage_name, status, started_at)
    VALUES (v_customer_id, 'registration', 'pending', NOW());

    -- Log activity
    INSERT INTO public.activity_logs (entity_type, entity_id, action, details, user_id, user_name)
    VALUES ('lead', p_lead_id, 'converted_to_customer', jsonb_build_object('customer_id', v_customer_id), p_user_id, p_user_name);

    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ----------------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_costs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role() RETURNS user_role AS $$
  SELECT role FROM public.admin_users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin Users: Super Admins can see all, others can see themselves
CREATE POLICY "Super Admins can manage all users" ON public.admin_users
    FOR ALL USING (get_user_role() = 'super_admin');

CREATE POLICY "Users can view themselves" ON public.admin_users
    FOR SELECT USING (id = auth.uid());

-- Leads: Admins/Super Admins see all. Source sees their own.
CREATE POLICY "Admins see all leads" ON public.leads
    FOR ALL USING (get_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Source sees assigned leads" ON public.leads
    FOR SELECT USING (get_user_role() = 'source' AND assigned_to = auth.uid());

CREATE POLICY "Source can create leads" ON public.leads
    FOR INSERT WITH CHECK (get_user_role() = 'source');

CREATE POLICY "Source can update assigned leads" ON public.leads
    FOR UPDATE USING (get_user_role() = 'source' AND assigned_to = auth.uid());

-- Customers: Admins see all.
CREATE POLICY "Admins see all customers" ON public.customers
    FOR ALL USING (get_user_role() IN ('super_admin', 'admin'));

-- Inventory: Admins manage all. Others can read.
CREATE POLICY "Everyone can view inventory" ON public.inventory
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins manage inventory" ON public.inventory
    FOR ALL USING (get_user_role() IN ('super_admin', 'admin'));

-- Commissions: Admins see all. Recipients see their own.
CREATE POLICY "Admins manage commissions" ON public.commissions
    FOR ALL USING (get_user_role() IN ('super_admin', 'admin'));

-- Project Costs: Super Admin only
CREATE POLICY "Super Admins view costs" ON public.project_costs
    FOR SELECT USING (get_user_role() = 'super_admin');
