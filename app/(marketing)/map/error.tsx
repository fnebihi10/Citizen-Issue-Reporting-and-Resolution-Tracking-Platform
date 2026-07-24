'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/FeedbackState';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><ErrorState description="Harta publike pati një problem të papritur gjatë ngarkimit." action={<Button onClick={reset}>Provo përsëri</Button>} /></div>;
}
