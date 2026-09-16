import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import UsersService from '@/api/services/UsersService';
import { useApi } from '@/hooks/useApi';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import UserForm from './UserForm';
import Button from '@/components/shared/Button';
import PageHeader from '@/components/shared/PageHeader';

export default function UsersList() {
  const { execute } = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await execute(() => UsersService.list({ perPage: 100 }), {
        showLoading: false,
      });
      setUsers(response.data || []);
    } finally {
      setLoading(false);
    }
  }, [execute]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSave = async (data) => {
    await execute(() => UsersService.save(null, data), {
      successMessage: 'Usuari afegit!',
    });
    setFormOpen(false);
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await execute(() => UsersService.remove(deleteTarget.id), {
      successMessage: 'Usuari eliminat!',
    });
    setDeleteTarget(null);
    fetchUsers();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        eyebrow="Administració"
        title="Usuaris autoritzats"
        description="Gestiona les persones que poden accedir i crear els seus propis grups."
        action={(
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Afegir usuari
          </Button>
        )}
      />

      {users.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Cap usuari registrat"
            description="Afegeix correus electrònics per autoritzar l'accés a l'aplicació."
            action={{ label: 'Afegir usuari', onClick: () => setFormOpen(true) }}
          />
        </div>
      ) : (
        <div className="editorial-surface mt-8 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-160">
            <thead className="border-b border-line bg-surface-muted/55">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Correu
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Rol
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Accions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-brand-50/35">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                        {user.fields.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-ink">{user.fields.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-muted">{user.fields.email}</td>
                  <td className="px-6 py-4">
                    {user.fields.is_admin ? (
                      <span className="inline-flex items-center rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-600">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-ink-muted">
                        Usuari
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!user.fields.is_admin && (
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-danger-50 hover:text-danger-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserForm open={formOpen} onSave={handleSave} onClose={() => setFormOpen(false)} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar usuari"
        message={`Estàs segur que vols eliminar "${deleteTarget?.fields?.name}"? Perdrà l'accés a l'aplicació.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
