import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import ParticipantsService from '@/api/services/ParticipantsService';
import { useApi } from '@/hooks/useApi';
import ParticipantRow from './ParticipantRow';
import ParticipantForm from './ParticipantForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Button from '@/components/shared/Button';

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
      <div className="flex items-center justify-between gap-4">
        <h2 className="display-title flex items-center gap-2 text-2xl text-ink">
          <Users className="h-5 w-5 text-brand-600" />
          Participants
          <span className="font-sans text-sm font-normal text-ink-muted">({participants.length})</span>
        </h2>
        <Button onClick={openCreate} variant="secondary" size="sm">
          <Plus className="h-4 w-4" />
          Afegir
        </Button>
      </div>

      {participants.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-line bg-surface/50 py-10 text-center text-sm text-ink-muted">
          Encara no hi ha participants. Afegeix-ne!
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {participants.map((participant) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
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
