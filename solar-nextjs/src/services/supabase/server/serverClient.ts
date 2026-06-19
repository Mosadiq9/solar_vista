// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE SERVER CLIENT — for route handlers and server components
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../types/database';

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      '[Supabase] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required'
    );
  }

  const cookieStore = cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set() {}, // Route handlers cannot set cookies after streaming
      remove() {},
    },
  });
}
