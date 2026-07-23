'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Circle, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { getPasswordRequirements, getPasswordValidationError } from '@/lib/auth/password';
import { translateSignUpError } from '@/lib/auth/messages';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
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

    const normalizedName = fullName.trim().replace(/\s+/g, ' ');
    if (normalizedName.length < 2 || normalizedName.length > 120) {
      setError('Shkruaj emrin dhe mbiemrin me 2 deri në 120 karaktere.');
      return;
    }

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen.');
      return;
    }

    setLoading(true);
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', '/account');

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: normalizedName },
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (signUpError) {
      setError(translateSignUpError(signUpError.message));
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace('/account');
      router.refresh();
      return;
    }

    setSuccess('Llogaria u krijua. Kontrollo email-in dhe kliko linkun e konfirmimit para hyrjes.');
    setLoading(false);
  }

  return (
    <AuthShell
      eyebrow="Llogari qytetare"
      title="Nis me një llogari të sigurt."
      description="Regjistrimi të lejon të dërgosh raportime dhe të ndjekësh çdo ndryshim të statusit."
      alternateText="Ke tashmë llogari?"
      alternateHref="/login"
      alternateLabel="Hyr këtu"
    >
      {error ? <div role="alert" aria-live="assertive" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800">{error}</div> : null}
      {success ? <div role="status" aria-live="polite" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm leading-5 text-emerald-800">{success}</div> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label htmlFor="full-name" className="mb-2 block text-sm font-bold text-slate-800">Emri dhe mbiemri</label><input id="full-name" name="fullName" type="text" autoComplete="name" required maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="p.sh. Alex Johnson" className="field-input" aria-invalid={Boolean(error)} /></div>
        <div><label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">Email-i</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ti@example.com" className="field-input" aria-invalid={Boolean(error)} /></div>
        <div><label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-800">Fjalëkalimi</label><PasswordInput id="password" name="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Krijo një fjalëkalim të fortë" aria-invalid={Boolean(error)} /></div>
        {password ? <ul className="grid gap-1.5 rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-600 sm:grid-cols-2">{passwordRequirements.map((requirement) => <li key={requirement.label} className={`flex items-center gap-1.5 ${requirement.met ? 'text-emerald-700' : ''}`}>{requirement.met ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />}{requirement.label}</li>)}</ul> : null}
        <div><label htmlFor="confirm-password" className="mb-2 block text-sm font-bold text-slate-800">Përsërite fjalëkalimin</label><PasswordInput id="confirm-password" name="confirmPassword" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Përsërite fjalëkalimin" aria-invalid={Boolean(error)} /></div>
        <p className="rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-900">Roli fillestar është gjithmonë <strong>qytetar</strong>. Ai nuk mund të caktohet ose ndryshohet nga forma publike.</p>
        <Button type="submit" size="lg" className="w-full" disabled={loading}><UserPlus className="h-4 w-4" aria-hidden="true" />{loading ? 'Duke krijuar...' : 'Krijo llogarinë'}</Button>
      </form>
    </AuthShell>
  );
}
