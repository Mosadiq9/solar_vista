import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function proxy(req) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // MVP Mock Bypass: Disabling Supabase proxy checks
  // const supabase = createServerClient(...)
  // const { data: { session } } = await supabase.auth.getSession();
  // if (req.nextUrl.pathname.startsWith('/portal') || req.nextUrl.pathname.startsWith('/admin')) { ... }
  // if (req.nextUrl.pathname === '/login' && session) { ... }

  return res;
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*', '/login'],
};
