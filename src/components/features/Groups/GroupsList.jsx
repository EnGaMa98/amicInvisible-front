import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import GroupsService from '@/api/services/GroupsService';
import { useApi } from '@/hooks/useApi';
import GroupCard from './GroupCard';
import GroupForm from './GroupForm';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Button from '@/components/shared/Button';
import PageHeader from '@/components/shared/PageHeader';

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
      <PageHeader
        eyebrow="El teu espai"
        title="Els meus grups"
        description="Crea, organitza i gestiona cada sorteig des d'un únic lloc."
        action={(
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Nou grup
          </Button>
        )}
      />

      {groups.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Cap grup encara"
            description="Crea el primer grup i comença a preparar el sorteig."
            action={
              <Button onClick={() => setFormOpen(true)}>Crear grup</Button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      <GroupForm open={formOpen} group={null} onSave={handleSave} onClose={() => setFormOpen(false)} />
    </div>
  );
}
