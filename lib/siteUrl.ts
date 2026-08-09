type SiteEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

const localSiteUrl = 'http://localhost:3000';

export function getSiteUrl(
  environment: SiteEnvironment = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_PROJECT_PRODUCTION_URL:
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
  },
): URL {
  const configuredUrl = environment.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProductionHost =
    environment.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidate =
    configuredUrl ||
    (vercelProductionHost ? `https://${vercelProductionHost}` : localSiteUrl);

  const url = new URL(candidate);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('NEXT_PUBLIC_SITE_URL must use http or https.');
  }
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an origin without credentials, path, query, or hash.');
  }

  return url;
}
