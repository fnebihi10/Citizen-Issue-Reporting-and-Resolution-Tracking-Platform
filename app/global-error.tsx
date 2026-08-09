'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, buttonVariantsClass } from '@/components/ui/button';
import './globals.css';

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="sq">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16 text-slate-950 antialiased">
        <main className="w-full max-w-xl rounded-3xl border border-rose-100 bg-white p-7 text-center shadow-sm sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-700">
            Gabim i papritur
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Faqja nuk mund të ngarkohej
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Provo përsëri. Nëse problemi vazhdon, kthehu te faqja kryesore pa
            futur përsëri të dhëna personale.
          </p>
          {error.digest ? (
            <p className="mt-3 text-xs text-slate-600">Referenca: {error.digest}</p>
          ) : null}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => retry()}>Provo përsëri</Button>
            <Link href="/" className={buttonVariantsClass({ variant: 'secondary' })}>
              Faqja kryesore
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
