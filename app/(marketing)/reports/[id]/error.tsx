'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/FeedbackState';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <ErrorState
        title="Raportimi publik nuk u ngarkua"
        description="Provo përsëri. Të dhënat private nuk ekspozohen edhe kur kërkesa dështon."
        action={<Button onClick={reset}>Provo përsëri</Button>}
      />
    </div>
  );
}
