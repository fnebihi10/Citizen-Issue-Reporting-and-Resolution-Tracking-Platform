import Link from 'next/link';
import { AlertTriangle, Flag, HeartHandshake, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
          <p>
            <strong className="font-bold text-amber-200">Raste emergjente?</strong>{' '}
            Kjo platformë trajton vetëm probleme komunale jo-emergjente. Për emergjenca kontaktoni kanalet zyrtare: <strong>112</strong>.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <Flag className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-extrabold">Raporto Qytetin</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Një hapësirë e qartë për të raportuar, ndjekur dhe dokumentuar problemet lokale — me respekt për privatësinë.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Eksploro</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <Link href="/#si-funksionon" className="block hover:text-white">Si funksionon</Link>
              <Link href="/#kategorite" className="block hover:text-white">Kategoritë</Link>
              <Link href="/login" className="block hover:text-white">Hyrja</Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Parimet</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Privatësia</p>
              <p>Transparencë publike</p>
              <p>Të dhëna sintetike</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Për punimin e diplomës</h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              “Zhvillimi i një platforme për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare”.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Raporto Qytetin. Projekt akademik me dataset sintetik.</p>
          <p className="flex items-center gap-1.5">Ndërtuar me kujdes <HeartHandshake className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" /></p>
        </div>
      </div>
    </footer>
  );
}
