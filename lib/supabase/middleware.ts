import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getAllowedRolesForPath } from '@/lib/auth/authorization';
import { getPublicSupabaseConfig } from '@/lib/env';
import type { Database } from '@/types/supabase';

const protectedPrefixes = ['/account', '/citizen', '/official', '/admin'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { supabasePublishableKey, supabaseUrl } = getPublicSupabaseConfig();

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
          headers: Record<string, string> = {},
        ) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([name, value]) => {
            supabaseResponse.headers.set(name, value);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  function redirectWithSession(url: URL) {
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    ['cache-control', 'pragma', 'expires'].forEach((headerName) => {
      const value = supabaseResponse.headers.get(headerName);
      if (value) redirectResponse.headers.set(headerName, value);
    });
    return redirectResponse;
  }

  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return redirectWithSession(loginUrl);
  }

  const allowedRoles = user ? getAllowedRolesForPath(pathname) : null;
  if (user && allowedRoles) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (
      profileError
      || !profile
      || !allowedRoles.has(profile.role)
    ) {
      const accountUrl = request.nextUrl.clone();
      accountUrl.pathname = '/account';
      accountUrl.search = '';
      accountUrl.searchParams.set('error', 'forbidden');
      return redirectWithSession(accountUrl);
    }
  }

  return supabaseResponse;
}
