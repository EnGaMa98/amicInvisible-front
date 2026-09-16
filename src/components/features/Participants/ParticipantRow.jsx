import { Pencil, Trash2, Mail } from 'lucide-react';

export default function ParticipantRow({ participant, onEdit, onDelete }) {
  const { fields } = participant;

  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand-100 hover:bg-brand-50/35">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
          {fields.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{fields.name}</p>
          <p className="flex items-center gap-1 truncate text-xs text-ink-muted">
            <Mail className="h-3 w-3 shrink-0" />
            {fields.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-3">
        <button
          onClick={() => onEdit(participant)}
          className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(participant)}
          className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-danger-50 hover:text-danger-600"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
