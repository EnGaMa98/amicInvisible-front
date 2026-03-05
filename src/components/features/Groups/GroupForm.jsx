import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function GroupForm({ open, group, onSave, onClose, title, submitLabel }) {
  const [fields, setFields] = useState({
    name: '',
    description: '',
    budget: '',
    event_date: '',
  });

  useEffect(() => {
    if (group) {
      setFields({
        name: group.fields.name || '',
        description: group.fields.description || '',
        budget: group.fields.budget || '',
        event_date: group.fields.event_date || '',
      });
    } else {
      setFields({ name: '', description: '', budget: '', event_date: '' });
    }
  }, [group, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ fields });
  };

  const handleChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            {title || (group ? 'Editar grup' : 'Nou grup')}
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
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nadal 2025, Reis Mags..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-festive-500 focus:ring-1 focus:ring-festive-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripció</label>
              <textarea
                value={fields.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                placeholder="Detalls opcionals..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-festive-500 focus:ring-1 focus:ring-festive-500 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pressupost (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fields.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="20.00"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-festive-500 focus:ring-1 focus:ring-festive-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de l'event</label>
                <input
                  type="date"
                  value={fields.event_date}
                  onChange={(e) => handleChange('event_date', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-festive-500 focus:ring-1 focus:ring-festive-500 focus:outline-none"
                />
              </div>
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
              {submitLabel || (group ? 'Desar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
