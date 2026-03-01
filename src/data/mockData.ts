/**
 * Static mock data for Budget Optimization Agent UI.
 * Matches Figma frame content; no backend.
 */

export interface MetricCardData {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  status: "off_track" | "on_track" | "at_risk";
  trend: string;
  chartLabel: string;
  /** Placeholder series for mini chart (x, y) */
  chartData: number[][];
  yAxisLabels: [string, string];
}

export interface AgentMessageData {
  id: string;
  agentName: string;
  agentAvatarLabel?: string;
  badgeLabel: string;
  timestamp: string;
  introLines: string[];
  metricCards: MetricCardData[];
  summaryText: string;
  promptButtonLabel: string;
}

export const agentMessage: AgentMessageData = {
  id: "1",
  agentName: "Marketing Intelligence Agent",
  agentAvatarLabel: "Agent",
  badgeLabel: "APP",
  timestamp: "Just now",
  introLines: [
    "👋 Hi! I'm your Marketing Intelligence Agent.",
    "I've identified a performance gap in your 'Lead Generation' objective.",
  ],
  metricCards: [
    {
      id: "leads",
      title: "Number of Leads",
      subtitle: "Quarter to Date",
      value: "20K",
      status: "off_track",
      trend: "+8% (1.4M) vs prior quarter to date",
      chartLabel: "# of Leads",
      chartData: [
        [0, 0.2],
        [0.25, 0.4],
        [0.5, 0.6],
        [0.75, 0.85],
        [1, 0.7],
      ],
      yAxisLabels: ["$0", "800-"],
    },
    {
      id: "cpl",
      title: "CPL",
      subtitle: "Quarter to Date",
      value: "$1.4",
      status: "off_track",
      trend: "+8% (1.4M) vs prior quarter to date",
      chartLabel: "Lower CPC",
      chartData: [
        [0, 0.3],
        [0.25, 0.5],
        [0.5, 0.7],
        [0.75, 0.6],
        [1, 0.9],
      ],
      yAxisLabels: ["$0", "$2"],
    },
  ],
  summaryText:
    "Currently, 2 of your goals are trending Off Track. To protect your pipeline and maximize ROI, I recommend reviewing these optimization opportunities in your dashboard.",
  promptButtonLabel: "Optimize Goals in MI",
};

export interface DirectMessageItem {
  name: string;
  unread?: number;
  count?: number;
}

export const sidebarNav = {
  workspaceName: "Acme Inc.",
  unreads: true,
  threadsCount: 1,
  recap: true,
  draftsCount: 3,
  sentCount: 1,
  starredChannels: [
    "#announcements",
    "#general",
    "#helpdesk",
    "#marketing",
    "#hiring",
  ],
  projectBetaChannels: ["#project-beta", "acme-leads"],
  channels: ["#sales", "#support", "#user-feedback"],
  directMessages: [
    { name: "Arcadio Buendia", unread: 1 },
    { name: "Lee Hao, Lisa Dawson", count: 3 },
  ],
  apps: ["Polly", "Slackbot AI"],
  activeApp: "Slackbot AI",
  homeBadge: 1,
  dmsBadge: 1,
  activityBadge: 1,
};

export const chatHeader = {
  agentName: "Marketing Intelligence Agent",
  tabs: ["Chat", "History", "About"] as const,
  activeTab: "Chat" as const,
};

export const chatInputPlaceholder = "Ask Slackbot AI a question";
