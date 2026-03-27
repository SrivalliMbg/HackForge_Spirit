import { Bot, CheckCircle2, MailCheck, ShieldCheck, Sparkles } from 'lucide-react';
import EmptyState from './EmptyState';

const actionRows = [
  { key: 'Detected category', icon: Sparkles, field: 'category' },
  { key: 'Sentiment analysis', icon: Bot, field: 'sentiment' },
  { key: 'Recommended team', icon: ShieldCheck, field: 'recommendedTeam' },
  { key: 'AI task status', icon: CheckCircle2, field: 'taskStatus' },
  { key: 'Auto-reply status', icon: MailCheck, field: 'replyStatus' },
];

export default function AIActionPanel({ selectedEntry }) {
  const details = selectedEntry?.aiAction;

  return (
    <section className="panel px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI Action Panel</h3>
          <p className="mt-1 text-sm text-slate-500">Operational trace for the currently selected feedback</p>
        </div>
        <div className="rounded-2xl bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
          {selectedEntry ? `${selectedEntry.confidence}% confidence` : 'No feedback selected'}
        </div>
      </div>

      {selectedEntry ? (
        <div className="mt-5 space-y-3">
          {actionRows.map(({ key, icon: Icon, field }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600">
                  <Icon size={18} />
                </div>
                <p className="text-sm font-medium text-slate-600">{key}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {typeof details[field] === 'boolean'
                  ? details[field]
                    ? 'Completed'
                    : 'Pending'
                  : details[field] || 'Unavailable'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="No AI action data yet"
            description="Connect the feedback endpoint and select a record to inspect detected category, sentiment, routing recommendation, task completion, and auto-reply status."
          />
        </div>
      )}
    </section>
  );
}
