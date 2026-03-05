import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function AssignmentCard({ assignment }) {
  const { giver, receiver, fields } = assignment;
  const isSent = !!fields.sent_at;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Giver */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-bold text-gold-600">
          {giver.fields.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-gray-900 truncate">{giver.fields.name}</span>
      </div>

      {/* Arrow */}
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />

      {/* Receiver */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-100 text-sm font-bold text-pine-600">
          {receiver.fields.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-gray-900 truncate">{receiver.fields.name}</span>
      </div>

      {/* Status */}
      <div className="shrink-0">
        {isSent ? (
          <CheckCircle2 className="h-5 w-5 text-pine-500" />
        ) : (
          <Clock className="h-5 w-5 text-gray-300" />
        )}
      </div>
    </div>
  );
}
