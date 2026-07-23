'use client';

import { FormEvent, useState } from 'react';
import { Mail } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', '/update-password');
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: callbackUrl.toString() });

    if (resetError) {
      setError('Nuk mundëm të dërgojmë email-in. Kontrollo adresën dhe provo përsëri.');
    } else {
      setMessage('Nëse kjo adresë ekziston, do të pranosh një link për ndryshimin e fjalëkalimit.');
    }
    setLoading(false);
  }

  return (
    <AuthShell eyebrow="Rikuperim i sigurt" title="Rivendos fjalëkalimin." description="Dërgojmë një link njëpërdorimësh në email-in tënd; nuk zbulojmë nëse kjo adresë ka llogari." alternateText="Të kujtohet fjalëkalimi?" alternateHref="/login" alternateLabel="Hyr në llogari">
      {error ? <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800">{error}</div> : null}
      {message ? <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm leading-5 text-emerald-800">{message}</div> : null}
      <form onSubmit={handleSubmit} className="space-y-5"><div><label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-800">Email-i</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ti@example.com" className="field-input" aria-invalid={Boolean(error)} /></div><Button type="submit" size="lg" className="w-full" disabled={loading}><Mail className="h-4 w-4" aria-hidden="true" />{loading ? 'Duke dërguar...' : 'Dërgo linkun e rikuperimit'}</Button></form>
    </AuthShell>
  );
}
