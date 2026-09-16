export default function FormField({ label, hint, optional = false, children }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-ink-muted">Opcional</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-2 block text-xs leading-5 text-ink-muted">{hint}</span>}
    </label>
  );
}

export const fieldClassName = 'block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink-muted/65 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-surface-muted disabled:text-ink-muted';
