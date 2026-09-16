import { useEffect, useState } from 'react';
import { UserCog } from 'lucide-react';
import AuthService from '@/api/services/AuthService';
import { useAuth } from '@/context/AuthProvider';
import { useSnackbar } from '@/context/SnackbarProvider';
import Button from '@/components/shared/Button';
import Dialog from '@/components/shared/Dialog';
import FormField, { fieldClassName } from '@/components/shared/FormField';

export default function ProfileForm({ open, onClose }) {
  const { user, updateUser } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      setName(user.fields?.name || '');
    }
  }, [open, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await AuthService.updateProfile({ fields: { name: name.trim() } });
      const userData = response.data || response;
      updateUser(userData);
      openSnackbar('Perfil actualitzat!', 'success');
      onClose();
    } catch (error) {
      openSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      title="Editar perfil"
      description="Actualitza la informació visible del teu compte."
      icon={<UserCog className="h-4 w-4" />}
      onClose={onClose}
      maxWidth="max-w-md"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel·lar</Button>
          <Button type="submit" form="profile-form" loading={loading} disabled={!name.trim()}>Desar canvis</Button>
        </>
      )}
    >
      <form id="profile-form" onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Nom">
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} required autoFocus className={fieldClassName} />
        </FormField>
        <FormField label="Correu electrònic" hint="El correu no es pot modificar.">
          <input type="email" value={user?.fields?.email || ''} disabled className={fieldClassName} />
        </FormField>
      </form>
    </Dialog>
  );
}
