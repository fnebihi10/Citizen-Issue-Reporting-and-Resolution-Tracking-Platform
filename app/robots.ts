import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/map', '/reports/'],
      disallow: [
        '/account',
        '/admin/',
        '/auth/',
        '/citizen/',
        '/forgot-password',
        '/login',
        '/notifications',
        '/official/',
        '/register',
        '/update-password',
      ],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: siteUrl.origin,
  };
}
