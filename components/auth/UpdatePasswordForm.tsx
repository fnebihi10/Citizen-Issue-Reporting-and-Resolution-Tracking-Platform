'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Circle, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { getPasswordRequirements, getPasswordValidationError } from '@/lib/auth/password';
import { createClient } from '@/lib/supabase/client';

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const passwordRequirements = useMemo(() => getPasswordRequirements(password), [password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const passwordError = getPasswordValidationError(password);
    if (passwordError) return setError(passwordError);
    if (password !== confirmPassword) return setError('Fjalëkalimet nuk përputhen.');

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError('Linku ka skaduar ose sesioni nuk është më i vlefshëm. Kërko një link të ri.');
      setLoading(false);
      return;
    }

    setSuccess('Fjalëkalimi u ndryshua me sukses. Po të dërgojmë te llogaria…');
    window.setTimeout(() => router.replace('/account'), 800);
  }

  return (
    <>
      {error ? <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800">{error}</div> : null}
      {success ? <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm leading-5 text-emerald-800">{success}</div> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-800">Fjalëkalimi i ri</label><PasswordInput id="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Krijo fjalëkalimin e ri" aria-invalid={Boolean(error)} /></div>
        {password ? <ul className="grid gap-1.5 rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-600 sm:grid-cols-2">{passwordRequirements.map((requirement) => <li key={requirement.label} className={`flex items-center gap-1.5 ${requirement.met ? 'text-emerald-700' : ''}`}>{requirement.met ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5 text-slate-300" />}{requirement.label}</li>)}</ul> : null}
        <div><label htmlFor="confirm-password" className="mb-2 block text-sm font-bold text-slate-800">Përsërite fjalëkalimin</label><PasswordInput id="confirm-password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Përsërite fjalëkalimin" aria-invalid={Boolean(error)} /></div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}><KeyRound className="h-4 w-4" aria-hidden="true" />{loading ? 'Duke ruajtur...' : 'Ruaj fjalëkalimin'}</Button>
      </form>
    </>
  );
}
