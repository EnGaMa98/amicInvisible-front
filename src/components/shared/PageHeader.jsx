export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>}
        <h1 className="display-title text-3xl text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm leading-6 text-ink-muted sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
