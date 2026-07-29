'use client';

import { ErrorState } from '@/components/ui/FeedbackState';
import { Button } from '@/components/ui/button';

export default function OfficialReportsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <ErrorState
        description="Inbox-i zyrtar nuk mund të ngarkohet."
        action={<Button onClick={reset}>Provo përsëri</Button>}
      />
    </div>
  );
}
