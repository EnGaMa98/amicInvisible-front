import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Loader2, Send } from 'lucide-react';

export default function AssignmentCard({ assignment, onResend, isAdmin }) {
  const { giver, receiver, fields } = assignment;
  const isSent = !!fields.sent_at;
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      await onResend(giver.id);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="editorial-surface flex flex-wrap items-center gap-3 rounded-xl p-4 sm:flex-nowrap">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-600">
          {giver.fields.name.charAt(0).toUpperCase()}
        </div>
        <span className="truncate text-sm font-semibold text-ink">{giver.fields.name}</span>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" />

      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-100 text-sm font-bold text-success-600">
          {isAdmin ? receiver.fields.name.charAt(0).toUpperCase() : '?'}
        </div>
        {isAdmin ? (
          <span className="truncate text-sm font-semibold text-ink">{receiver.fields.name}</span>
        ) : (
          <span className="select-none text-sm font-semibold text-ink-muted blur-sm">██████</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isSent ? (
          <CheckCircle2 className="h-5 w-5 text-success-500" />
        ) : (
          <Clock className="h-5 w-5 text-ink-muted/55" />
        )}
        <button
          onClick={handleResend}
          disabled={sending}
          className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-success-50 hover:text-success-600 disabled:opacity-40"
          title={isAdmin ? `Enviar correu a ${giver.fields.name}` : 'Reenviar correu'}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
