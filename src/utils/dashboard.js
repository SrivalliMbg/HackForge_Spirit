const sentimentStyles = {
  Positive: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Neutral: 'border-slate-200 bg-slate-50 text-slate-600',
  Negative: 'border-rose-200 bg-rose-50 text-rose-700',
};

const priorityStyles = {
  Low: 'border-slate-200 bg-slate-50 text-slate-600',
  Medium: 'border-amber-200 bg-amber-50 text-amber-700',
  High: 'border-orange-200 bg-orange-50 text-orange-700',
  Critical: 'border-rose-200 bg-rose-50 text-rose-700',
};

const statusStyles = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  Verified: 'border-sky-200 bg-sky-50 text-sky-700',
  Routed: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const sourceStyles = {
  Email: 'bg-white text-slate-700',
  Review: 'bg-white text-slate-700',
  Chat: 'bg-white text-slate-700',
  Form: 'bg-white text-slate-700',
};

export const statusFilters = ['All', 'Pending', 'Verified', 'Routed', 'Resolved'];

export const cx = (...classes) => classes.filter(Boolean).join(' ');

export const getBadgeClass = (type, value) => {
  const sourceMap = {
    sentiment: sentimentStyles,
    priority: priorityStyles,
    status: statusStyles,
    source: sourceStyles,
  };

  return sourceMap[type]?.[value] ?? 'border-slate-200 bg-slate-50 text-slate-600';
};

export const applyFilters = (entries, filters) => {
  const search = filters.search.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesStatus = filters.status === 'All' || entry.status === filters.status;
    const matchesSource = filters.source === 'All sources' || entry.source === filters.source;
    const matchesTeam = filters.team === 'All teams' || entry.team === filters.team;
    const matchesPriority = filters.priority === 'All priorities' || entry.priority === filters.priority;
    const matchesSearch =
      !search ||
      [entry.id, entry.customer, entry.preview, entry.category, entry.team]
        .join(' ')
        .toLowerCase()
        .includes(search);

    return matchesStatus && matchesSource && matchesTeam && matchesPriority && matchesSearch;
  });
};

export const getVerificationBuckets = (entries) => ({
  pending: entries.filter((entry) => entry.status === 'Pending').slice(0, 4),
  verified: entries.filter((entry) => entry.status === 'Verified').slice(0, 4),
});

export const getWorkloadWidth = (count, max) => {
  if (!max) {
    return '0%';
  }

  return `${Math.round((count / max) * 100)}%`;
};

export const formatStatValue = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  return value || '0';
};
