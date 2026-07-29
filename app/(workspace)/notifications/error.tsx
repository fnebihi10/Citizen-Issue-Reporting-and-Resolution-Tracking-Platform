'use client';

import { ErrorState } from '@/components/ui/FeedbackState';
import { Button } from '@/components/ui/button';

export default function NotificationsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <ErrorState
        description="Njoftimet nuk mund të ngarkohen."
        action={<Button onClick={reset}>Provo përsëri</Button>}
      />
    </div>
  );
}
