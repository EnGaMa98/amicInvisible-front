import { Sparkles } from 'lucide-react';
import AssignmentCard from './AssignmentCard';

export default function AssignmentsList({ assignments, onResend, isAdmin }) {
  if (!assignments || assignments.length === 0) return null;

  return (
    <div>
      <h2 className="display-title flex items-center gap-2 text-2xl text-ink">
        <Sparkles className="h-5 w-5 text-gold-500" />
        Assignacions
      </h2>
      <div className="mt-4 space-y-2">
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} onResend={onResend} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
