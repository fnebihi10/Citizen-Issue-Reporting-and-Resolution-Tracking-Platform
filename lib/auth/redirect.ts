import type { UserRole } from '@/types/database';

export const defaultAuthenticatedPath = '/account';

export function getSafeInternalPath(value: string | null, fallback = defaultAuthenticatedPath) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /%2f|%5c/i.test(value)
  ) {
    return fallback;
  }

  try {
    const candidate = new URL(value, 'https://raporto-qytetin.invalid');
    return `${candidate.pathname}${candidate.search}`;
  } catch {
    return fallback;
  }
}

export function getRoleHomePath(role: UserRole | null | undefined) {
  if (role === 'citizen') return '/citizen';
  if (role === 'official') return '/official';
  if (role === 'admin') return '/admin';
  return defaultAuthenticatedPath;
}
