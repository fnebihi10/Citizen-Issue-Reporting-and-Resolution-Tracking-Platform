import { AuthShell } from '@/components/auth/AuthShell';
import { getSafeInternalPath } from '@/lib/auth/redirect';
import { LoginForm } from '@/components/auth/LoginForm';

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[]; next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextParam = typeof params.next === 'string' ? params.next : null;
  const errorParam = typeof params.error === 'string' ? params.error : null;

  return (
    <AuthShell
      eyebrow="Qasje e sigurt"
      title="Mirë se u ktheve."
      description="Hyr me email-in e konfirmuar për të parë raportimet dhe historinë e tyre."
      alternateText="Nuk ke ende llogari?"
      alternateHref="/register"
      alternateLabel="Regjistrohu"
    >
      <LoginForm nextPath={getSafeInternalPath(nextParam)} callbackFailed={errorParam === 'callback'} />
    </AuthShell>
  );
}
