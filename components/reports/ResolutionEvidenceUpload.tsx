'use client';

import {
  AlertTriangle,
  FileImage,
  LoaderCircle,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react';
import { useMemo, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { stripImageMetadata } from '@/lib/reports/stripExif';
import { validateReportImage } from '@/lib/reports/validation';

function imageExtension(mimeType: string) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

export function ResolutionEvidenceUpload({ reportId }: { reportId: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sanitizing, setSanitizing] = useState(false);
  const [uploading, setUploading] = useState(false);

  function clearSelection() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleFileChange(nextFile: File | null) {
    setError(null);
    setNotice(null);
    clearSelection();
    if (!nextFile) return;

    const validationError = validateReportImage(nextFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSanitizing(true);
    try {
      const sanitizedFile = await stripImageMetadata(nextFile);
      const sanitizedFileError = validateReportImage(sanitizedFile);
      if (sanitizedFileError) throw new Error(sanitizedFileError);
      setFile(sanitizedFile);
    } catch {
      setError(
        'Fotografia nuk mund të përgatitej pa metadata private. Provo një fotografi tjetër.',
      );
    } finally {
      setSanitizing(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (!file || sanitizing || uploading) return;

    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      setError('Sesioni ka skaduar. Hyr përsëri para ngarkimit.');
      return;
    }

    const objectPath = `reports/${reportId}/${crypto.randomUUID()}.${imageExtension(file.type)}`;
    const { error: uploadError } = await supabase.storage
      .from('report-evidence')
      .upload(objectPath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Resolution evidence upload failed', uploadError);
      setUploading(false);
      setError(
        'Prova nuk mund të ngarkohej. Kontrollo autorizimin dhe provo përsëri.',
      );
      return;
    }

    const { error: attachmentError } = await supabase
      .from('report_attachments')
      .insert({
        report_id: reportId,
        uploaded_by: user.id,
        bucket_id: 'report-evidence',
        object_path: objectPath,
        kind: 'resolution',
        mime_type: file.type,
        size_bytes: file.size,
        is_internal: false,
      });

    if (attachmentError) {
      const { error: cleanupError } = await supabase.storage
        .from('report-evidence')
        .remove([objectPath]);
      if (cleanupError) {
        console.error('Unregistered resolution evidence cleanup failed', cleanupError);
      }
      console.error('Resolution evidence registration failed', attachmentError);
      setUploading(false);
      setError(
        cleanupError
          ? 'Metadata nuk u regjistrua dhe pastrimi automatik dështoi. Skedari mbetet privat; njofto administratorin.'
          : 'Metadata nuk u regjistrua. Skedari i paregjistruar u hoq automatikisht.',
      );
      return;
    }

    clearSelection();
    setUploading(false);
    setNotice('Prova e zgjidhjes u ngarkua dhe u regjistrua me sukses.');
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 min-w-0 max-w-full rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
          <FileImage className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-black text-slate-950">
            Ngarko provën e zgjidhjes
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Fotografia është e dukshme vetëm për qytetarin dhe stafin; nuk
            publikohet në faqen publike.
          </p>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-800"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}
      {notice ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-800"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      ) : null}

      <label
        htmlFor={`resolution-photo-${reportId}`}
        className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-blue-200 bg-white px-3 text-sm font-bold text-slate-700 hover:border-blue-300"
      >
        {sanitizing ? (
          <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" aria-hidden="true" />
        ) : (
          <UploadCloud className="h-4 w-4 text-blue-600" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1 truncate">
          {sanitizing
            ? 'Duke hequr metadata private...'
            : file?.name ?? 'Zgjidh JPG, PNG ose WebP · maksimumi 10 MB'}
        </span>
        <input
          ref={fileInputRef}
          id={`resolution-photo-${reportId}`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={sanitizing || uploading}
          onChange={(event) =>
            void handleFileChange(event.target.files?.[0] ?? null)
          }
        />
      </label>

      {file ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="flex min-w-0 flex-1 items-center gap-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            EXIF/GPS metadata u hoq para ngarkimit.
          </p>
          <button
            type="button"
            onClick={clearSelection}
            disabled={uploading}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50"
            aria-label="Hiqe fotografinë e zgjedhur"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <Button type="submit" disabled={uploading || sanitizing}>
            {uploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <UploadCloud className="h-4 w-4" aria-hidden="true" />
            )}
            {uploading ? 'Duke ngarkuar...' : 'Ngarko provën'}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
