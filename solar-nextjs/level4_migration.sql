-- Supabase Migration Script for Level 4 Features
-- Run this script in your Supabase SQL Editor

-- 1. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  service_type TEXT DEFAULT 'consultation',
  status TEXT DEFAULT 'upcoming',  -- upcoming, completed, cancelled, rescheduled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects (Portfolio) Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,  -- residential, commercial, industrial
  power TEXT,              -- e.g. "12.4 kW"
  savings TEXT,            -- e.g. "$2,400/yr saved"
  description TEXT,
  image_url TEXT,
  icon TEXT DEFAULT 'home',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  initials TEXT,
  gradient TEXT DEFAULT 'linear-gradient(135deg, #f59e0b, #ef4444)',
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Admin Users Table (For Roles)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT DEFAULT 'editor',  -- super_admin, admin, editor
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create dummy data for admin_users assuming the first auth user is a super_admin
-- Note: Replace with actual user ID if you want this automated, or manage via UI.
