import { loadEnvFile } from 'node:process';
import { createServerClient } from '@supabase/ssr';
import WebSocket from 'ws';

if (
  process.env.LOCAL_AUTH_AUDIT_ALLOW !== '1'
  && !process.argv.includes('--allow-dev')
) {
  throw new Error(
    '--allow-dev or LOCAL_AUTH_AUDIT_ALLOW=1 is required. Run this only against dev/staging.',
  );
}

loadEnvFile('.env.local');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const localUrl = process.env.LOCAL_AUDIT_URL ?? 'http://localhost:3000';
const auditEmail =
  process.env.REMOTE_AUDIT_EMAIL ?? 'synthetic.citizen@example.test';
const auditPassword =
  process.env.REMOTE_AUDIT_PASSWORD ?? 'SyntheticDemoOnly!2026';
const officialEmail =
  process.env.REMOTE_OFFICIAL_EMAIL ?? 'synthetic.official@example.test';
const officialPassword =
  process.env.REMOTE_OFFICIAL_PASSWORD ?? 'SyntheticDemoOnly!2026';

if (!supabaseUrl || !publishableKey) {
  throw new Error('Missing public Supabase configuration in .env.local.');
}

const cookieJar = new Map();
let authResponseHeaders = {};
const supabase = createServerClient(supabaseUrl, publishableKey, {
  realtime: {
    transport: WebSocket,
  },
  cookies: {
    getAll() {
      return Array.from(cookieJar, ([name, cookie]) => ({
        name,
        value: cookie.value,
      }));
    },
    setAll(cookiesToSet, headers = {}) {
      cookiesToSet.forEach(({ name, value, options }) => {
        if (options.maxAge === 0) {
          cookieJar.delete(name);
        } else {
          cookieJar.set(name, { value, options });
        }
      });
      authResponseHeaders = headers;
    },
  },
});

const { error: signInError } = await supabase.auth.signInWithPassword({
  email: auditEmail,
  password: auditPassword,
});
if (signInError) throw signInError;

