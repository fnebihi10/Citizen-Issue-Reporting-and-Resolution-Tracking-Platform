import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Raporto Qytetin',
    template: '%s | Raporto Qytetin',
  },
  description: 'Platformë për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare.',
  keywords: ['raportim qytetar', 'komunë', 'transparencë', 'probleme lokale', 'Kosovë'],
  applicationName: 'Raporto Qytetin',
  category: 'Civic technology',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">{children}</body>
    </html>
  );
}
