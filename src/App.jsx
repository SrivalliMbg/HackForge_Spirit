import { useState } from 'react';
import AIActionPanel from './components/AIActionPanel';
import AnalyticsOverview from './components/AnalyticsOverview';
import AutoReplyTemplates from './components/AutoReplyTemplates';
import FeedbackDetailDrawer from './components/FeedbackDetailDrawer';
import FeedbackTable from './components/FeedbackTable';
import Header from './components/Header';
import LatestFeedbackFeed from './components/LatestFeedbackFeed';
import RecentActivityTimeline from './components/RecentActivityTimeline';
import Sidebar from './components/Sidebar';
import StatsGrid from './components/StatsGrid';
import TeamWorkload from './components/TeamWorkload';
import VerificationPanels from './components/VerificationPanels';
import { emptyDashboardData, sidebarItems, statsConfig } from './data/mockData';
import { applyFilters, getVerificationBuckets } from './utils/dashboard';

const initialFilters = {
  status: 'All',
  search: '',
  source: 'All sources',
  team: 'All teams',
  priority: 'All priorities',
};

const stats = statsConfig.map((label) => ({
  label,
  value: 0,
  change: 'Waiting for data',
  trend: 'Metrics will appear once the backend is connected.',
}));

export default function App() {
  const [activeItem] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [entries, setEntries] = useState(emptyDashboardData.feedbackEntries);
  const [focusedEntryId, setFocusedEntryId] = useState(null);
  const [drawerEntryId, setDrawerEntryId] = useState(null);

  const filteredEntries = applyFilters(entries, filters);
  const verificationBuckets = getVerificationBuckets(entries);
  const focusedEntry = entries.find((entry) => entry.id === focusedEntryId) ?? null;
  const drawerEntry = entries.find((entry) => entry.id === drawerEntryId) ?? null;

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSelectEntry = (entry) => {
    setFocusedEntryId(entry.id);
    setDrawerEntryId(entry.id);
    setIsSidebarOpen(false);
  };

  const handleMarkVerified = (entryId) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              status: 'Verified',
              receivedAt: 'just now',
              aiAction: {
                ...entry.aiAction,
                taskStatus: 'Completed',
              },
            }
          : entry,
      ),
    );
    setFocusedEntryId(entryId);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 lg:p-6">
      <div className="mx-auto flex max-w-[1800px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-panel">
        <Sidebar
          items={sidebarItems}
          activeItem={activeItem}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1 p-4 lg:p-6">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="mt-6 space-y-6">
            <StatsGrid stats={stats} />

            <div className="grid gap-6 2xl:grid-cols-[1.5fr_1fr]">
              <LatestFeedbackFeed entries={entries} onViewDetails={handleSelectEntry} />
              <AIActionPanel selectedEntry={focusedEntry} />
            </div>

            <FeedbackTable
              entries={filteredEntries}
              filters={filters}
              onFilterChange={handleFilterChange}
              onSelectEntry={handleSelectEntry}
              onMarkVerified={handleMarkVerified}
            />

            <VerificationPanels
              pending={verificationBuckets.pending}
              verified={verificationBuckets.verified}
              onSelect={handleSelectEntry}
            />

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <AutoReplyTemplates templates={emptyDashboardData.replyTemplates} />
              <TeamWorkload data={emptyDashboardData.teamWorkload} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <AnalyticsOverview sentimentTrend={emptyDashboardData.sentimentTrend} />
              <RecentActivityTimeline activities={emptyDashboardData.recentActivities} />
            </div>
          </main>
        </div>
      </div>

      <FeedbackDetailDrawer
        entry={drawerEntry}
        onClose={() => setDrawerEntryId(null)}
        onMarkVerified={handleMarkVerified}
      />
    </div>
  );
}
