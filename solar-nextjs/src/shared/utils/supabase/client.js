import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createBrowserClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined.');
  }
  // Create a singleton instance if we are in the browser
  if (typeof window !== 'undefined') {
    if (!window.supabaseClient) {
      window.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return window.supabaseClient;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};
