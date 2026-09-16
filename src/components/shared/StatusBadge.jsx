const STATUS_CONFIG = {
  draft: { label: 'Esborrany', className: 'bg-surface-muted text-ink-muted' },
  ready: { label: 'Preparat', className: 'bg-brand-50 text-brand-700' },
  drawn: { label: 'Sorteig fet', className: 'bg-gold-50 text-gold-600' },
  sent: { label: 'Enviat', className: 'bg-success-50 text-success-600' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${config.className}`}>
      {config.label}
    </span>
  );
}
