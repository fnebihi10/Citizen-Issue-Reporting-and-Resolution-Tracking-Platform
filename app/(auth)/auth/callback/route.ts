import { NextRequest, NextResponse } from 'next/server';
import { getSafeInternalPath } from '@/lib/auth/redirect';
import { createClient } from '@/lib/supabase/server';

function secureRedirect(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const nextPath = getSafeInternalPath(request.nextUrl.searchParams.get('next'));

  if (!code) {
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.set('error', 'callback');
    return secureRedirect(loginUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.set('error', 'callback');
    return secureRedirect(loginUrl);
  }

  return secureRedirect(new URL(nextPath, request.nextUrl.origin));
}
