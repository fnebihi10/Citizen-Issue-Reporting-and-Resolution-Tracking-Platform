import Link from 'next/link';
import { Flag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#06182f] text-slate-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" aria-hidden="true" />
      <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3 text-white">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_12px_26px_-14px_rgba(96,165,250,0.9)]">
                <Flag className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#06182f] bg-teal-300" aria-hidden="true" />
              </span>
              <span className="font-bold tracking-[-0.02em]">Raporto Qytetin</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Projekt akademik për raportimin, ndjekjen dhe dokumentimin e çështjeve komunale jo-emergjente.
            </p>
          </div>

          <nav aria-label="Lidhjet në fund të faqes">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200">Eksploro</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link href="/#si-funksionon" className="block w-fit text-slate-300 transition-colors hover:text-white">Si funksionon</Link>
              <Link href="/#per-platformen" className="block w-fit text-slate-300 transition-colors hover:text-white">Për platformën</Link>
              <Link href="/map" className="block w-fit text-slate-300 transition-colors hover:text-white">Transparenca publike</Link>
              <Link href="/citizen/report" className="block w-fit text-slate-300 transition-colors hover:text-white">Raporto problem</Link>
              <Link href="/login" className="block w-fit text-slate-300 transition-colors hover:text-white">Hyr në llogari</Link>
            </div>
          </nav>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200">Parimet</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">Të dhëna sintetike për demonstrim dhe transparencë pa ekspozuar identitet personal.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Raporto Qytetin. Punim Bachelor.</p>
          <p>Platformë për çështje komunale, jo për emergjenca.</p>
        </div>
      </div>
    </footer>
  );
}
