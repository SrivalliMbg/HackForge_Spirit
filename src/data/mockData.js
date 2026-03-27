export const sidebarItems = [
  'Dashboard',
  'Live Feedback',
  'Customers',
  'Analytics',
  'Settings',
];

export const statsConfig = [
  'Total Feedback Received',
  'Pending Review',
  'Auto-Routed',
  'Resolved Today',
];

export const sourceOptions = ['All sources', 'Email', 'Review', 'Chat', 'Form'];
export const teamOptions = ['All teams', 'Support', 'Tech', 'Billing', 'Delivery', 'Sales'];
export const priorityOptions = ['All priorities', 'Low', 'Medium', 'High', 'Critical'];

export const emptyDashboardData = {
  feedbackEntries: [],
  recentActivities: [],
  replyTemplates: [],
  sentimentTrend: [],
  teamWorkload: [],
};

export const emptyFeedbackTemplate = {
  id: '',
  customer: '',
  customerEmail: '',
  source: '',
  preview: '',
  message: '',
  category: '',
  sentiment: '',
  priority: '',
  team: '',
  status: '',
  receivedAt: '',
  date: '',
  confidence: 0,
  autoReply: '',
  autoReplyStatus: '',
  aiAction: {
    category: '',
    sentiment: '',
    recommendedTeam: '',
    replyGenerated: false,
    taskStatus: '',
    replyStatus: '',
  },
};
