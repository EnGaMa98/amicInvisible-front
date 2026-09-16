import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, Calendar, Check, Gift, Loader2, Save, Wallet } from 'lucide-react';
import PublicService from '@/api/services/PublicService';
import Button from '@/components/shared/Button';
import { fieldClassName } from '@/components/shared/FormField';

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
      .then((response) => {
        setData(response.data);
        setPreferences(response.data.participant.preferences || '');
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
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
        <div className="editorial-surface w-full max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="display-title mt-5 text-3xl text-ink">Enllaç no vàlid</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{error}</p>
        </div>
      </div>
    );
  }

  const { participant, receiver, group } = data;

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-brand-100/65 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-96 h-80 w-80 rounded-full bg-accent-100/50 blur-3xl" />

      <main className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 text-surface">
            <Gift className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Amic Invisible</p>
          <h1 className="display-title mt-2 text-3xl text-ink sm:text-4xl">{group.name}</h1>
        </header>

        <section className="editorial-surface relative overflow-hidden rounded-2xl p-6 text-center sm:p-9">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent-500" />
          <p className="text-sm text-ink-muted">Hola, <strong className="text-ink">{participant.name}</strong>. La persona que t'ha tocat és</p>
          <p className="display-title mt-4 text-4xl text-brand-800 sm:text-5xl">{receiver.name}</p>
          <p className="mt-3 text-sm text-ink-muted">Ara només queda trobar aquell regal que li faci il·lusió.</p>
        </section>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(group.budget || group.event_date) && (
            <section className="editorial-surface rounded-2xl p-5">
              <h2 className="display-title text-xl text-ink">Detalls del grup</h2>
              <div className="mt-4 space-y-4">
                {group.budget && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Wallet className="h-4 w-4" /></span>
                    <div><p className="text-xs text-ink-muted">Pressupost</p><p className="text-sm font-bold text-ink">{Number(group.budget).toFixed(2)} €</p></div>
                  </div>
                )}
                {group.event_date && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-50 text-gold-600"><Calendar className="h-4 w-4" /></span>
                    <div><p className="text-xs text-ink-muted">Data de l'esdeveniment</p><p className="text-sm font-bold text-ink">{new Date(group.event_date).toLocaleDateString('ca-ES')}</p></div>
                  </div>
                )}
              </div>
            </section>
          )}

          {receiver.preferences && (
            <section className="editorial-surface rounded-2xl p-5">
              <h2 className="display-title flex items-center gap-2 text-xl text-ink"><Gift className="h-4 w-4 text-accent-500" />Idees per a {receiver.name}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink-muted">{receiver.preferences}</p>
            </section>
          )}
        </div>

        {group.email_body && (
          <section className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-5">
            <p className="whitespace-pre-line text-sm leading-6 text-brand-800">{group.email_body}</p>
          </section>
        )}

        <section className="editorial-surface mt-4 rounded-2xl p-5 sm:p-6">
          <h2 className="display-title text-2xl text-ink">Les teves preferències</h2>
          <p className="mt-1 text-sm leading-6 text-ink-muted">Ajuda el teu amic invisible explicant què t'agradaria rebre.</p>
          <textarea
            value={preferences}
            onChange={(event) => setPreferences(event.target.value)}
            placeholder="M'agradaria rebre..."
            maxLength={2000}
            rows={5}
            className={`${fieldClassName} mt-4 resize-none`}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-ink-muted">{preferences.length}/2000</span>
            <Button onClick={handleSave} loading={saving}>
              {!saving && <Save className="h-4 w-4" />}
              Guardar preferències
            </Button>
          </div>
          {saved && <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-success-600"><Check className="h-4 w-4" />Preferències guardades correctament</p>}
          {error && data && <p className="mt-3 text-sm text-danger-600">{error}</p>}
        </section>

        <p className="mt-8 text-center text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Un detall pensat sempre és un bon regal</p>
      </main>
    </div>
  );
}
