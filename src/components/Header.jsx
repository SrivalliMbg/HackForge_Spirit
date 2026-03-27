import { Bell, Menu, Search } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="panel sticky top-4 z-20 flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="interactive-button inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-sm font-medium text-slate-500">Feedback command center</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">FeedFlow Dashboard</h1>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <label className="interactive-card flex max-w-md flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search feedback, customers, or IDs"
            className="w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </label>
        <button
          type="button"
          className="interactive-button relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <Bell size={18} />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500" />
        </button>
        <div className="interactive-card flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white transition duration-200 group-hover:bg-slate-800">
            SP
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Spirit</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
