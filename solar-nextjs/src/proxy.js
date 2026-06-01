import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function proxy(req) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect /portal and /admin routes
  if (req.nextUrl.pathname.startsWith('/portal') || req.nextUrl.pathname.startsWith('/admin')) {
    // Check if demo mode is active via cookies (since we can't easily read localStorage here)
    // Actually, demo_mode was set in localStorage. The server can't read localStorage.
    // Instead of completely blocking, we can redirect to login if no session.
    // We'll modify the demo mode to set a cookie in the login page, or handle demo in a different way.
    
    if (!session) {
      // Check for a demo cookie
      const demoCookie = req.cookies.get('demo_mode');
      if (!demoCookie || demoCookie.value !== 'true') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  // If user is logged in, don't let them see the login page
  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/portal', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*', '/login'],
};
