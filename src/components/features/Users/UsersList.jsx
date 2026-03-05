import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import UsersService from '@/api/services/UsersService';
import { useApi } from '@/hooks/useApi';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import UserForm from './UserForm';

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Usuaris autoritzats</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-festive-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-festive-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Afegir usuari
        </button>
      </div>

      {users.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Cap usuari registrat"
            description="Afegeix correus electrònics per autoritzar l'accés a l'aplicació."
            action={{ label: 'Afegir usuari', onClick: () => setFormOpen(true) }}
          />
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Correu
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Rol
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Accions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-100 text-sm font-semibold text-pine-700">
                        {user.fields.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.fields.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.fields.email}</td>
                  <td className="px-6 py-4">
                    {user.fields.is_admin ? (
                      <span className="inline-flex items-center rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-600">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Usuari
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!user.fields.is_admin && (
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-festive-50 hover:text-festive-500 transition-colors"
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
