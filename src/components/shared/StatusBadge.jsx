const STATUS_CONFIG = {
  draft: { label: 'Esborrany', className: 'bg-gray-100 text-gray-600' },
  ready: { label: 'Preparat', className: 'bg-blue-100 text-blue-700' },
  drawn: { label: 'Sorteig fet', className: 'bg-amber-100 text-amber-700' },
  sent: { label: 'Enviat', className: 'bg-emerald-100 text-emerald-700' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
