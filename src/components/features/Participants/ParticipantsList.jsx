import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import ParticipantsService from '@/api/services/ParticipantsService';
import { useApi } from '@/hooks/useApi';
import ParticipantRow from './ParticipantRow';
import ParticipantForm from './ParticipantForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

export default function ParticipantsList({ groupId, participants, onUpdate }) {
  const { execute } = useApi();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleSave = async (data) => {
    const participantId = editing?.id || null;
    await execute(() => ParticipantsService.save(groupId, participantId, data), {
      successMessage: participantId ? 'Participant actualitzat!' : 'Participant afegit!',
    });
    setFormOpen(false);
    setEditing(null);
    onUpdate();
  };

  const handleDelete = async () => {
    await execute(() => ParticipantsService.remove(groupId, deleting.id), {
      successMessage: 'Participant eliminat!',
    });
    setDeleting(null);
    onUpdate();
  };

  const openEdit = (participant) => {
    setEditing(participant);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Users className="h-5 w-5 text-gray-400" />
          Participants
          <span className="text-sm font-normal text-gray-400">({participants.length})</span>
        </h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Afegir
        </button>
      </div>

      {participants.length === 0 ? (
        <p className="mt-4 text-center text-sm text-gray-400 py-8">
          Encara no hi ha participants. Afegeix-ne!
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {participants.map((p) => (
            <ParticipantRow
              key={p.id}
              participant={p}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <ParticipantForm
        open={formOpen}
        participant={editing}
        onSave={handleSave}
        onClose={() => { setFormOpen(false); setEditing(null); }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Eliminar participant"
        message={deleting ? `Estàs segur que vols eliminar "${deleting.fields.name}"?` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
