import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Gift, Calendar, Wallet, Save, Loader2, AlertCircle } from 'lucide-react';
import PublicService from '@/api/services/PublicService';

export default function PublicAssignmentPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    PublicService.getAssignment(token)
      .then((res) => {
        setData(res.data);
        setPreferences(res.data.participant.preferences || '');
      })
      .catch(() => setError('Aquest enllaç no és vàlid o ha expirat.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await PublicService.updatePreferences(token, preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('No s\'han pogut guardar les preferències.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-festive-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-festive-500 animate-spin" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-festive-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-festive-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Enllaç no vàlid</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const { participant, receiver, group } = data;

  return (
    <div className="min-h-screen bg-festive-50">
      <div className="max-w-lg mx-auto p-4 py-8">
        <div className="text-center mb-6">
          <Gift className="w-12 h-12 text-festive-500 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-festive-600">Amic Invisible</h1>
          <p className="text-gray-500">{group.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 animate-slide-up">
          <p className="text-gray-600 mb-1">Hola <strong>{participant.name}</strong>!</p>
          <p className="text-gray-600 mb-3">T'ha tocat fer-li un regal a:</p>
          <p className="text-3xl font-bold text-festive-600 uppercase underline decoration-2 underline-offset-4">
            {receiver.name}
          </p>
        </div>

        {receiver.preferences && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 animate-slide-up">
            <h3 className="font-semibold text-pine-600 mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Preferències de {receiver.name}
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{receiver.preferences}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 animate-slide-up">
          {group.budget && (
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-pine-500" />
              <span className="text-gray-600">Pressupost:</span>
              <span className="bg-pine-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                {Number(group.budget).toFixed(2)} €
              </span>
            </div>
          )}
          {group.event_date && (
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gold-500" />
              <span className="text-gray-600">Data de l'event:</span>
              <span className="font-semibold">{new Date(group.event_date).toLocaleDateString('ca-ES')}</span>
            </div>
          )}
          {group.email_body && (
            <div className="border-l-4 border-festive-500 pl-4 mt-3 text-gray-600 whitespace-pre-line">
              {group.email_body}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-up">
          <h3 className="font-semibold text-gray-800 mb-2">Les teves preferències de regal</h3>
          <p className="text-sm text-gray-500 mb-3">
            Escriu aquí què t'agradaria rebre. El teu amic invisible ho podrà veure.
          </p>
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="M'agradaria rebre..."
            maxLength={2000}
            rows={4}
            className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-festive-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">{preferences.length}/2000</span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-festive-500 hover:bg-festive-600 text-white px-5 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Guardant...' : 'Guardar'}
            </button>
          </div>
          {saved && (
            <p className="text-pine-500 text-sm mt-2 font-medium">Preferències guardades correctament!</p>
          )}
          {error && data && (
            <p className="text-festive-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">🎄 Bon Nadal! 🎁</p>
      </div>
    </div>
  );
}
