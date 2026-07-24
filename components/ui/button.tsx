import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md',
  secondary: 'border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-200 hover:bg-blue-50',
  dark: 'bg-slate-950 text-white shadow-sm hover:bg-slate-800',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
} as const;

const buttonSizes = {
  sm: 'h-11 rounded-lg px-3 text-sm',
  md: 'h-11 rounded-xl px-4 text-sm',
  lg: 'h-12 rounded-xl px-5 text-base',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export function buttonVariantsClass({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariantsClass({ variant, size, className })}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
