import process from 'node:process';

const rawOrigin = process.argv[2];

if (!rawOrigin) {
  console.error('Usage: node scripts/verify-production.mjs https://example.vercel.app');
  process.exit(1);
}

const origin = new URL(rawOrigin);

if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('Production URL must be an HTTPS origin without a path, query, or hash.');
}

const checks = [];

function check(condition, label, details = '') {
  checks.push({ condition, label, details });
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}${details ? ` — ${details}` : ''}`);
}

async function fetchRoute(path, options = {}) {
  return fetch(new URL(path, origin), {
    redirect: options.redirect ?? 'follow',
    signal: AbortSignal.timeout(30_000),
  });
}

const expectedRoutes = [
  ['/', 200],
  ['/map', 200],
  ['/login', 200],
  ['/register', 200],
  ['/robots.txt', 200],
  ['/sitemap.xml', 200],
  ['/__sprint10-not-found__', 404],
];

for (const [path, expectedStatus] of expectedRoutes) {
  const response = await fetchRoute(path);
  check(response.status === expectedStatus, `${path} returns ${expectedStatus}`, `received ${response.status}`);
}

const homeResponse = await fetchRoute('/');
const homeHtml = await homeResponse.text();
const canonical = homeHtml.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)/i)?.[1]
  ?? homeHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)?.[1];
const openGraphUrl = homeHtml.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)/i)?.[1]
  ?? homeHtml.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:url"/i)?.[1];

check(canonical === origin.origin, 'canonical URL matches production origin', canonical ?? 'missing');
check(openGraphUrl === origin.origin, 'Open Graph URL matches production origin', openGraphUrl ?? 'missing');

for (const header of [
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
]) {
  check(Boolean(homeResponse.headers.get(header)), `${header} header is present`);
}

const protectedResponse = await fetchRoute('/citizen', { redirect: 'manual' });
const expectedLoginUrl = new URL('/login?next=%2Fcitizen', origin).href;
check(
  protectedResponse.status >= 300 && protectedResponse.status < 400,
  'anonymous protected route redirects',
  `received ${protectedResponse.status}`,
);
check(
  protectedResponse.headers.get('location') === expectedLoginUrl
    || protectedResponse.headers.get('location') === '/login?next=%2Fcitizen',
  'protected route redirects to the login entry point',
  protectedResponse.headers.get('location') ?? 'missing',
);

const failures = checks.filter((item) => !item.condition);

console.log(`\n${checks.length - failures.length}/${checks.length} production checks passed.`);

if (failures.length > 0) {
  process.exitCode = 1;
}
