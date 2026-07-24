'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={cn('field-input pr-12', className)} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-0.5 top-0.5 flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label={visible ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
