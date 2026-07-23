import Link from 'next/link';
import { FilePlus2, Flag, Menu, ShieldCheck } from 'lucide-react';
import { buttonVariantsClass } from '@/components/ui/button';

const navigation = [
  { href: '/#si-funksionon', label: 'Si funksionon' },
  { href: '/#kategorite', label: 'Kategoritë' },
  { href: '/#transparenca', label: 'Transparenca' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Kthehu në faqen kryesore">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-blue-950/10 transition-transform group-hover:-rotate-3">
            <Flag className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-slate-950">
              Raporto Qytetin
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Zëri yt. Veprimi ynë.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigimi kryesor">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            Hyrja
          </Link>
          <Link href="/register" className={buttonVariantsClass({ size: 'sm' })}>
            <FilePlus2 className="h-4 w-4" aria-hidden="true" />
            Raporto problem
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Hap menynë</span>
          </summary>
          <div className="absolute right-0 top-14 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            <Link href="/login" className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <ShieldCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
              Hyrja në platformë
            </Link>
            <Link href="/register" className={buttonVariantsClass({ size: 'sm', className: 'mt-1 w-full' })}>
              <FilePlus2 className="h-4 w-4" aria-hidden="true" />
              Nis një raportim
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
