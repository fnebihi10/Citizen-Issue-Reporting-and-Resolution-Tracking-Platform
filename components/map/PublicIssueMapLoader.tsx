'use client';

import dynamic from 'next/dynamic';
import type { PublicReport } from '@/types/database';

const PublicIssueMap = dynamic(() => import('./PublicIssueMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[440px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 sm:h-[600px]">
      Duke përgatitur hartën publike...
    </div>
  ),
});

const CompactPublicIssueMap = dynamic(() => import('./PublicIssueMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 sm:h-[380px]">
      Duke përgatitur hartën publike...
    </div>
  ),
});

export function PublicIssueMapLoader({
  reports,
  compact = false,
}: {
  reports: PublicReport[];
  compact?: boolean;
}) {
  return compact ? (
    <CompactPublicIssueMap reports={reports} compact />
  ) : (
    <PublicIssueMap reports={reports} />
  );
}
