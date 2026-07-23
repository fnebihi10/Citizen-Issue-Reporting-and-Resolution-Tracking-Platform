import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/forgot-password?error=session');
  }

  return (
    <AuthShell eyebrow="Fjalëkalim i ri" title="Vendos një fjalëkalim të fortë." description="Ky veprim është i disponueshëm vetëm nëpërmjet një sesioni të vlefshëm rikuperimi." alternateText="Të kujtohet fjalëkalimi?" alternateHref="/login" alternateLabel="Hyr në llogari">
      <UpdatePasswordForm />
    </AuthShell>
  );
}
