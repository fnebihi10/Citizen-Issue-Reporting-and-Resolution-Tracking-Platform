import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flag } from 'lucide-react';

type FocusedAuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  alternateText: string;
  alternateHref: string;
  alternateLabel: string;
  variant: 'login' | 'register' | 'recovery';
  children: ReactNode;
};

export function FocusedAuthShell({
  eyebrow,
  title,
  description,
  alternateText,
  alternateHref,
  alternateLabel,
  variant,
  children,
}: FocusedAuthShellProps) {
  const isRegister = variant === 'register';

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#edf3fb]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(72%_54%_at_50%_-10%,rgba(37,99,235,0.24),transparent_70%),radial-gradient(44%_38%_at_3%_92%,rgba(45,212,191,0.15),transparent_72%),linear-gradient(135deg,#f7f9fd_0%,#edf4ff_50%,#f5faf9_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[min(80vw,780px)] -translate-x-1/2 rounded-b-[100%] border-b border-blue-100/70"
        aria-hidden="true"
      />

      <main
        className={[
          'relative mx-auto flex min-h-screen w-full items-center justify-center px-4 sm:px-6',
          isRegister ? 'py-4 sm:py-5' : 'py-6 sm:py-10',
        ].join(' ')}
      >
        <div className={['relative w-full', isRegister ? 'max-w-[620px]' : 'max-w-[520px]'].join(' ')}>
          <header className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="Kthehu në faqen kryesore">
              <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] bg-[#061a3a] text-white shadow-[0_16px_32px_-15px_rgba(6,26,58,0.85)] transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <span className="absolute inset-px rounded-[14px] border border-white/10" aria-hidden="true" />
                <Flag className="relative h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#edf3fb] bg-teal-400" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[15px] font-bold leading-tight tracking-[-0.025em] text-slate-950">Raporto Qytetin</span>
                <span className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:block">Platforma qytetare</span>
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-white/85 hover:text-slate-950"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Ballina
            </Link>
          </header>

          <div className="relative">
            <div className="pointer-events-none absolute inset-x-8 -bottom-7 h-16 rounded-[32px] bg-blue-300/20 blur-2xl" aria-hidden="true" />
            <section
              className="relative overflow-hidden rounded-[30px] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,251,255,0.96))] p-5 shadow-[0_32px_90px_-40px_rgba(15,35,69,0.48),0_18px_32px_-28px_rgba(30,64,175,0.3)] sm:p-6"
              aria-labelledby="auth-title"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-white" aria-hidden="true" />
              <div className="absolute left-8 top-0 h-1 w-32 rounded-b-full bg-gradient-to-r from-[#061a3a] via-blue-600 to-teal-400" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-blue-100/80" aria-hidden="true" />
              <div className="pointer-events-none absolute right-7 top-9 h-32 w-32 rounded-full border border-teal-100/80" aria-hidden="true" />
              <div className="pointer-events-none absolute right-[4.6rem] top-[5.5rem] h-2 w-2 rounded-full bg-teal-400/80 shadow-[0_0_0_6px_rgba(45,212,191,0.1)]" aria-hidden="true" />

              <div className="relative">
                <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
                  {eyebrow}
                </p>
                <h1 id="auth-title" className="mt-3 text-[1.9rem] font-bold leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-[2.25rem]">
                  {title}
                </h1>
                <p className="mt-2.5 max-w-xl text-[14px] leading-6 text-slate-600">{description}</p>

                <div className="mt-5">{children}</div>

                <div className="mt-5 border-t border-slate-100 pt-4 text-center text-sm leading-6 text-slate-500">
                  {alternateText}{' '}
                  <Link href={alternateHref} className="font-bold text-blue-700 underline-offset-4 transition-colors hover:text-blue-900 hover:underline">
                    {alternateLabel}
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <p className="mt-3 text-center text-[11px] font-medium leading-5 text-slate-500">Për çështje komunale jo-emergjente.</p>
        </div>
      </main>
    </div>
  );
}
