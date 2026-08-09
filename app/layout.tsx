import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';
import 'leaflet/dist/leaflet.css';
import './globals.css';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Raporto Qytetin',
    template: '%s | Raporto Qytetin',
  },
  description: 'Platformë për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare.',
  keywords: ['raportim qytetar', 'komunë', 'transparencë', 'probleme lokale', 'Kosovë'],
  applicationName: 'Raporto Qytetin',
  category: 'Civic technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: '/',
    siteName: 'Raporto Qytetin',
    title: 'Raporto Qytetin',
    description: 'Platformë për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare.',
  },
  twitter: {
    card: 'summary',
    title: 'Raporto Qytetin',
    description: 'Raportim dhe transparencë për probleme qytetare jo-emergjente.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">{children}</body>
    </html>
  );
}
