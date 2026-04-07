import { Sparkles } from 'lucide-react';
import AssignmentCard from './AssignmentCard';

export default function AssignmentsList({ assignments, onResend, isAdmin }) {
  if (!assignments || assignments.length === 0) return null;

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Sparkles className="h-5 w-5 text-gold-500" />
        Assignacions
      </h2>
      <div className="mt-3 space-y-2">
        {assignments.map((a) => (
          <AssignmentCard key={a.id} assignment={a} onResend={onResend} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
