// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT — Browser (Client Components)
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * createClient — Creates a Supabase client for use in Client Components.
 * Call this inside client component functions, not at module level.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
