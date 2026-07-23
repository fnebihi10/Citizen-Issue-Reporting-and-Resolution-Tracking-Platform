import Link from 'next/link';
import { ArrowLeft, FileCheck2, Flag, MapPinned, ShieldCheck } from 'lucide-react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  alternateText: string;
  alternateHref: string;
  alternateLabel: string;
  children: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  alternateText,
  alternateHref,
  alternateLabel,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgb(191_219_254_/_0.58),transparent_24%),radial-gradient(circle_at_22%_88%,rgb(209_250_229_/_0.38),transparent_22%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 px-10 py-10 text-white lg:flex lg:flex-col xl:px-16 xl:py-14">
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgb(148_163_184_/_0.14)_1px,transparent_1px),linear-gradient(90deg,rgb(148_163_184_/_0.14)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute -left-24 top-28 h-72 w-72 rounded-full border-[44px] border-blue-500/10" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full border-[48px] border-emerald-400/10" />

          <Link href="/" className="relative flex w-fit items-center gap-3" aria-label="Kthehu në faqen kryesore">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-xl shadow-black/20"><Flag className="h-5 w-5" aria-hidden="true" /></span>
            <span><span className="block text-[15px] font-extrabold tracking-[-0.02em]">Raporto Qytetin</span><span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Zëri yt. Veprimi ynë.</span></span>
          </Link>

          <div className="relative my-auto max-w-md py-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Pjesëmarrje qytetare</p>
            <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.05em]">Çdo problem meriton një gjurmë të qartë.</h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-300">Nga raportimi deri te zgjidhja, platforma ruan procesin të kuptueshëm për qytetarin dhe të menaxhueshëm për komunën.</p>

            <div className="mt-10 space-y-3 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/15 text-blue-200"><MapPinned className="h-4.5 w-4.5" aria-hidden="true" /></span><div><p className="text-sm font-bold">Lokacion i kontrolluar</p><p className="mt-0.5 text-xs text-slate-400">Publikohet vetëm forma e përshtatshme për publik.</p></div></div>
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200"><FileCheck2 className="h-4.5 w-4.5" aria-hidden="true" /></span><div><p className="text-sm font-bold">Histori e dokumentuar</p><p className="mt-0.5 text-xs text-slate-400">Çdo ndryshim i statusit ka kuptim dhe kohë.</p></div></div>
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200"><ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" /></span><div><p className="text-sm font-bold">Identitet i mbrojtur</p><p className="mt-0.5 text-xs text-slate-400">Emri dhe email-i nuk shfaqen në portalin publik.</p></div></div>
            </div>
          </div>

          <p className="relative text-xs leading-5 text-slate-500">Projekt akademik me të dhëna sintetike. Nuk përdoret për raste emergjente.</p>
        </aside>

        <main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-950"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white"><Flag className="h-4 w-4" /></span> Raporto Qytetin</Link>
              <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-950"><ArrowLeft className="h-3.5 w-3.5" /> Faqja kryesore</Link>
            </div>

            <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-[2.1rem]">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-7">{children}</div>
              <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">{alternateText} <Link href={alternateHref} className="font-bold text-blue-700 hover:text-blue-800">{alternateLabel}</Link></div>
            </div>

            <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-950"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Kthehu në faqen kryesore</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
