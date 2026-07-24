'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AlertTriangle, FileImage, FileText, Info, MapPin, Send, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Category } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { validateCitizenReport, validateReportImage } from '@/lib/reports/validation';
import { createCitizenReport } from '@/app/(workspace)/citizen/report/actions';
import type { ReportCoordinates } from './LocationPicker';

const LocationPicker = dynamic(() => import('./LocationPicker').then((module) => module.LocationPicker), {
  ssr: false,
  loading: () => <div className="flex h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500 sm:h-[360px]">Duke përgatitur hartën...</div>,
});

function sanitizeFileName(fileName: string) {
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return safeName.slice(-80) || 'evidence';
}

export function ReportForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [addressText, setAddressText] = useState('');
  const [coordinates, setCoordinates] = useState<ReportCoordinates | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(nextFile: File | null) {
    setError(null);
    setWarning(null);
    setNotice(null);
    if (!nextFile) {
      setFile(null);
      return;
    }
    const fileError = validateReportImage(nextFile);
    if (fileError) {
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setError(fileError);
      return;
    }
    setFile(nextFile);
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setAddressText('');
    setCoordinates(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setWarning(null);
    setNotice(null);
    const validationError = validateCitizenReport({
      title,
      description,
      categoryId,
      addressText,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const result = await createCitizenReport({
      title,
      description,
      categoryId,
      addressText,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
    });

    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }

    const report = result.report;
    const supabase = createClient();

    if (file) {
      const { data: { user } } = await supabase.auth.getUser();
      const objectPath = `reports/${report.id}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
      const { error: uploadError } = user ? await supabase.storage.from('report-evidence').upload(objectPath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      }) : { error: new Error('Session expired') };

      if (uploadError) {
        resetForm();
        setLoading(false);
        setWarning(`Raportimi #${report.reportNumber} u ruajt, por fotografia nuk u ngarkua. Mund ta provosh përsëri nga raportimet e tua.`);
        router.refresh();
        return;
      }

      const { error: attachmentError } = await supabase.from('report_attachments').insert({
        report_id: report.id,
        uploaded_by: user?.id,
        bucket_id: 'report-evidence',
        object_path: objectPath,
        kind: 'evidence',
        mime_type: file.type,
        size_bytes: file.size,
        is_internal: false,
      });

      if (attachmentError) {
        await supabase.storage.from('report-evidence').remove([objectPath]);
        resetForm();
        setLoading(false);
        setWarning(`Raportimi #${report.reportNumber} u ruajt, por fotografia nuk u regjistrua. Prova e papërdorur u hoq.`);
        router.refresh();
        return;
      }
    }

    resetForm();
    setNotice(`Raportimi #${report.reportNumber} u dorëzua me sukses. Mund ta ndjekësh statusin te raportimet e tua.`);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error ? <div role="alert" aria-live="assertive" className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm leading-6 text-rose-800"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><span>{error}</span></div> : null}
      {warning ? <div role="status" aria-live="polite" className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm leading-6 text-amber-900"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><span>{warning} <Link href="/citizen/reports" className="font-bold underline underline-offset-2">Hap raportimet</Link>.</span></div> : null}
      {notice ? <div role="status" aria-live="polite" className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm leading-6 text-emerald-800"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><span>{notice} <Link href="/citizen/reports" className="font-bold underline underline-offset-2">Hap raportimet</Link>.</span></div> : null}

      <Card className="p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><FileText className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="font-black tracking-tight text-slate-950">Përshkrimi i problemit</h2><p className="mt-1 text-sm leading-6 text-slate-600">Jep informacion të mjaftueshëm që komuna ta kuptojë dhe verifikojë çështjen.</p></div></div>
        <div className="mt-6 grid gap-5">
          <div><label htmlFor="report-title" className="mb-2 block text-sm font-bold text-slate-800">Titulli <span className="text-rose-600">*</span></label><input id="report-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} placeholder="p.sh. Gropë e madhe në rrugë" className="field-input" aria-describedby="title-help" required /><p id="title-help" className="mt-1.5 text-xs text-slate-500">5–160 karaktere.</p></div>
          <div><label htmlFor="report-description" className="mb-2 block text-sm font-bold text-slate-800">Përshkrimi <span className="text-rose-600">*</span></label><textarea id="report-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={5000} placeholder="Përshkruaj çfarë ka ndodhur, sa kohë e ke vërejtur dhe pse kërkon trajtim." className="min-h-36 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100" aria-describedby="description-help" required /><p id="description-help" className="mt-1.5 text-xs text-slate-500">10–5000 karaktere. Mos përfshi të dhëna personale të personave të tjerë.</p></div>
          <div><label htmlFor="report-category" className="mb-2 block text-sm font-bold text-slate-800">Kategoria <span className="text-rose-600">*</span></label><select id="report-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="field-input" required><option value="">Zgjidh kategorinë</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><MapPin className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="font-black tracking-tight text-slate-950">Lokacioni</h2><p className="mt-1 text-sm leading-6 text-slate-600">Lokacioni i saktë ruhet vetëm për trajtimin e raportit dhe nuk publikohet.</p></div></div>
        <div className="mt-6"><LocationPicker value={coordinates} onChange={setCoordinates} /></div>
        <div className="mt-5"><label htmlFor="report-address" className="mb-2 block text-sm font-bold text-slate-800">Përshkrim i shkurtër i vendit <span className="font-normal text-slate-500">(opsionale)</span></label><input id="report-address" value={addressText} onChange={(event) => setAddressText(event.target.value)} maxLength={240} placeholder="p.sh. pranë shkollës së lagjes" className="field-input" /><p className="mt-1.5 text-xs text-slate-500">Mos vendos adresë shtëpie ose informacion që identifikon persona.</p></div>
      </Card>

      <Card className="p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><FileImage className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="font-black tracking-tight text-slate-950">Fotografia e provës</h2><p className="mt-1 text-sm leading-6 text-slate-600">Një fotografi ndihmon në verifikim. Ngarko vetëm materiale sintetike ose të përshtatshme për demonstrim.</p></div></div>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"><label htmlFor="report-photo" className="flex cursor-pointer flex-col items-center justify-center text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm"><UploadCloud className="h-6 w-6" aria-hidden="true" /></span><span className="mt-3 text-sm font-bold text-slate-800">Zgjidh një fotografi</span><span className="mt-1 text-xs text-slate-500">JPG, PNG ose WebP · maksimumi 10 MB</span><input ref={fileInputRef} id="report-photo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)} /></label>{file ? <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-sm"><span className="flex min-w-0 items-center gap-2 text-slate-700"><FileImage className="h-4 w-4 shrink-0 text-violet-600" aria-hidden="true" /><span className="truncate">{file.name}</span></span><button type="button" onClick={() => handleFileChange(null)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Hiqe fotografinë"><X className="h-4 w-4" aria-hidden="true" /></button></div> : null}</div>
      </Card>

      <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5 text-sm leading-6 text-blue-950"><Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" /><p><strong>Privatësia:</strong> emri, email-i, fotografia dhe lokacioni i saktë nuk publikohen në hartën publike. Për emergjenca, përdor kanalet zyrtare të emergjencës; kjo platformë trajton vetëm çështje jo-emergjente.</p></div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}><Send className="h-4 w-4" aria-hidden="true" />{loading ? 'Duke dorëzuar...' : 'Dorëzo raportimin'}</Button>
    </form>
  );
}
