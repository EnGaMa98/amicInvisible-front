import { useNavigate } from 'react-router-dom';
import { Calendar, Euro, Users, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';

export default function GroupCard({ group }) {
  const navigate = useNavigate();
  const { fields } = group;

  return (
    <div
      onClick={() => navigate(`/groups/${group.id}`)}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
    >
      <div className="flex items-start justify-between">
        <StatusBadge status={fields.status} />
        <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
      </div>

      <h3 className="mt-3 text-lg font-bold text-gray-900">{fields.name}</h3>

      {fields.description && (
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{fields.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
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
    </div>
  );
}
