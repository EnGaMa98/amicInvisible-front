import { Gift } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
      <Gift className="mb-4 h-12 w-12 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
