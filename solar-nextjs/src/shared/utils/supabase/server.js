import { createClient } from '@supabase/supabase-js';

export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined.');
  }

  // Create a new client on each request for server-side
  return createClient(supabaseUrl, supabaseAnonKey);
};
