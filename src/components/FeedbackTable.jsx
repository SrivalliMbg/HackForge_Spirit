import { Eye, Search } from 'lucide-react';
import EmptyState from './EmptyState';
import { priorityOptions, sourceOptions, teamOptions } from '../data/mockData';
import { getBadgeClass, statusFilters } from '../utils/dashboard';

export default function FeedbackTable({
  entries,
  filters,
  onFilterChange,
  onSelectEntry,
  onMarkVerified,
}) {
  return (
    <section className="panel px-5 py-5">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Feedback Management Table</h2>
          <p className="mt-1 text-sm text-slate-500">Search, filter, and review routing decisions across the feedback queue</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {statusFilters.map((status) => {
          const active = filters.status === status;
          return (
            <button
              key={status}
              type="button"
              className={`interactive-button rounded-full px-4 py-2 text-sm font-semibold ${
                active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              onClick={() => onFilterChange('status', status)}
            >
              {status}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
        <label className="interactive-card flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 2xl:col-span-2">
          <Search size={16} />
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onFilterChange('search', event.target.value)}
            placeholder="Search feedback, customer, category"
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </label>
        <select
          value={filters.source}
          onChange={(event) => onFilterChange('source', event.target.value)}
          className="interactive-card rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none hover:border-slate-300"
        >
          {sourceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          value={filters.team}
          onChange={(event) => onFilterChange('team', event.target.value)}
          className="interactive-card rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none hover:border-slate-300"
        >
          {teamOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(event) => onFilterChange('priority', event.target.value)}
          className="interactive-card rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none hover:border-slate-300"
        >
          {priorityOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        {entries.length === 0 ? (
          <div className="bg-white p-6">
            <EmptyState
              title="No feedback data available"
              description="Connect your backend feedback list endpoint and this table will populate automatically with filters, verification actions, and detail views."
            />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {['Feedback ID', 'Customer', 'Source', 'Message Preview', 'Category', 'Sentiment', 'Priority', 'Assigned Team', 'Status', 'Date', 'Actions'].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="align-top transition duration-200 hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-semibold text-slate-900">{entry.id}</td>
                    <td className="px-4 py-4 text-slate-700">{entry.customer}</td>
                    <td className="px-4 py-4"><span className={`badge ${getBadgeClass('source', entry.source)}`}>{entry.source}</span></td>
                    <td className="max-w-xs px-4 py-4 text-slate-600">{entry.preview}</td>
                    <td className="px-4 py-4 text-slate-600">{entry.category}</td>
                    <td className="px-4 py-4"><span className={`badge ${getBadgeClass('sentiment', entry.sentiment)}`}>{entry.sentiment}</span></td>
                    <td className="px-4 py-4"><span className={`badge ${getBadgeClass('priority', entry.priority)}`}>{entry.priority}</span></td>
                    <td className="px-4 py-4 text-slate-600">{entry.team}</td>
                    <td className="px-4 py-4"><span className={`badge ${getBadgeClass('status', entry.status)}`}>{entry.status}</span></td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">{entry.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-[165px] gap-2">
                        <button
                          type="button"
                          className="interactive-button inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          onClick={() => onSelectEntry(entry)}
                        >
                          <Eye size={15} />
                          View details
                        </button>
                        {entry.status === 'Pending' && (
                          <button
                            type="button"
                            className="interactive-button rounded-2xl bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800"
                            onClick={() => onMarkVerified(entry.id)}
                          >
                            Mark as verified
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
