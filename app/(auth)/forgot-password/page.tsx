import { FocusedAuthShell } from '@/components/auth/FocusedAuthShell';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  return (
    <FocusedAuthShell
      eyebrow="Rikuperim i sigurt"
      title="Rivendos fjalëkalimin"
      description="Dërgojmë një link njëpërdorimësh në email-in tënd; nuk zbulojmë nëse kjo adresë ka llogari."
      alternateText="Të kujtohet fjalëkalimi?"
      alternateHref="/login"
      alternateLabel="Hyr në llogari"
      variant="recovery"
    >
      <ForgotPasswordForm sessionExpired={params.error === 'session'} />
    </FocusedAuthShell>
  );
}
