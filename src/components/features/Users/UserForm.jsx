import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Button from '@/components/shared/Button';
import Dialog from '@/components/shared/Dialog';
import FormField, { fieldClassName } from '@/components/shared/FormField';

export default function UserForm({ open, onSave, onClose }) {
  if (!open) return null;

  return <UserFormContent onSave={onSave} onClose={onClose} />;
}

function UserFormContent({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ fields: { name: name.trim(), email: email.trim() } });
  };

  return (
    <Dialog
      open
      title="Afegir usuari"
      description="Autoritza una nova persona perquè pugui accedir a l'aplicació."
      icon={<UserPlus className="h-4 w-4" />}
      onClose={onClose}
      maxWidth="max-w-md"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel·lar</Button>
          <Button type="submit" form="user-form" disabled={!name.trim() || !email.trim()}>Afegir</Button>
        </>
      )}
    >
      <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Nom">
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} required autoFocus className={fieldClassName} />
        </FormField>
        <FormField label="Correu electrònic">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className={fieldClassName} />
        </FormField>
      </form>
    </Dialog>
  );
}
