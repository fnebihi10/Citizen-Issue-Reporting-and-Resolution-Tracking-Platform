import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getAllowedRolesForPath } from '@/lib/auth/authorization';
import {
  clearRequestContextHeaders,
  writeRequestContextHeaders,
} from '@/lib/auth/requestContext';
import { isSessionExpired } from '@/lib/auth/sessionExpiry';
import { getPublicSupabaseConfig } from '@/lib/env';
import type { Database } from '@/types/supabase';

const protectedPrefixes = [
  '/account',
  '/notifications',
  '/citizen',
  '/official',
  '/admin',
];

export async function updateSession(request: NextRequest) {
  const forwardedHeaders = new Headers(request.headers);
  clearRequestContextHeaders(forwardedHeaders);
  let supabaseResponse = NextResponse.next({
    request: { headers: forwardedHeaders },
  });
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
          const cookieHeader = request.headers.get('cookie');
          if (cookieHeader) forwardedHeaders.set('cookie', cookieHeader);
          supabaseResponse = NextResponse.next({
            request: { headers: forwardedHeaders },
          });
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

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId = typeof claims?.sub === 'string' ? claims.sub : null;

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

  if (!userId && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return redirectWithSession(loginUrl);
  }

  const { data: requestContext, error: contextError } = userId
    ? await supabase.rpc('current_request_context').maybeSingle()
    : { data: null, error: null };

  if (
    contextError
    || !requestContext
    || requestContext.user_id !== userId
  ) {
    await supabase.auth.signOut({ scope: 'local' });
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return redirectWithSession(loginUrl);
  }

  if (
    isProtectedRoute
    && isSessionExpired(requestContext.session_started_at)
  ) {
    await supabase.auth.signOut({ scope: 'local' });
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('expired', '1');
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return redirectWithSession(loginUrl);
  }

  const allowedRoles = getAllowedRolesForPath(pathname);
  if (allowedRoles && !allowedRoles.has(requestContext.role)) {
    const accountUrl = request.nextUrl.clone();
    accountUrl.pathname = '/account';
    accountUrl.search = '';
    accountUrl.searchParams.set('error', 'forbidden');
    return redirectWithSession(accountUrl);
  }

  writeRequestContextHeaders(forwardedHeaders, {
    userId: requestContext.user_id,
    role: requestContext.role,
    departmentId: requestContext.department_id,
    fullName: requestContext.full_name,
    sessionStartedAt: requestContext.session_started_at,
    unreadCount: requestContext.unread_count,
  });
  const refreshedResponse = NextResponse.next({
    request: { headers: forwardedHeaders },
  });
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    refreshedResponse.cookies.set(cookie);
  });
  ['cache-control', 'pragma', 'expires'].forEach((headerName) => {
    const value = supabaseResponse.headers.get(headerName);
    if (value) refreshedResponse.headers.set(headerName, value);
  });

  return refreshedResponse;
}
