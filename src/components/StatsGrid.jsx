import { formatStatValue } from '../utils/dashboard';

export default function StatsGrid({ stats }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="panel px-5 py-5">
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-3xl font-bold tracking-tight text-slate-900">{formatStatValue(stat.value)}</p>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 transition duration-200 hover:bg-slate-200 hover:text-slate-700">
              {stat.change || 'Waiting for data'}
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">{stat.trend || 'Metrics will appear once the backend is connected.'}</p>
        </article>
      ))}
    </section>
  );
}
