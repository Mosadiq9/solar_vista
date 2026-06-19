'use client';

/**
 * SupabaseProvider — Placeholder for Supabase auth context
 *
 * TODO: When Supabase is connected:
 * 1. Create a Supabase browser client
 * 2. Set up session listener
 * 3. Expose session via context
 * 4. Protect routes that require auth
 */
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Future implementation:
  // const supabase = createClient();
  // const [session, setSession] = useState(null);
  // useEffect(() => { supabase.auth.onAuthStateChange(...) }, []);
  // return <Context.Provider value={{ supabase, session }}>{children}</Context.Provider>

  return <>{children}</>;
}
