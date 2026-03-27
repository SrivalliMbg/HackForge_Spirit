import { Bot, MailCheck, MailOpen, UserCircle2, X } from 'lucide-react';
import { getBadgeClass } from '../utils/dashboard';

function InfoCard({ label, value }) {
  return (
    <div className="interactive-card rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-700">{value || 'Unavailable'}</p>
    </div>
  );
}

function AnalysisItem({ label, value }) {
  return (
    <div className="interactive-card rounded-2xl px-3 py-2">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-700">{value || 'Unavailable'}</p>
    </div>
  );
}

export default function FeedbackDetailDrawer({ entry, onClose, onMarkVerified }) {
  if (!entry) {
    return null;
  }

  const aiTaskStatus = entry.aiAction?.taskStatus || (entry.aiAction?.replyGenerated ? 'Completed' : 'Pending');
  const autoReplyStatus = entry.aiAction?.replyStatus || entry.autoReplyStatus || 'Not sent';

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-900/25"
        aria-label="Close details"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-4xl overflow-y-auto border-l border-slate-200 bg-white px-5 py-6 shadow-2xl md:px-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-sm font-medium text-slate-400">{entry.id || 'Feedback details'}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{entry.category || 'Feedback detail'}</h2>
          </div>
          <button
            type="button"
            className="interactive-button inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="interactive-card flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {(entry.customer || 'F').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-800">{entry.customer || 'Customer'}</p>
              <p className="mt-1 text-lg text-slate-400">{entry.customerEmail || 'customer@email.com'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.sentiment && <span className={`badge ${getBadgeClass('sentiment', entry.sentiment)}`}>{entry.sentiment}</span>}
            {entry.priority && <span className={`badge ${getBadgeClass('priority', entry.priority)}`}>{entry.priority}</span>}
          </div>
        </div>

        <div className="interactive-card mt-6 rounded-[2rem] bg-slate-50 px-5 py-5">
          <p className="text-xl font-medium text-slate-500">Customer Message</p>
          <p className="mt-3 text-2xl leading-10 text-slate-700">
            {entry.message || entry.preview || 'No full feedback message available.'}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard label="Source" value={entry.source} />
          <InfoCard label="Team" value={entry.team} />
          <InfoCard label="Status" value={entry.status} />
        </div>

        <div className="interactive-card mt-6 rounded-[2rem] border border-brand-100 bg-brand-50/60 px-5 py-5">
          <div className="flex items-center gap-3 text-brand-700">
            <Bot size={20} />
            <p className="text-lg font-semibold">AI Analysis</p>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <AnalysisItem label="Detected Category" value={entry.aiAction?.category || entry.category} />
            <AnalysisItem label="Confidence Score" value={entry.confidence ? `${entry.confidence}%` : ''} />
            <AnalysisItem label="Recommended Team" value={entry.aiAction?.recommendedTeam || entry.team} />
            <AnalysisItem label="Sentiment" value={entry.aiAction?.sentiment || entry.sentiment} />
            <AnalysisItem label="AI Task Status" value={aiTaskStatus} />
            <AnalysisItem label="Reply Status" value={autoReplyStatus} />
          </div>
        </div>

        <div className="interactive-card mt-6 rounded-[2rem] border border-emerald-100 bg-emerald-50 px-5 py-5">
          <div className="flex items-center gap-3 text-emerald-700">
            {autoReplyStatus.toLowerCase().includes('sent') ? <MailCheck size={20} /> : <MailOpen size={20} />}
            <p className="text-lg font-semibold">Auto-Reply {autoReplyStatus || 'Status'}</p>
          </div>
          <p className="mt-4 text-2xl leading-10 text-slate-700">
            {entry.autoReply || 'The backend-generated acknowledgement message will appear here once available.'}
          </p>
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
          <button
            type="button"
            className="interactive-button inline-flex min-w-64 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 text-lg font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            onClick={() => onMarkVerified(entry.id)}
            disabled={entry.status === 'Verified'}
          >
            <UserCircle2 size={20} />
            {entry.status === 'Verified' ? 'Already Verified' : 'Mark as Verified'}
          </button>
        </div>
      </aside>
    </>
  );
}
