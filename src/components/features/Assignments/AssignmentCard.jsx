import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Send, Loader2, EyeOff } from 'lucide-react';

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
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-600">
          {giver.fields.name.charAt(0).toUpperCase()}
        </div>
        {isAdmin ? (
          <span className="text-sm font-semibold text-gray-900 truncate">{giver.fields.name}</span>
        ) : (
          <span className="text-sm font-semibold text-gray-400 select-none blur-sm">██████</span>
        )}
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />

      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-100 text-sm font-bold text-pine-600">
          {isAdmin ? receiver.fields.name.charAt(0).toUpperCase() : '?'}
        </div>
        {isAdmin ? (
          <span className="text-sm font-semibold text-gray-900 truncate">{receiver.fields.name}</span>
        ) : (
          <span className="text-sm font-semibold text-gray-400 select-none blur-sm">██████</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isSent ? (
          <CheckCircle2 className="h-5 w-5 text-pine-500" />
        ) : (
          <Clock className="h-5 w-5 text-gray-300" />
        )}
        <button
          onClick={handleResend}
          disabled={sending}
          className="rounded-lg p-2 text-gray-400 hover:text-pine-500 hover:bg-pine-50 transition-colors disabled:opacity-40"
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
