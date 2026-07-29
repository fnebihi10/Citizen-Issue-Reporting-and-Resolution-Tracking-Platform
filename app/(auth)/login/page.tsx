import { FocusedAuthShell } from '@/components/auth/FocusedAuthShell';
import { getSafeInternalPath } from '@/lib/auth/redirect';
import { LoginForm } from '@/components/auth/LoginForm';

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    expired?: string | string[];
    next?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextParam = typeof params.next === 'string' ? params.next : null;
  const errorParam = typeof params.error === 'string' ? params.error : null;
  const sessionExpired = params.expired === '1';

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
      <>
        {sessionExpired ? (
          <div
            role="status"
            className="mb-4 rounded-[16px] border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm leading-5 text-amber-900"
          >
            Sesioni yt njëorësh ka skaduar. Hyr përsëri për të vazhduar në mënyrë të sigurt.
          </div>
        ) : null}
        <LoginForm
          nextPath={getSafeInternalPath(nextParam)}
          useRoleHome={!nextParam}
          callbackFailed={errorParam === 'callback'}
        />
      </>
    </FocusedAuthShell>
  );
}
