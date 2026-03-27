import { CheckCheck } from 'lucide-react';
import EmptyState from './EmptyState';
import { getBadgeClass } from '../utils/dashboard';

function FeedbackList({ title, description, items, actionLabel, onSelect, emptyDescription }) {
  return (
    <section className="panel px-5 py-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="interactive-card rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.customer}</p>
                    <span className={`badge ${getBadgeClass('priority', item.priority)}`}>{item.priority}</span>
                    <span className={`badge ${getBadgeClass('status', item.status)}`}>{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.preview}</p>
                  <p className="mt-3 text-xs font-medium text-slate-500">{item.team} team • {item.date}</p>
                </div>
                <button
                  type="button"
                  className="interactive-button inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => onSelect(item)}
                >
                  <CheckCheck size={15} />
                  {actionLabel}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState title={`No ${title.toLowerCase()}`} description={emptyDescription} />
        </div>
      )}
    </section>
  );
}

export default function VerificationPanels({ pending, verified, onSelect }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <FeedbackList
        title="Pending Feedback"
        description="Items waiting for human confirmation before routing is finalized."
        items={pending}
        actionLabel="Mark as verified"
        onSelect={onSelect}
        emptyDescription="Pending review items from the backend will appear here when human confirmation is required."
      />
      <FeedbackList
        title="Verified Feedback"
        description="Recently checked items approved by an operations manager."
        items={verified}
        actionLabel="View details"
        onSelect={onSelect}
        emptyDescription="Verified records will appear here after reviewers approve incoming feedback actions."
      />
    </div>
  );
}
