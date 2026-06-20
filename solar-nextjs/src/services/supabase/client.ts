// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT — Browser (Client Components)
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // BYPASS BROWSER DEADLOCKS: Force a dummy lock that executes immediately
        // instead of relying on navigator.locks which fails in Edge/Incognito.
        lock: async <R>(name: string, acquireTimeout: number, fn: () => Promise<R>): Promise<R> => {
          return await fn();
        }
      }
    }
  );

  return supabaseClient;
}
