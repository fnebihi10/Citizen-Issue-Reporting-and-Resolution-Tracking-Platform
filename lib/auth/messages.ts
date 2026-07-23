export function translateSignInError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'Email-i ose fjalëkalimi nuk është i saktë.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Konfirmo email-in para se të hysh në platformë.';
  }

  if (normalized.includes('too many requests')) {
    return 'Shumë tentativa. Prit pak dhe provo përsëri.';
  }

  return 'Hyrja nuk mundi të përfundojë. Kontrollo të dhënat dhe provo përsëri.';
}

export function translateSignUpError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('password')) {
    return 'Fjalëkalimi nuk i plotëson kërkesat e sigurisë.';
  }

  if (normalized.includes('too many requests')) {
    return 'Shumë tentativa. Prit pak dhe provo përsëri.';
  }

  return 'Regjistrimi nuk mundi të përfundojë. Kontrollo të dhënat dhe provo përsëri.';
}
