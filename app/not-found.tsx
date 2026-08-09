import Link from 'next/link';
import { ArrowLeft, MapPinned } from 'lucide-react';
import { buttonVariantsClass } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <MapPinned className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          Gabim 404
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Faqja nuk u gjet
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          Adresa mund të jetë ndryshuar ose faqja nuk ekziston. Kthehu te faqja
          kryesore ose vazhdo te harta publike.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonVariantsClass()}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Faqja kryesore
          </Link>
          <Link href="/map" className={buttonVariantsClass({ variant: 'secondary' })}>
            Harta publike
          </Link>
        </div>
      </section>
    </main>
  );
}
