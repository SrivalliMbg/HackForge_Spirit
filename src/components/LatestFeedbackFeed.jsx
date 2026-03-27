import { ArrowUpRight } from 'lucide-react';
import EmptyState from './EmptyState';
import { getBadgeClass } from '../utils/dashboard';

export default function LatestFeedbackFeed({ entries, onViewDetails }) {
  return (
    <section className="panel px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Live Latest Feedback Feed</h2>
          <p className="text-sm text-slate-500">Incoming customer feedback with AI triage signals</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Waiting for stream
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="mt-5 space-y-3">
          {entries.slice(0, 5).map((entry) => (
            <article
              key={entry.id}
              className="interactive-card rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{entry.customer}</p>
                    <span className={`badge ${getBadgeClass('source', entry.source)}`}>{entry.source}</span>
                    <span className={`badge ${getBadgeClass('sentiment', entry.sentiment)}`}>{entry.sentiment}</span>
                    <span className={`badge ${getBadgeClass('priority', entry.priority)}`}>{entry.priority}</span>
                    <span className={`badge ${getBadgeClass('status', entry.status)}`}>{entry.status}</span>
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-slate-600">{entry.preview}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                    <span>Assigned to {entry.team}</span>
                    <span>{entry.receivedAt}</span>
                    <span>{entry.id}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="interactive-button inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  onClick={() => onViewDetails(entry)}
                >
                  View details
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="No live feedback yet"
            description="Incoming feedback items will appear here after your websocket or polling layer is connected to the backend."
          />
        </div>
      )}
    </section>
  );
}
