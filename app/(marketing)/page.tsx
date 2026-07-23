import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDotDashed,
  Clock3,
  Construction,
  FilePlus2,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Signpost,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Category = {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
};

const categories: Category[] = [
  {
    title: 'Rrugë dhe gropa',
    description: 'Asfalt i dëmtuar, gropa, trotuare dhe punime të papërfunduara.',
    detail: 'Infrastrukturë publike',
    icon: Construction,
    iconClassName: 'text-amber-700',
    iconBackgroundClassName: 'bg-amber-100',
  },
  {
    title: 'Ndriçim publik',
    description: 'Llamba, shtylla ose hapësira publike që kërkojnë mirëmbajtje.',
    detail: 'Shërbime publike',
    icon: Lightbulb,
    iconClassName: 'text-sky-700',
    iconBackgroundClassName: 'bg-sky-100',
  },
  {
    title: 'Mbeturina',
    description: 'Kontejnerë të mbushur, mungesë pastrimi dhe deponi ilegale.',
    detail: 'Mjedis i pastër',
    icon: Trash2,
    iconClassName: 'text-emerald-700',
    iconBackgroundClassName: 'bg-emerald-100',
  },
  {
    title: 'Sinjalistikë',
    description: 'Shenja trafiku, semaforë ose vijëzime rrugore të dëmtuara.',
    detail: 'Siguri në komunikacion',
    icon: Signpost,
    iconClassName: 'text-violet-700',
    iconBackgroundClassName: 'bg-violet-100',
  },
];

const processSteps = [
  ['01', 'Raporto', 'Përshkruaj problemin dhe zgjidh lokacionin.'],
  ['02', 'Verifikohet', 'Zyrtari e shqyrton përpara caktimit.'],
  ['03', 'Ndiqet', 'Historia dhe statusi shpjegojnë progresin.'],
  ['04', 'Dokumentohet', 'Zgjidhja bëhet e dukshme pa të dhëna private.'],
] as const;

