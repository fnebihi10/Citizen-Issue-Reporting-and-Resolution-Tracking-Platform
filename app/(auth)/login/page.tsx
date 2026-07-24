import { FocusedAuthShell } from '@/components/auth/FocusedAuthShell';
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
    <FocusedAuthShell
      eyebrow="Qasje e sigurt"
      title="Mirë se u ktheve"
      description="Hyr për të ndjekur raportimet e tua dhe hapat e trajtimit."
      alternateText="Nuk ke ende llogari?"
      alternateHref="/register"
      alternateLabel="Regjistrohu"
      variant="login"
    >
      <LoginForm nextPath={getSafeInternalPath(nextParam)} callbackFailed={errorParam === 'callback'} />
    </FocusedAuthShell>
  );
}
