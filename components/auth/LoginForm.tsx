'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { translateSignInError } from '@/lib/auth/messages';
import { createClient } from '@/lib/supabase/client';

type LoginFormProps = {
  nextPath: string;
  callbackFailed: boolean;
};

export function LoginForm({ nextPath, callbackFailed }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    callbackFailed
      ? 'Linku i konfirmimit nuk mundi të përpunohej. Kërko një email të ri dhe provo përsëri.'
      : '',
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setError(translateSignInError(signInError.message));
      setLoading(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <>
      {error ? <div role="alert" aria-live="assertive" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800">{error}</div> : null}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">Email-i</label>
          <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ti@example.com" className="field-input" aria-invalid={Boolean(error)} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="password" className="text-sm font-bold text-slate-800">Fjalëkalimi</label><Link href="/forgot-password" className="text-xs font-bold text-blue-700 hover:text-blue-800">E harrove?</Link></div>
          <PasswordInput id="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Fjalëkalimi yt" aria-invalid={Boolean(error)} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}><LockKeyhole className="h-4 w-4" aria-hidden="true" />{loading ? 'Duke hyrë...' : 'Hyr në llogari'}</Button>
      </form>
    </>
  );
}
