import { Pencil, Trash2, Mail } from 'lucide-react';

export default function ParticipantRow({ participant, onEdit, onDelete }) {
  const { fields } = participant;

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3 transition-colors hover:bg-gray-50">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-festive-100 text-sm font-bold text-festive-600">
          {fields.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{fields.name}</p>
          <p className="flex items-center gap-1 text-xs text-gray-500 truncate">
            <Mail className="h-3 w-3 shrink-0" />
            {fields.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-3">
        <button
          onClick={() => onEdit(participant)}
          className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(participant)}
          className="rounded-lg p-2 text-gray-400 hover:text-festive-500 hover:bg-festive-50 transition-colors"
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
