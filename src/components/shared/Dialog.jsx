import { X } from 'lucide-react';

export default function Dialog({ open, title, description, icon, children, footer, onClose, maxWidth = 'max-w-lg' }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`editorial-surface max-h-full w-full overflow-y-auto rounded-2xl animate-slide-up ${maxWidth}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                {icon}
              </div>
            )}
            <div>
              <h2 id="dialog-title" className="display-title text-xl text-ink">{title}</h2>
              {description && <p className="mt-1 text-sm leading-6 text-ink-muted">{description}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="-mr-1 rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label="Tancar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
