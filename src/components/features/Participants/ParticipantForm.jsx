import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ParticipantForm({ open, participant, onSave, onClose }) {
  const [fields, setFields] = useState({ name: '', email: '' });

  useEffect(() => {
    if (participant) {
      setFields({
        name: participant.fields.name || '',
        email: participant.fields.email || '',
      });
    } else {
      setFields({ name: '', email: '' });
    }
  }, [participant, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ fields });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            {participant ? 'Editar participant' : 'Afegir participant'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom *</label>
              <input
                type="text"
                required
                value={fields.name}
                onChange={(e) => setFields((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Anna, Marc..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-festive-500 focus:ring-1 focus:ring-festive-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correu electrònic *</label>
              <input
                type="email"
                required
                value={fields.email}
                onChange={(e) => setFields((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="anna@exemple.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-festive-500 focus:ring-1 focus:ring-festive-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-festive-500 px-4 py-2 text-sm font-medium text-white hover:bg-festive-600 transition-colors"
            >
              {participant ? 'Desar' : 'Afegir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
