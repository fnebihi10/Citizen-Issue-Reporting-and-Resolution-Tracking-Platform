import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  Eye,
  FilePenLine,
  MapPin,
  Route,
  ShieldCheck,
} from 'lucide-react';
import { buttonVariantsClass } from '@/components/ui/button';

const workflow = [
  {
    number: '01',
    label: 'Qytetari',
    title: 'Përgatit raportimin',
    description: 'Çështja përshkruhet me informacionin që nevojitet për ta kuptuar në kontekst.',
    icon: FilePenLine,
  },
  {
    number: '02',
    label: 'Komuna',
    title: 'E shqyrton përgjegjësinë',
    description: 'Raporti verifikohet dhe orientohen hapat e trajtimit te departamenti përkatës.',
    icon: Building2,
  },
  {
    number: '03',
    label: 'Procesi',
    title: 'E bën progresin të qartë',
    description: 'Statusi dhe historia e shpjegojnë rrugën nga vërejtja deri te zgjidhja.',
    icon: Eye,
  },
] as const;

const categories = ['Rrugë dhe gropa', 'Ndriçim publik', 'Mbeturina', 'Sinjalistikë'] as const;

function CivicMapIllustration() {
  return (
    <div className="relative isolate h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b2a4c] p-5 sm:h-[380px] sm:p-7" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgb(56_189_248_/_0.28),transparent_26%),radial-gradient(circle_at_82%_78%,rgb(45_212_191_/_0.20),transparent_30%)]" />
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
      <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/10" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 430" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-28 93C67 32 142 69 204 134C267 200 322 198 390 144C456 92 518 92 639 149" stroke="rgba(191,219,254,0.44)" strokeWidth="2" />
        <path d="M-4 319C92 258 166 279 235 326C302 372 385 370 446 305C505 242 558 233 633 250" stroke="rgba(94,234,212,0.38)" strokeWidth="2" />
        <path d="M129 -12C112 85 158 137 236 159C305 179 358 228 348 321C341 368 372 407 431 443" stroke="rgba(191,219,254,0.26)" strokeWidth="1.5" strokeDasharray="8 10" />
        <path d="M483 -20C432 65 446 135 492 184C544 240 532 325 473 440" stroke="rgba(94,234,212,0.26)" strokeWidth="1.5" strokeDasharray="8 10" />
        <circle cx="206" cy="134" r="10" fill="#60A5FA" />
        <circle cx="206" cy="134" r="22" stroke="rgba(96,165,250,0.35)" strokeWidth="2" />
        <circle cx="390" cy="144" r="10" fill="#5EEAD4" />
        <circle cx="390" cy="144" r="22" stroke="rgba(94,234,212,0.30)" strokeWidth="2" />
        <circle cx="348" cy="321" r="10" fill="#93C5FD" />
        <circle cx="348" cy="321" r="22" stroke="rgba(147,197,253,0.28)" strokeWidth="2" />
      </svg>

      <div className="relative flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100">
          Rrjedha e synuar
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-teal-200">
          <Route className="h-4 w-4" />
        </span>
      </div>

      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/15 text-blue-100">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200">Nga vërejtja te veprimi</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">Një rrugë e dokumentuar e bën përgjegjësinë dhe progresin më të kuptueshëm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="overflow-x-clip bg-[#f7f9fc]">
      <section className="relative overflow-hidden bg-[#071a34] text-white">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgb(148_163_184_/_0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(148_163_184_/_0.08)_1px,transparent_1px)] [background-size:42px_42px]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgb(7_26_52),transparent)]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl gap-11 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              <span className="h-2 w-2 rounded-full bg-teal-300" aria-hidden="true" />
              Platformë për probleme komunale
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.06] tracking-[-0.05em] text-white sm:text-5xl xl:text-6xl">
              Nga një vërejtje lokale, te një proces i dukshëm.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Raporto Qytetin është projektuar për të krijuar një lidhje më të qartë mes qytetarëve, çështjeve komunale dhe hapave drejt zgjidhjes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className={buttonVariantsClass({ size: 'lg', className: 'bg-white text-slate-950 shadow-none hover:bg-blue-50' })}>
                Krijo llogari qytetare
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/#si-funksionon" className={buttonVariantsClass({ variant: 'secondary', size: 'lg', className: 'border-white/20 bg-white/10 text-white shadow-none hover:border-white/30 hover:bg-white/15 hover:text-white' })}>
                Shih rrjedhën
              </Link>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-teal-300" aria-hidden="true" />
              Për çështje komunale jo-emergjente.
            </p>
          </div>

          <CivicMapIllustration />
        </div>
      </section>

      <section id="si-funksionon" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Si funksionon</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">Një rrugë e thjeshtë, e ndërtuar për qartësi.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Jo një formular që humbet në sistem, por një proces ku çdo hap ka vendin dhe përgjegjësinë e vet.</p>
          </div>

          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-slate-200 md:block" aria-hidden="true" />
            <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
              {workflow.map((step) => {
                const Icon = step.icon;

                return (
                  <li key={step.number} className="relative pt-1">
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-[0_12px_30px_-18px_rgba(37,99,235,0.65)]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{step.number} · {step.label}</p>
                    <h3 className="mt-3 text-xl font-bold tracking-[-0.025em] text-slate-950">{step.title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">{step.description}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section id="per-platformen" className="scroll-mt-20 border-y border-slate-200 bg-[#eef4fb]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-16 lg:px-8 lg:py-24">
          <div className="rounded-[28px] bg-[#10345d] p-7 text-white shadow-[0_28px_70px_-42px_rgba(15,23,42,0.85)] sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">Fusha e raportimit</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Çështje të përditshme që kërkojnë vëmendje.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">Fokusi fillestar është te problemet komunale që mund të dokumentohen dhe të trajtohen nga shërbimet përkatëse.</p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <li key={category} className="flex items-center gap-3 border-t border-white/15 py-3 text-sm font-semibold text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-300 text-[#10345d]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 lg:pt-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Privatësi publike me kufij të qartë</p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">Problemi mund të shihet. Personi nuk ekspozohet.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Në pamjen publike të platformës do të paraqitet vetëm informacioni që ndihmon të kuptohet çështja dhe progresi i saj, pa bërë publike identitetin apo kontaktet e qytetarit.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="border-l-2 border-blue-600 pl-4">
                <p className="font-bold text-slate-950">Mund të paraqitet</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Kategoria, statusi, historia e trajtimit dhe informacioni i përshtatshëm për transparencë.</p>
              </div>
              <div className="border-l-2 border-teal-500 pl-4">
                <p className="font-bold text-slate-950">Mbetet private</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Emri, email-i, telefoni, lokacioni i ndjeshëm dhe çdo detaj që mund të identifikojë qytetarin.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <aside className="flex items-start gap-3 border-t border-slate-300 py-5 text-sm leading-6 text-slate-700" aria-label="Njoftim për raste emergjente">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <p>
              <strong className="text-slate-950">Rast emergjent?</strong> Kjo
              platformë nuk përdoret për emergjenca. Telefono menjëherë{' '}
              <a
                href="tel:112"
                className="font-black text-slate-950 underline decoration-2 underline-offset-2"
              >
                112
              </a>
              , numri unik emergjent pa pagesë në Republikën e Kosovës.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
