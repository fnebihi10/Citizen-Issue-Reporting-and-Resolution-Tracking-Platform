/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const privateNoStoreHeaders = [
  {
    key: 'Cache-Control',
    value: 'private, no-cache, no-store, must-revalidate, max-age=0',
  },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
];

if (process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  });
}

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.119'],
  async headers() {
    return [
      {
        source: '/account/:path*',
        headers: privateNoStoreHeaders,
      },
      {
        source: '/citizen/:path*',
        headers: privateNoStoreHeaders,
      },
      {
        source: '/notifications/:path*',
        headers: privateNoStoreHeaders,
      },
      {
        source: '/official/:path*',
        headers: privateNoStoreHeaders,
      },
      {
        source: '/admin/:path*',
        headers: privateNoStoreHeaders,
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
