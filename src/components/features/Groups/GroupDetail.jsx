import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Euro, Pencil, Trash2, Shuffle, Send, Copy } from 'lucide-react';
import GroupsService from '@/api/services/GroupsService';
import AssignmentsService from '@/api/services/AssignmentsService';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthProvider';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import GroupForm from './GroupForm';
import ParticipantsList from '@/components/features/Participants/ParticipantsList';
import AssignmentsList from '@/components/features/Assignments/AssignmentsList';
import SendEmailsForm from '@/components/features/Assignments/SendEmailsForm';
import Button from '@/components/shared/Button';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { execute } = useApi();
  const { isAdmin } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [drawConfirmOpen, setDrawConfirmOpen] = useState(false);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      const include = 'participants,assignments';
      const response = await execute(
        () => GroupsService.get(id, include),
        { showLoading: false }
      );
      setGroup(response.data || response);
    } finally {
      setLoading(false);
    }
  }, [id, execute]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleEdit = async (data) => {
    await execute(() => GroupsService.save(id, data), {
      successMessage: 'Grup actualitzat!',
    });
    setEditOpen(false);
    fetchGroup();
  };

  const handleDelete = async () => {
    await execute(() => GroupsService.remove(id), {
      successMessage: 'Grup eliminat!',
    });
    navigate('/');
  };

  const handleDuplicate = async (data) => {
    const response = await execute(() => GroupsService.duplicate(id, data), {
      successMessage: 'Grup duplicat!',
    });
    setDuplicateOpen(false);
    const newId = response?.data?.id || response?.id;
    if (newId) {
      navigate(`/groups/${newId}`);
    } else {
      navigate('/');
    }
  };

  const handleDraw = async () => {
    await execute(() => AssignmentsService.draw(id), {
      successMessage: 'Sorteig realitzat!',
    });
    setDrawConfirmOpen(false);
    fetchGroup();
  };

  const handleSendEmails = async (emailBody) => {
    await execute(() => AssignmentsService.sendEmails(id, { fields: { email_body: emailBody } }), {
      successMessage: 'Correus enviats!',
    });
    setSendConfirmOpen(false);
    fetchGroup();
  };

  const handleResendToParticipant = async (participantId) => {
    await execute(() => AssignmentsService.sendEmailToParticipant(id, participantId), {
      successMessage: 'Correu enviat!',
    });
    fetchGroup();
  };

  if (loading) return <LoadingSpinner />;
  if (!group) return null;

  const { fields } = group;
  const participantCount = group.participants?.length || 0;
  const hasAssignments = group.assignments?.length > 0;
  const canDraw = participantCount >= 2;
  const canSend = (fields.status === 'drawn' || fields.status === 'sent') && hasAssignments;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 self-start text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tots els grups
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setDuplicateOpen(true)}
            variant="secondary"
            size="sm"
          >
            <Copy className="h-4 w-4" />
            Duplicar
          </Button>
          <Button
            onClick={() => setEditOpen(true)}
            variant="secondary"
            size="sm"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            onClick={() => setDeleteOpen(true)}
            variant="danger"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="editorial-surface relative mt-6 overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className="absolute inset-y-0 left-0 w-1 bg-brand-700" />
        <StatusBadge status={fields.status} />
        <div className="mt-4 max-w-3xl">
          <h1 className="display-title text-3xl text-ink sm:text-4xl">{fields.name}</h1>
          {fields.description && (
            <p className="mt-2 text-sm leading-6 text-ink-muted sm:text-base">{fields.description}</p>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-muted">
          {fields.event_date && (
            <span className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2">
              <Calendar className="h-4 w-4 text-brand-600" />
              {new Date(fields.event_date).toLocaleDateString('ca-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {fields.budget && (
            <span className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2">
              <Euro className="h-4 w-4 text-brand-600" />
              {parseFloat(fields.budget).toFixed(2)} €
            </span>
          )}
        </div>
      </div>

      <div className="mt-8">
        <ParticipantsList groupId={id} participants={group.participants || []} onUpdate={fetchGroup} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-line py-5">
        {(fields.status === 'draft' || fields.status === 'ready' || fields.status === 'drawn') && (
          <Button
            onClick={() => setDrawConfirmOpen(true)}
            disabled={!canDraw}
            className="bg-gold-600 hover:bg-gold-500"
          >
            <Shuffle className="h-4 w-4" />
            {hasAssignments ? 'Refer el sorteig' : 'Fer el sorteig'}
          </Button>
        )}
        {hasAssignments && (
          <Button
            onClick={() => setSendConfirmOpen(true)}
            disabled={!canSend}
            variant="success"
          >
            <Send className="h-4 w-4" />
            {fields.status === 'sent' ? 'Reenviar correus' : 'Enviar correus'}
          </Button>
        )}
        {!canDraw && participantCount < 2 && (
          <p className="flex items-center text-sm text-ink-muted">
            Necessites almenys 2 participants per fer el sorteig
          </p>
        )}
      </div>

      {hasAssignments && (
        <div className="mt-6">
          <AssignmentsList assignments={group.assignments} onResend={handleResendToParticipant} isAdmin={isAdmin} />
        </div>
      )}

      <GroupForm open={editOpen} group={group} onSave={handleEdit} onClose={() => setEditOpen(false)} />
      <GroupForm open={duplicateOpen} group={group} onSave={handleDuplicate} onClose={() => setDuplicateOpen(false)} title="Duplicar grup" submitLabel="Duplicar" />

      <ConfirmDialog
        open={deleteOpen}
        title="Eliminar grup"
        message={`Estàs segur que vols eliminar "${fields.name}"? Aquesta acció no es pot desfer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={drawConfirmOpen}
        title={hasAssignments ? 'Refer el sorteig' : 'Fer el sorteig'}
        message={
          hasAssignments
            ? 'Això eliminarà les assignacions actuals i en crearà de noves. Continuar?'
            : `Es crearà el sorteig per ${participantCount} participants. Continuar?`
        }
        onConfirm={handleDraw}
        onCancel={() => setDrawConfirmOpen(false)}
      />

      <SendEmailsForm
        open={sendConfirmOpen}
        emailBody={fields.email_body || ''}
        participantCount={participantCount}
        onSend={handleSendEmails}
        onClose={() => setSendConfirmOpen(false)}
      />
    </div>
  );
}
