import { useState } from 'react';
import { UserRound } from 'lucide-react';
import Button from '@/components/shared/Button';
import Dialog from '@/components/shared/Dialog';
import FormField, { fieldClassName } from '@/components/shared/FormField';

export default function ParticipantForm({ open, participant, onSave, onClose }) {
  if (!open) return null;

  return <ParticipantFormContent participant={participant} onSave={onSave} onClose={onClose} />;
}

function ParticipantFormContent({ participant, onSave, onClose }) {
  const [fields, setFields] = useState({
    name: participant?.fields.name || '',
    email: participant?.fields.email || '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ fields });
  };

  return (
    <Dialog
      open
      title={participant ? 'Editar participant' : 'Afegir participant'}
      description="Aquesta persona rebrà la seva assignació per correu electrònic."
      icon={<UserRound className="h-4 w-4" />}
      onClose={onClose}
      maxWidth="max-w-md"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel·lar</Button>
          <Button type="submit" form="participant-form">{participant ? 'Desar canvis' : 'Afegir'}</Button>
        </>
      )}
    >
      <form id="participant-form" onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Nom">
          <input
            type="text"
            required
            value={fields.name}
            onChange={(event) => setFields((previousFields) => ({ ...previousFields, name: event.target.value }))}
            placeholder="Anna, Marc..."
            className={fieldClassName}
          />
        </FormField>
        <FormField label="Correu electrònic">
          <input
            type="email"
            required
            value={fields.email}
            onChange={(event) => setFields((previousFields) => ({ ...previousFields, email: event.target.value }))}
            placeholder="anna@exemple.com"
            className={fieldClassName}
          />
        </FormField>
      </form>
    </Dialog>
  );
}
