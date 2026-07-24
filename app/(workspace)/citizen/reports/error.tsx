'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/FeedbackState';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><ErrorState description="Raportimet e tua nuk mund të ngarkoheshin për shkak të një problemi të papritur." action={<Button onClick={reset}>Provo përsëri</Button>} /></div>;
}
