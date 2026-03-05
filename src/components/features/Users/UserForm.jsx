import { useEffect, useState } from 'react';
import { X, UserPlus } from 'lucide-react';

export default function UserForm({ open, onSave, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ fields: { name: name.trim(), email: email.trim() } });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-festive-500" />
            <h2 className="text-lg font-semibold text-gray-900">Afegir usuari</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-festive-500 focus:outline-none focus:ring-2 focus:ring-festive-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correu electrònic</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-festive-500 focus:outline-none focus:ring-2 focus:ring-festive-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !email.trim()}
              className="rounded-xl bg-festive-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-festive-600 transition-colors disabled:opacity-40"
            >
              Afegir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
