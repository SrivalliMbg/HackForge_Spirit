import EmptyState from './EmptyState';

export default function RecentActivityTimeline({ activities }) {
  return (
    <section className="panel px-5 py-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Recent Activity Timeline</h3>
        <p className="mt-1 text-sm text-slate-500">What happened after the latest customer signal arrived</p>
      </div>

      {activities.length > 0 ? (
        <div className="mt-5 space-y-5">
          {activities.map((activity, index) => (
            <div key={`${activity.time}-${activity.title}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="mt-1 h-3 w-3 rounded-full bg-slate-900" />
                {index !== activities.length - 1 && <span className="mt-2 h-full w-px bg-slate-200" />}
              </div>
              <div className="pb-5">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                  <span className="text-xs font-medium text-slate-400">{activity.time}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{activity.detail}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="No recent activity"
            description="Timeline events such as classification, routing, acknowledgement, and verification will appear here after live data is connected."
          />
        </div>
      )}
    </section>
  );
}
