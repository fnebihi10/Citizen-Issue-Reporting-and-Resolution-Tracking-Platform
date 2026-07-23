export const minimumPasswordLength = 10;

export type PasswordRequirement = {
  label: string;
  met: boolean;
};

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { label: `Së paku ${minimumPasswordLength} karaktere`, met: password.length >= minimumPasswordLength },
    { label: 'Një shkronjë e madhe', met: /[A-Z]/.test(password) },
    { label: 'Një shkronjë e vogël', met: /[a-z]/.test(password) },
    { label: 'Një numër', met: /\d/.test(password) },
  ];
}

export function getPasswordValidationError(password: string) {
  return getPasswordRequirements(password).every((requirement) => requirement.met)
    ? null
    : `Fjalëkalimi duhet të ketë së paku ${minimumPasswordLength} karaktere, shkronjë të madhe, të vogël dhe numër.`;
}
