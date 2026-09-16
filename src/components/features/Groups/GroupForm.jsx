import { useState } from 'react';
import { Gift } from 'lucide-react';
import Button from '@/components/shared/Button';
import Dialog from '@/components/shared/Dialog';
import FormField, { fieldClassName } from '@/components/shared/FormField';

export default function GroupForm({ open, group, onSave, onClose, title, submitLabel }) {
  if (!open) return null;

  return <GroupFormContent group={group} onSave={onSave} onClose={onClose} title={title} submitLabel={submitLabel} />;
}

function GroupFormContent({ group, onSave, onClose, title, submitLabel }) {
  const [fields, setFields] = useState({
    name: group?.fields.name || '',
    description: group?.fields.description || '',
    budget: group?.fields.budget || '',
    event_date: group?.fields.event_date || '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ fields });
  };

  const handleChange = (key, value) => {
    setFields((previousFields) => ({ ...previousFields, [key]: value }));
  };

  const formTitle = title || (group ? 'Editar grup' : 'Nou grup');
  const actionLabel = submitLabel || (group ? 'Desar canvis' : 'Crear grup');

  return (
    <Dialog
      open
      title={formTitle}
      description="Defineix els detalls principals del sorteig."
      icon={<Gift className="h-4 w-4" />}
      onClose={onClose}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel·lar</Button>
          <Button type="submit" form="group-form">{actionLabel}</Button>
        </>
      )}
    >
      <form id="group-form" onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Nom">
          <input
            type="text"
            required
            value={fields.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Nadal 2026, Reis Mags..."
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Descripció" optional>
          <textarea
            value={fields.description}
            onChange={(event) => handleChange('description', event.target.value)}
            rows={3}
            placeholder="Afegeix context o indicacions per al grup..."
            className={`${fieldClassName} resize-none`}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Pressupost (€)" optional>
            <input
              type="number"
              step="0.01"
              min="0"
              value={fields.budget}
              onChange={(event) => handleChange('budget', event.target.value)}
              placeholder="20.00"
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Data de l'esdeveniment" optional>
            <input
              type="date"
              value={fields.event_date}
              onChange={(event) => handleChange('event_date', event.target.value)}
              className={fieldClassName}
            />
          </FormField>
        </div>
      </form>
    </Dialog>
  );
}