try {
  if (cookieJar.size === 0) {
    throw new Error('SSR sign-in did not produce session cookies.');
  }
  if (
    !Object.keys(authResponseHeaders).some(
      (name) => name.toLowerCase() === 'cache-control',
    )
  ) {
    throw new Error('SSR auth cookie write did not provide no-cache headers.');
  }

  function cookieHeader() {
    return Array.from(
      cookieJar,
      ([name, cookie]) => `${name}=${cookie.value}`,
    ).join('; ');
  }

  async function request(pathname) {
    return fetch(new URL(pathname, localUrl), {
      headers: { cookie: cookieHeader() },
      redirect: 'manual',
    });
  }

  const accountResponse = await request('/account');
  if (accountResponse.status !== 200) {
    throw new Error(`/account returned ${accountResponse.status}.`);
  }
  const accountHtml = await accountResponse.text();
  if (!accountHtml.includes('Synthetic Demo Citizen')) {
    throw new Error('/account did not render the authenticated synthetic profile.');
  }

  const originalCookies = new Map(cookieJar);
  const authCookieName = Array.from(cookieJar.keys())
    .find((name) => /-auth-token(?:\.\d+)?$/.test(name))
    ?.replace(/\.\d+$/, '');
  if (!authCookieName) {
    throw new Error('Could not identify the Supabase SSR auth cookie.');
  }

  const authCookieValue = cookieJar.get(authCookieName)?.value
    ?? Array.from(cookieJar)
      .filter(([name]) => name.startsWith(`${authCookieName}.`))
      .sort(([left], [right]) => {
        const leftIndex = Number(left.slice(authCookieName.length + 1));
        const rightIndex = Number(right.slice(authCookieName.length + 1));
        return leftIndex - rightIndex;
      })
      .map(([, cookie]) => cookie.value)
      .join('');

  if (!authCookieValue?.startsWith('base64-')) {
    throw new Error('Unexpected Supabase SSR auth cookie encoding.');
  }

  const session = JSON.parse(
    Buffer.from(authCookieValue.slice('base64-'.length), 'base64url')
      .toString('utf8'),
  );
  session.expires_at = 1;
  const expiredCookieValue =
    `base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`;

  Array.from(cookieJar.keys())
    .filter(
      (name) => name === authCookieName
        || name.startsWith(`${authCookieName}.`),
    )
    .forEach((name) => cookieJar.delete(name));

  const chunkSize = 3180;
  if (expiredCookieValue.length <= chunkSize) {
    cookieJar.set(authCookieName, {
      value: expiredCookieValue,
      options: {},
    });
  } else {
    for (
      let offset = 0, index = 0;
      offset < expiredCookieValue.length;
      offset += chunkSize, index += 1
    ) {
      cookieJar.set(`${authCookieName}.${index}`, {
        value: expiredCookieValue.slice(offset, offset + chunkSize),
        options: {},
      });
    }
  }

  const refreshResponse = await request('/account');
  const refreshCacheControl =
    refreshResponse.headers.get('cache-control')?.toLowerCase() ?? '';
  const hasProductionNoStore =
    refreshCacheControl.includes('private')
    && refreshCacheControl.includes('no-store');
  const hasNextDevelopmentNoCache =
    refreshCacheControl.includes('no-cache')
    && refreshCacheControl.includes('must-revalidate');
  if (
    refreshResponse.status !== 200
    || !refreshResponse.headers.get('set-cookie')
    || (!hasProductionNoStore && !hasNextDevelopmentNoCache)
  ) {
    throw new Error(
      `Middleware session refresh verification failed (status=${refreshResponse.status}, setCookie=${Boolean(refreshResponse.headers.get('set-cookie'))}, cacheControl=${refreshCacheControl || 'missing'}).`,
    );
  }
  if (!hasProductionNoStore) {
    console.warn(
      'Next.js development cache headers detected; production private/no-store headers must be verified by the authenticated Playwright suite.',
    );
  }

  cookieJar.clear();
  originalCookies.forEach((cookie, name) => cookieJar.set(name, cookie));

  for (const pathname of [
    '/citizen',
    '/citizen/report',
    '/citizen/reports',
    '/notifications',
  ]) {
    const response = await request(pathname);
    if (response.status !== 200) {
      throw new Error(
        `${pathname} returned ${response.status} for the synthetic citizen.`,
      );
    }
  }

  for (const pathname of ['/official', '/admin']) {
    const response = await request(pathname);
    const location = response.headers.get('location');
    if (
      ![307, 308].includes(response.status)
      || !location
      || new URL(location, localUrl).pathname !== '/account'
      || new URL(location, localUrl).searchParams.get('error') !== 'forbidden'
    ) {
      throw new Error(
        `${pathname} did not enforce the citizen role boundary.`,
      );
    }
  }

  await supabase.auth.signOut();

  for (const pathname of [
    '/account',
    '/citizen',
    '/citizen/report',
    '/citizen/reports',
    '/official',
    '/official/reports',
    '/notifications',
  ]) {
    const response = await request(pathname);
    const location = response.headers.get('location');
    if (
      ![307, 308].includes(response.status)
      || !location
      || new URL(location, localUrl).pathname !== '/login'
    ) {
      throw new Error(
        `${pathname} did not redirect a signed-out visitor to /login.`,
      );
    }
  }

  const { error: officialSignInError } = await supabase.auth.signInWithPassword({
    email: officialEmail,
    password: officialPassword,
  });
  if (officialSignInError) throw officialSignInError;

  for (const pathname of [
    '/account',
    '/official',
    '/official/reports',
    '/notifications',
  ]) {
    const response = await request(pathname);
    if (response.status !== 200) {
      throw new Error(
        `${pathname} returned ${response.status} for the synthetic official.`,
      );
    }
  }

  const officialDashboardResponse = await request('/official');
  const officialDashboardHtml = await officialDashboardResponse.text();
  if (
    !officialDashboardHtml.includes('Paneli zyrtar')
    || !officialDashboardHtml.includes('Kërkojnë vëmendje')
    || !officialDashboardHtml.includes('Inbox-i i plotë')
  ) {
    throw new Error(
      '/official did not render the expected operational dashboard.',
    );
  }

  const officialCitizenRoute = await request('/citizen/report');
  const officialCitizenLocation = officialCitizenRoute.headers.get('location');
  if (
    ![307, 308].includes(officialCitizenRoute.status)
    || !officialCitizenLocation
    || new URL(officialCitizenLocation, localUrl).pathname !== '/account'
    || new URL(officialCitizenLocation, localUrl).searchParams.get('error')
      !== 'forbidden'
  ) {
    throw new Error(
      '/citizen/report did not enforce the official role boundary.',
    );
  }
} finally {
  await supabase.auth.signOut();
}

console.log(
  'Local route verification passed: SSR refresh, signed-out redirects, citizen/official access, and cross-role denials.',
);
