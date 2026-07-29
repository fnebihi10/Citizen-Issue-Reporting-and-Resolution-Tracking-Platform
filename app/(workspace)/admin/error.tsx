'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4 py-12 text-center">
      <div className="w-full rounded-3xl border border-rose-200 bg-white p-8 shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-black text-slate-950">
          Paneli nuk u ngarkua
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Nuk u morën të gjitha të dhënat administrative. Provo përsëri pa
          ndryshuar asgjë.
        </p>
        <Button onClick={reset} className="mt-6">
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Provo përsëri
        </Button>
      </div>
    </div>
  );
}
