import {
  BarChart3,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareMore,
  Settings,
} from 'lucide-react';
import { cx } from '../utils/dashboard';

const iconMap = {
  Dashboard: LayoutDashboard,
  'Live Feedback': MessageSquareMore,
  Customers: LifeBuoy,
  Analytics: BarChart3,
  Settings,
};

export default function Sidebar({ items, activeItem, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0 lg:rounded-l-[2rem]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-3 px-3">
          <div className="interactive-card flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <MessageSquareMore size={22} />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">FeedFlow</p>
            <p className="text-sm text-slate-500">AI feedback operations</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {items.map((item) => {
            const Icon = iconMap[item] ?? LayoutDashboard;
            const active = item === activeItem;

            return (
              <button
                key={item}
                type="button"
                className={cx(
                  'interactive-button flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium',
                  active
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <Icon size={18} />
                {item}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
