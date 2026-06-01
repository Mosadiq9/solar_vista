-- Level 5 Migration: Customer Portal

-- 1. Create User Documents Table
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for user_documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own documents
CREATE POLICY "Users can view own documents" ON public.user_documents
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view/insert all documents
CREATE POLICY "Admins can manage all documents" ON public.user_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.email() 
      AND (admin_users.role = 'super_admin' OR admin_users.role = 'admin')
    )
  );

-- 2. Create Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, in_progress, closed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for support_tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can view and insert their own tickets
CREATE POLICY "Users can insert own tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view/update all tickets
CREATE POLICY "Admins can manage all tickets" ON public.support_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.email() 
      AND (admin_users.role = 'super_admin' OR admin_users.role = 'admin')
    )
  );

-- Create a dummy document for demonstration (replace user_id with your actual auth.uid() when testing)
-- INSERT INTO public.user_documents (user_id, file_name, file_url) VALUES ('YOUR-UUID-HERE', 'Purchase_Agreement_Signed.pdf', '#');
