import EmptyState from './EmptyState';

export default function AutoReplyTemplates({ templates }) {
  return (
    <section className="panel px-5 py-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Customer Auto-Reply Preview</h3>
        <p className="mt-1 text-sm text-slate-500">Reply templates generated from backend triage output</p>
      </div>

      {templates.length > 0 ? (
        <div className="mt-5 space-y-3">
          {templates.map((template) => (
            <article key={template.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{template.title}</p>
                <span className="badge border-slate-200 bg-white text-slate-600">{template.type}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">“{template.message}”</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="No auto-reply templates loaded"
            description="Once backend-generated acknowledgement templates are available, they will appear here for review before sending."
          />
        </div>
      )}
    </section>
  );
}
