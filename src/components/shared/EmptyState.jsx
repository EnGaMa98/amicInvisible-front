import { Gift } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/55 px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Gift className="h-6 w-6" strokeWidth={1.7} />
      </div>
      <h3 className="display-title text-2xl text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
