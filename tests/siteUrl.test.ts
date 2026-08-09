import { describe, expect, it } from 'vitest';
import { getSiteUrl } from '@/lib/siteUrl';

describe('release site URL', () => {
  it('prefers the explicit public site origin', () => {
    expect(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://raporto.example',
        VERCEL_PROJECT_PRODUCTION_URL: 'fallback.vercel.app',
      }).origin,
    ).toBe('https://raporto.example');
  });

  it('uses Vercel production metadata when no explicit origin exists', () => {
    expect(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: undefined,
        VERCEL_PROJECT_PRODUCTION_URL: 'raporto.vercel.app',
      }).origin,
    ).toBe('https://raporto.vercel.app');
  });

  it('rejects a site URL containing a path', () => {
    expect(() =>
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://raporto.example/private',
        VERCEL_PROJECT_PRODUCTION_URL: undefined,
      }),
    ).toThrow(/origin/);
  });
});
