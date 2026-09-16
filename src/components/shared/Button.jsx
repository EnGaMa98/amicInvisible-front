import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-500/30',
  secondary: 'border border-line bg-surface text-ink hover:bg-surface-muted focus-visible:ring-brand-500/20',
  danger: 'border border-danger-100 bg-surface text-danger-600 hover:bg-danger-50 focus-visible:ring-danger-500/20',
  success: 'bg-success-600 text-white hover:bg-success-500 focus-visible:ring-success-500/30',
  ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink focus-visible:ring-brand-500/20',
};

const SIZES = {
  sm: 'min-h-9 rounded-lg px-3 py-2 text-sm',
  md: 'min-h-11 rounded-xl px-4 py-2.5 text-sm',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-45 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
