import Link from 'next/link';
import { FilePlus2, Flag, Map, Menu, UserRound } from 'lucide-react';
import { SignOutButton } from '@/components/auth/SignOutButton';

const navigation = [
  { href: '/citizen/reports', label: 'Raportimet e mia', icon: FilePlus2 },
  { href: '/citizen/report', label: 'Raporto problem', icon: Map },
  { href: '/account', label: 'Llogaria', icon: UserRound },
];

export function WorkspaceHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/citizen/reports" className="flex items-center gap-3" aria-label="Hap raportimet e mia">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Flag className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-extrabold tracking-tight text-slate-950">Raporto Qytetin</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Hapësira qytetare</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigimi i hapësirës qytetare">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SignOutButton />
          <details className="relative md:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Hap menynë</span>
            </summary>
            <nav className="absolute right-0 top-14 z-20 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.38)]" aria-label="Navigimi mobile">
              {navigation.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
