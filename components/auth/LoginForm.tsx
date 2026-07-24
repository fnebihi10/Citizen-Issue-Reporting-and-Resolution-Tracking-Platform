'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { translateSignInError } from '@/lib/auth/messages';
import { createClient } from '@/lib/supabase/client';

type LoginFormProps = {
  nextPath: string;
  callbackFailed: boolean;
};

const authInputClassName =
  'field-input rounded-[14px] border-slate-200 bg-white/75 pl-11 text-[15px] shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-blue-100';

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
      {error ? <div role="alert" aria-live="assertive" className="mb-4 rounded-[16px] border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800">{error}</div> : null}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-bold tracking-[-0.01em] text-slate-800">Email-i</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ti@example.com" className={[authInputClassName, 'pr-4'].join(' ')} aria-invalid={Boolean(error)} />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="password" className="text-[13px] font-bold tracking-[-0.01em] text-slate-800">Fjalëkalimi</label>
            <Link href="/forgot-password" className="rounded-md px-1 py-0.5 text-xs font-bold text-blue-700 underline-offset-4 transition-colors hover:text-blue-900 hover:underline">E harrove?</Link>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <PasswordInput id="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Fjalëkalimi yt" className={[authInputClassName, 'pr-12'].join(' ')} aria-invalid={Boolean(error)} />
          </div>
        </div>
        <Button
          type="submit"
          size="lg"
          className="group relative w-full overflow-hidden rounded-[14px] border border-blue-400/30 bg-[linear-gradient(110deg,#061a3a_0%,#0b5dcb_56%,#0784b2_100%)] shadow-[0_16px_30px_-14px_rgba(15,75,170,0.68)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_20px_34px_-14px_rgba(15,75,170,0.76)] motion-reduce:transform-none motion-reduce:transition-none"
          disabled={loading}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.28),transparent_35%)]" aria-hidden="true" />
          <LockKeyhole className="relative h-4 w-4" aria-hidden="true" />
          <span className="relative">{loading ? 'Duke hyrë...' : 'Hyr në llogari'}</span>
        </Button>
      </form>
    </>
  );
}
