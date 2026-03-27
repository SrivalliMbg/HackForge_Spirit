import EmptyState from './EmptyState';
import { getWorkloadWidth } from '../utils/dashboard';

export default function TeamWorkload({ data }) {
  const max = Math.max(...data.map((item) => item.count), 0);
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="panel px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Team Workload</h3>
          <p className="mt-1 text-sm text-slate-500">Current routing volume by owning team</p>
        </div>
        <p className="text-sm font-medium text-slate-500">{total} active items</p>
      </div>

      {data.length > 0 ? (
        <div className="mt-5 space-y-4">
          {data.map((item) => (
            <div key={item.team}>
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium text-slate-700">{item.team}</p>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{item.count}</p>
                  <p className="text-xs text-slate-500">{item.delta || 'No delta yet'}</p>
                </div>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{ width: getWorkloadWidth(item.count, max) }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="No workload data available"
            description="Assigned team counts will show here once routed feedback is returned by the backend."
          />
        </div>
      )}
    </section>
  );
}
