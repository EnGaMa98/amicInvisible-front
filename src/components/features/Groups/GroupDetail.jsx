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
      const include = isAdmin ? 'participants,assignments' : 'participants';
      const response = await execute(
        () => GroupsService.get(id, include),
        { showLoading: false }
      );
      setGroup(response.data || response);
    } finally {
      setLoading(false);
    }
  }, [id, execute, isAdmin]);

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

  if (loading) return <LoadingSpinner />;
  if (!group) return null;

  const { fields } = group;
  const participantCount = group.participants?.length || 0;
  const hasAssignments = group.assignments?.length > 0;
  const canDraw = participantCount >= 2;
  const canSend = fields.status === 'drawn' && hasAssignments;

  return (
    <div>
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tornar
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDuplicateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy className="h-4 w-4" />
            Duplicar
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-festive-200 px-3 py-2 text-sm font-medium text-festive-600 hover:bg-festive-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <StatusBadge status={fields.status} />
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{fields.name}</h1>
            {fields.description && (
              <p className="mt-1 text-gray-500">{fields.description}</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          {fields.event_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(fields.event_date).toLocaleDateString('ca-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {fields.budget && (
            <span className="flex items-center gap-1.5">
              <Euro className="h-4 w-4" />
              {parseFloat(fields.budget).toFixed(2)} €
            </span>
          )}
        </div>
      </div>

      {/* Participants */}
      <div className="mt-6">
        <ParticipantsList groupId={id} participants={group.participants || []} onUpdate={fetchGroup} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {(fields.status === 'draft' || fields.status === 'ready' || fields.status === 'drawn') && (
          <button
            onClick={() => setDrawConfirmOpen(true)}
            disabled={!canDraw}
            className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Shuffle className="h-4 w-4" />
            {hasAssignments ? 'Refer el sorteig' : 'Fer el sorteig'}
          </button>
        )}
        {hasAssignments && (
          <button
            onClick={() => setSendConfirmOpen(true)}
            disabled={!canSend && fields.status !== 'drawn'}
            className="flex items-center gap-2 rounded-xl bg-pine-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pine-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Enviar correus
          </button>
        )}
        {!canDraw && participantCount < 2 && (
          <p className="flex items-center text-sm text-gray-400">
            Necessites almenys 2 participants per fer el sorteig
          </p>
        )}
      </div>

      {/* Assignments (admin only) */}
      {isAdmin && hasAssignments && (
        <div className="mt-6">
          <AssignmentsList assignments={group.assignments} />
        </div>
      )}

      {/* Modals */}
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
