import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import GroupsService from '@/api/services/GroupsService';
import { useApi } from '@/hooks/useApi';
import GroupCard from './GroupCard';
import GroupForm from './GroupForm';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function GroupsList() {
  const { execute } = useApi();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await execute(
        () => GroupsService.list({ include: 'participants' }),
        { showLoading: false }
      );
      setGroups(response.data);
    } finally {
      setLoading(false);
    }
  }, [execute]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleSave = async (data) => {
    await execute(() => GroupsService.save(null, data), {
      successMessage: 'Grup creat correctament!',
    });
    setFormOpen(false);
    fetchGroups();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Els meus grups</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona els teus amics invisibles</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-festive-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-festive-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nou grup
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Cap grup encara"
            description="Crea el teu primer amic invisible!"
            action={
              <button
                onClick={() => setFormOpen(true)}
                className="rounded-xl bg-festive-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-festive-600 transition-colors"
              >
                Crear grup
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      <GroupForm open={formOpen} group={null} onSave={handleSave} onClose={() => setFormOpen(false)} />
    </div>
  );
}
