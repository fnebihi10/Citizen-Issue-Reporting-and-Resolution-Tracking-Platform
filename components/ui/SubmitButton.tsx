'use client';

import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { buttonVariantsClass } from '@/components/ui/button';

export function SubmitButton({
  children,
  pendingLabel = 'Duke ruajtur...',
  variant = 'primary',
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonVariantsClass({
        size: 'md',
        variant: variant === 'danger' ? 'destructive' : variant,
      })}
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
