import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/shared/Button';
import Dialog from '@/components/shared/Dialog';
import FormField, { fieldClassName } from '@/components/shared/FormField';

export default function SendEmailsForm({ open, emailBody, participantCount, onSend, onClose }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setBody(emailBody || '');
    }
  }, [open, emailBody]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSend(body);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      title="Enviar correus"
      description={`S'enviarà l'assignació als ${participantCount} participants del grup.`}
      icon={<Send className="h-4 w-4" />}
      onClose={onClose}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel·lar</Button>
          <Button type="submit" form="send-emails-form" variant="success" loading={loading}>
            Enviar correus
          </Button>
        </>
      )}
    >
      <form id="send-emails-form" onSubmit={handleSubmit}>
        <FormField
          label="Missatge personalitzat"
          optional
          hint="El nom de la persona assignada, el pressupost i la data s'inclouen automàticament."
        >
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={5}
            placeholder="Escriu un missatge per als participants..."
            className={`${fieldClassName} resize-none`}
          />
        </FormField>
      </form>
    </Dialog>
  );
}
