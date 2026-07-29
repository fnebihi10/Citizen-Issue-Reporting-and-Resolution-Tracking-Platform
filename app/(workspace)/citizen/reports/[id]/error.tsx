'use client';

import { ErrorState } from '@/components/ui/FeedbackState';
import { Button } from '@/components/ui/button';

export default function CitizenReportDetailError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <ErrorState
        description="Detajet e raportimit nuk mund të ngarkohen."
        action={<Button onClick={reset}>Provo përsëri</Button>}
      />
    </div>
  );
}
