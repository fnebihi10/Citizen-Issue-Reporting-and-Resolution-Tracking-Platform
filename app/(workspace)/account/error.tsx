'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/FeedbackState';

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
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <ErrorState
        title="Llogaria nuk mund të ngarkohej"
        description="Pati një problem të papritur gjatë leximit të profilit. Provo përsëri."
        action={<Button onClick={reset}>Provo përsëri</Button>}
      />
    </div>
  );
}
