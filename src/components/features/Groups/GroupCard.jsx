import { useNavigate } from 'react-router-dom';
import { Calendar, Euro, Users, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';

export default function GroupCard({ group }) {
  const navigate = useNavigate();
  const { fields } = group;

  return (
    <button
      onClick={() => navigate(`/groups/${group.id}`)}
      className="editorial-surface group flex min-h-56 w-full flex-col rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="flex items-start justify-between">
        <StatusBadge status={fields.status} />
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-muted transition-all group-hover:border-brand-100 group-hover:bg-brand-50 group-hover:text-brand-700">
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <h3 className="display-title mt-5 text-2xl text-ink">{fields.name}</h3>

      {fields.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{fields.description}</p>
      )}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-xs font-medium text-ink-muted">
        {fields.event_date && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(fields.event_date).toLocaleDateString('ca-ES')}
          </span>
        )}
        {fields.budget && (
          <span className="flex items-center gap-1.5">
            <Euro className="h-4 w-4" />
            {parseFloat(fields.budget).toFixed(2)} €
          </span>
        )}
        {group.participants && (
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {group.participants.length}
          </span>
        )}
      </div>
    </button>
  );
}
