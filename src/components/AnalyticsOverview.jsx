import EmptyState from './EmptyState';

export default function AnalyticsOverview({ sentimentTrend }) {
  return (
    <section className="panel px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Sentiment Trends</h3>
          <p className="mt-1 text-sm text-slate-500">Five-day sentiment summary from processed feedback</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Positive</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" />Neutral</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Negative</span>
        </div>
      </div>

      {sentimentTrend.length > 0 ? (
        <div className="mt-6 grid grid-cols-5 gap-4">
          {sentimentTrend.map((day) => (
            <div key={day.label} className="rounded-3xl border border-slate-200 bg-slate-50 px-3 py-4">
              <div className="flex h-40 items-end gap-2">
                <div className="w-full rounded-t-2xl bg-emerald-500" style={{ height: `${day.positive * 2}px` }} />
                <div className="w-full rounded-t-2xl bg-slate-400" style={{ height: `${day.neutral * 2}px` }} />
                <div className="w-full rounded-t-2xl bg-rose-500" style={{ height: `${day.negative * 2}px` }} />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-slate-700">{day.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="No trend data available"
            description="Sentiment charts will render here once your analytics endpoint starts returning processed feedback history."
          />
        </div>
      )}
    </section>
  );
}
