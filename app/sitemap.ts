import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl.toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: new URL('/map', siteUrl).toString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
}
