import Link from 'next/link';
import { Flag, Menu } from 'lucide-react';
import { buttonVariantsClass } from '@/components/ui/button';

const navigation = [
  { href: '/#si-funksionon', label: 'Si funksionon' },
  { href: '/#per-platformen', label: 'Për platformën' },
  { href: '/map', label: 'Transparenca' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Kthehu në faqen kryesore">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#071a34] text-white shadow-[0_10px_24px_-12px_rgba(7,26,52,0.9)]">
            <Flag className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-teal-400" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[15px] font-bold leading-tight tracking-[-0.025em] text-slate-950">Raporto Qytetin</span>
            <span className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500 sm:block">Platformë qytetare</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigimi kryesor">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-11 items-center rounded-lg px-3.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#071a34]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/citizen/report" className="inline-flex h-11 items-center rounded-lg px-3.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 hover:text-blue-900">
            Raporto problem
          </Link>
          <Link href="/login" className="inline-flex h-11 items-center rounded-lg px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#071a34]">
            Hyr
          </Link>
          <Link href="/register" className={buttonVariantsClass({ size: 'md', className: 'bg-[#0b63ce] shadow-[0_12px_22px_-14px_rgba(37,99,235,0.9)] hover:bg-[#0757ba]' })}>
            Regjistrohu
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Hap ose mbyll menynë</span>
          </summary>
          <nav className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.38)]" aria-label="Navigimi mobile">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-11 items-center rounded-xl px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            <Link href="/citizen/report" className="flex h-11 items-center rounded-xl px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              Raporto problem
            </Link>
            <Link href="/login" className="flex h-11 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Hyr
            </Link>
            <Link href="/register" className={buttonVariantsClass({ size: 'md', className: 'mt-1 w-full bg-[#0b63ce] hover:bg-[#0757ba]' })}>
              Krijo llogari
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
