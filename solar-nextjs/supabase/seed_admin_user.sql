-- ─────────────────────────────────────────────────────────────────────────────
-- SQL SEED: DEFAULT ADMIN ACCOUNT FOR LOCAL TESTING / DEMO
-- ─────────────────────────────────────────────────────────────────────────────
-- Description:
--   Creates a default super_admin account in Supabase Auth and maps it to the
--   default 'chauhan' tenant inside the public.tenant_users table.
--
-- Instructions:
--   1. Copy the entire contents of this file.
--   2. Open your Supabase Dashboard -> SQL Editor.
--   3. Paste and run the query.
--
-- Credentials Created:
--   - Email: test2@gmail.com
--   - Password: Test@123
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable pgcrypto extension if not already enabled (required for crypt password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert user into auth.users (UUID: 'a8b8c8d8-e8f8-4a8b-8c8d-e8f8a8b8c8d8')
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a8b8c8d8-e8f8-4a8b-8c8d-e8f8a8b8c8d8', -- Static UUID for reliable mapping
  'authenticated',
  'authenticated',
  'superadmin@solarvista.com',
  crypt('SolarAdmin123!', gen_salt('bf')), -- Hashes the password using bcrypt salt
  now(),
  null,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Super Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert mapping in public.admin_users
INSERT INTO public.admin_users (id, email, full_name, role)
VALUES ('a8b8c8d8-e8f8-4a8b-8c8d-e8f8a8b8c8d8', 'superadmin@solarvista.com', 'Super Admin', 'super_admin')
ON CONFLICT (id) DO NOTHING;
