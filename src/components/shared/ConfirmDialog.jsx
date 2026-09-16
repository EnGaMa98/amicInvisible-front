import { AlertTriangle } from 'lucide-react';
import Button from '@/components/shared/Button';
import Dialog from '@/components/shared/Dialog';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Dialog
      open={open}
      title={title}
      icon={<AlertTriangle className="h-4 w-4 text-danger-600" />}
      onClose={onCancel}
      maxWidth="max-w-md"
      footer={(
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel·lar</Button>
          <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
        </>
      )}
    >
      <p className="text-sm leading-6 text-ink-muted">{message}</p>
    </Dialog>
  );
}
