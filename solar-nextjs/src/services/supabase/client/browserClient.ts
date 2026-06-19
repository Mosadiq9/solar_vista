// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE BROWSER CLIENT — singleton, typed
// ─────────────────────────────────────────────────────────────────────────────
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../types/database';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Gracefully degrade in build/preview without real keys
    console.warn('[Supabase] Missing env vars — client not initialised');
    return null;
  }

  client = createBrowserClient<Database>(url, key);
  return client;
}
