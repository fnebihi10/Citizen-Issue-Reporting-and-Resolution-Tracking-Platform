'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignOut() {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });

    if (signOutError) {
      setError('Dalja nga llogaria nuk mundi të përfundojë. Provo përsëri.');
      setLoading(false);
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <div className="text-right">
      <Button variant="secondary" size="sm" onClick={handleSignOut} disabled={loading}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {loading ? 'Duke dalë...' : 'Dil nga llogaria'}
      </Button>
      {error ? <p role="alert" className="mt-2 max-w-56 text-xs leading-5 text-rose-700">{error}</p> : null}
    </div>
  );
}
