// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT — Server (Server Components, Route Handlers, Server Actions)
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * createClient — Creates a Supabase client for Server Components.
 * Handles cookies automatically for session management.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookies can't be set here
            // Middleware handles session refresh
          }
        },
      },
    }
  );
}

/**
 * createAdminClient — Creates a Supabase client with service role (bypasses RLS)
 * ONLY use this in server-side code — NEVER expose to client
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}