function StatusStep({ label, completed, active }: { label: string; completed?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black ${
          completed
            ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
            : active
              ? 'border-blue-200 bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'border-slate-200 bg-white text-slate-400'
        }`}
      >
        {completed ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : active ? '3' : '4'}
      </span>
      <span className={`text-sm font-semibold ${active ? 'text-slate-950' : 'text-slate-500'}`}>{label}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-slate-200 bg-[#f7f9fc]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgb(191_219_254_/_0.72),transparent_28%),radial-gradient(circle_at_13%_77%,rgb(209_250_229_/_0.5),transparent_23%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div>
            <Badge className="border-blue-200 bg-white/80 text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden="true" />
              Për probleme komunale jo-emergjente
            </Badge>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-black leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-[4.35rem]">
              Një raportim i qartë. Një qytet më i përgjegjshëm.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Raporto një problem lokal, ndiq trajtimin dhe shih vendimin përfundimtar — me privatësinë e qytetarit të mbrojtur në çdo hap.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className={buttonVariantsClass({ size: 'lg' })}>
                <FilePlus2 className="h-5 w-5" aria-hidden="true" />
                Krijo llogari qytetare
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/#si-funksionon" className={buttonVariantsClass({ variant: 'secondary', size: 'lg' })}>
                Shih procesin
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2 text-slate-600"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Privatësi sipas dizajnit</div>
              <div className="flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4 text-blue-600" /> Lokacion në hartë</div>
              <div className="flex items-center gap-2 text-slate-600"><Clock3 className="h-4 w-4 text-violet-600" /> Status i gjurmueshëm</div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-7 -z-10 rounded-[2.5rem] bg-blue-200/45 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-3 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.28)]">
              <div className="relative overflow-hidden rounded-[1.45rem] bg-slate-950 px-5 py-6 text-white sm:px-7 sm:py-8">
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(148_163_184_/_0.14)_1px,transparent_1px),linear-gradient(90deg,rgb(148_163_184_/_0.14)_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="absolute -right-16 top-12 h-44 w-44 rounded-full border-[28px] border-blue-500/15" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">Pamje konceptuale</p>
                    <h2 className="mt-2 text-xl font-extrabold tracking-tight">Gjurmë e plotë e raportimit</h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-100 ring-1 ring-white/15">
                    <CircleDotDashed className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="relative mt-7 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">Raport sintetik #024</p>
                      <p className="mt-1 text-sm font-bold text-white">Ndriçim i dëmtuar në hapësirë publike</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-400/15 px-2.5 py-1 text-[11px] font-bold text-blue-100 ring-1 ring-blue-300/20">Në proces</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-300"><MapPin className="h-3.5 w-3.5 text-blue-300" /> Lokacion i përafërt për publikim</div>
                </div>

                <div className="relative mt-5 space-y-3 rounded-2xl bg-white p-4 text-slate-950 shadow-xl shadow-black/10">
                  <StatusStep label="Dorëzuar nga qytetari" completed />
                  <StatusStep label="Verifikuar nga komuna" completed />
                  <StatusStep label="Në proces nga departamenti" active />
                  <StatusStep label="Zgjidhja dokumentohet" />
                </div>

                <p className="relative mt-5 text-center text-[11px] font-medium text-slate-400">Ilustrim me të dhëna sintetike — jo raport real.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-amber-200/80 bg-amber-50/70">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-4 text-sm leading-6 text-amber-950 sm:px-6 lg:px-8">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
          <p><strong>Rast emergjent?</strong> Mos përdor këtë platformë. Kontakto menjëherë kanalet zyrtare të emergjencës në <strong>112</strong>.</p>
        </div>
      </section>

      <section id="kategorite" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Fusha e raportimit</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">Katër kategori. Një proces i njëtrajtshëm.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Fokusi i platformës është te çështjet komunale që mund të dokumentohen, trajtohen dhe ndiqen në mënyrë të qartë.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="group flex min-h-64 flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${category.iconBackgroundClassName} ${category.iconClassName}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-extrabold text-slate-950">{category.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{category.description}</p>
                <p className="mt-5 flex items-center gap-1 text-xs font-bold text-slate-500"><ChevronRight className="h-3.5 w-3.5 text-blue-600" /> {category.detail}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="si-funksionon" className="scroll-mt-24 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">Procesi i zgjidhjes</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Nga vërejtja te vendimi, pa humbur gjurmën.</h2>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-4 md:gap-5">
            {processSteps.map(([number, title, description], index) => (
              <div key={number} className="relative">
                {index < processSteps.length - 1 ? <div className="absolute left-10 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-slate-700 md:block" /> : null}
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/10 text-xs font-black text-blue-200">{number}</span>
                <h3 className="mt-5 text-base font-bold">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="transparenca" className="scroll-mt-24 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Privatësi dhe transparencë</Badge>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">Publikohet problemi, jo identiteti i personit.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">Pamja publike është ndërtuar për llogaridhënie: tregon kategorinë, progresin dhe lokacionin e përafërt, pa publikuar emër, email ose të dhëna private.</p>
          </div>
          <Card className="overflow-hidden border-slate-200 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.28)]">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Çfarë sheh publiku</p></div>
            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-slate-100 p-5 sm:border-b-0 sm:border-r"><p className="text-sm font-bold text-slate-950">Raporti dhe progresi</p><p className="mt-2 text-sm leading-6 text-slate-500">Titulli publik, kategori, status, histori dhe zgjidhja e dokumentuar.</p></div>
              <div className="p-5"><p className="text-sm font-bold text-slate-950">Jo të dhëna personale</p><p className="mt-2 text-sm leading-6 text-slate-500">Pa emër, email, telefon, adresë të saktë apo fotografi identifikuese.</p></div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-[2rem] bg-blue-600 px-6 py-9 text-white shadow-2xl shadow-blue-600/20 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-11">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">Hapi i parë</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Krijo llogarinë dhe mbaje çdo raportim të gjurmueshëm.</h2></div>
          <Link href="/register" className={buttonVariantsClass({ variant: 'dark', size: 'lg', className: 'shrink-0' })}>Krijo llogari <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
