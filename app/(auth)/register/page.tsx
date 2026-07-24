'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Circle, Info, LockKeyhole, Mail, UserPlus, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FocusedAuthShell } from '@/components/auth/FocusedAuthShell';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { getPasswordRequirements, getPasswordValidationError } from '@/lib/auth/password';
import { translateSignUpError } from '@/lib/auth/messages';
import { createClient } from '@/lib/supabase/client';

const authInputClassName =
  'field-input rounded-[14px] border-slate-200 bg-white/75 pl-11 text-[15px] shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-blue-100';

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
    <FocusedAuthShell
      eyebrow="Llogari qytetare"
      title="Krijo profilin tënd"
      description="Raporto çështje komunale dhe ndiq hapat e trajtimit."
      alternateText="Ke tashmë llogari?"
      alternateHref="/login"
      alternateLabel="Hyr këtu"
      variant="register"
    >
      {error ? <div role="alert" aria-live="assertive" className="mb-4 rounded-[16px] border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800">{error}</div> : null}
      {success ? <div role="status" aria-live="polite" className="mb-4 rounded-[16px] border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm leading-5 text-emerald-800">{success}</div> : null}
      <form onSubmit={handleSubmit} className="grid gap-x-3.5 gap-y-3 sm:grid-cols-2">
        <div>
          <label htmlFor="full-name" className="mb-1.5 block text-[13px] font-bold tracking-[-0.01em] text-slate-800">Emri dhe mbiemri</label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="full-name" name="fullName" type="text" autoComplete="name" required maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="p.sh. Alex Johnson" className={[authInputClassName, 'pr-4'].join(' ')} aria-invalid={Boolean(error)} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-bold tracking-[-0.01em] text-slate-800">Email-i</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ti@example.com" className={[authInputClassName, 'pr-4'].join(' ')} aria-invalid={Boolean(error)} />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-bold tracking-[-0.01em] text-slate-800">Fjalëkalimi</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <PasswordInput id="password" name="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Krijo një fjalëkalim të fortë" className={[authInputClassName, 'pr-12'].join(' ')} aria-invalid={Boolean(error)} />
          </div>
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-[13px] font-bold tracking-[-0.01em] text-slate-800">Përsërite fjalëkalimin</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <PasswordInput id="confirm-password" name="confirmPassword" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Përsërite fjalëkalimin" className={[authInputClassName, 'pr-12'].join(' ')} aria-invalid={Boolean(error)} />
          </div>
        </div>
        {password ? (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-[16px] border border-slate-200/80 bg-slate-50/85 px-3 py-2.5 text-[11px] leading-4 text-slate-600 sm:col-span-2">
            {passwordRequirements.map((requirement) => (
              <li key={requirement.label} className={['flex items-center gap-1.5', requirement.met ? 'text-emerald-700' : ''].join(' ')}>
                {requirement.met ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <Circle className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />}
                {requirement.label}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="flex gap-2.5 rounded-[16px] border border-blue-100 bg-blue-50/75 px-3 py-2.5 text-[11px] leading-4 text-blue-950 sm:col-span-2">
          <Info className="mt-px h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
          <span>Llogaria publike krijohet me rolin <strong>qytetar</strong>; roli nuk zgjidhet nga kjo formë.</span>
        </p>
        <Button
          type="submit"
          size="lg"
          className="group relative w-full overflow-hidden rounded-[14px] border border-blue-400/30 bg-[linear-gradient(110deg,#061a3a_0%,#0b5dcb_56%,#0784b2_100%)] shadow-[0_16px_30px_-14px_rgba(15,75,170,0.68)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_20px_34px_-14px_rgba(15,75,170,0.76)] motion-reduce:transform-none motion-reduce:transition-none sm:col-span-2"
          disabled={loading}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.28),transparent_35%)]" aria-hidden="true" />
          <UserPlus className="relative h-4 w-4" aria-hidden="true" />
          <span className="relative">{loading ? 'Duke krijuar...' : 'Krijo llogarinë'}</span>
        </Button>
      </form>
    </FocusedAuthShell>
  );
}
