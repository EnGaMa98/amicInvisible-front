import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

export default function SendEmailsForm({ open, emailBody, participantCount, onSend, onClose }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setBody(emailBody || '');
    }
  }, [open, emailBody]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSend(body);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-pine-500" />
            <h2 className="text-lg font-bold text-gray-900">Enviar correus</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            S'enviaran els correus a tots els <strong>{participantCount}</strong> participants amb la seva assignació.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Missatge personalitzat <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Escriu un missatge que s'inclourà al correu de cada participant..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-festive-500 focus:ring-1 focus:ring-festive-500 focus:outline-none resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              El nom de la persona assignada, pressupost i data s'inclouen automàticament.
            </p>
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
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-pine-500 px-4 py-2 text-sm font-medium text-white hover:bg-pine-600 transition-colors disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              Enviar correus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
