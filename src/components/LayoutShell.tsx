import type { ReactNode } from "react";
import { sidebarNav, chatHeader, chatInputPlaceholder } from "@/data/mockData";
import { AgentMessageCard } from "./AgentMessageCard";
import { ChatInputArea } from "./ChatInputArea";
import { agentMessage } from "@/data/mockData";

interface LayoutShellProps {
  children?: ReactNode;
  onOptimize?: () => void;
}

/**
 * Slack-style three-column layout per Figma:
 * 1. Far left: app nav (icons)
 * 2. Left sidebar: workspace nav (channels, DMs, apps)
 * 3. Main: chat header, messages, input
 */
export function LayoutShell({ children, onOptimize }: LayoutShellProps) {
  return (
    <div className="flex h-screen w-full font-sans bg-white">
      {/* Far left - app nav */}
      <aside
        className="flex w-14 shrink-0 flex-col items-center gap-figma-2 bg-ui-sidebar py-figma-3"
        aria-label="App navigation"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-figma-base-inverse-secondary text-figma-content-inverse-primary font-figma-bold text-sm">
          A
        </div>
        <nav className="flex flex-1 flex-col gap-figma-1">
          <a
            href="#home"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-figma-content-inverse-primary hover:bg-white/10"
            aria-label="Home"
          >
            <span aria-hidden>🏠</span>
          </a>
          <a
            href="#dms"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-figma-content-inverse-primary hover:bg-white/10"
            aria-label="DMs"
          >
            <span aria-hidden>💬</span>
            {sidebarNav.dmsBadge > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-figma-base-inverse-highlight-2 px-1 text-[10px] font-figma-bold text-white">
                {sidebarNav.dmsBadge}
              </span>
            )}
          </a>
          <a
            href="#activity"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-figma-content-inverse-primary hover:bg-white/10"
            aria-label="Activity"
          >
            <span aria-hidden>🔔</span>
            {sidebarNav.activityBadge > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-figma-base-inverse-highlight-2 px-1 text-[10px] font-figma-bold text-white">
                {sidebarNav.activityBadge}
              </span>
            )}
          </a>
          <a
            href="#later"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-figma-content-inverse-primary hover:bg-white/10"
            aria-label="Later"
          >
            <span aria-hidden>🔖</span>
          </a>
          <a
            href="#more"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-figma-content-inverse-primary hover:bg-white/10"
            aria-label="More"
          >
            <span aria-hidden>⋯</span>
          </a>
        </nav>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-figma-base-inverse-secondary text-figma-content-inverse-primary">
          <span className="text-xs">👤</span>
        </div>
      </aside>

      {/* Left sidebar - workspace */}
      <aside
        className="flex w-60 shrink-0 flex-col bg-ui-sidebar"
        aria-label="Workspace"
      >
        <div className="flex items-center gap-figma-2 px-figma-3 py-figma-3">
          <span className="font-sans text-[15px] font-semibold leading-[22px] text-white">
            {sidebarNav.workspaceName}
          </span>
          <span className="text-figma-content-inverse-primary">▾</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-figma-2">
          <div className="space-y-0.5 py-figma-2">
            <a href="#unreads" className="block rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10">
              Unreads
            </a>
            <a href="#threads" className="relative flex items-center gap-figma-2 rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10">
              Threads
              {sidebarNav.threadsCount > 0 && (
                <span className="rounded-full bg-figma-base-inverse-highlight-2 px-1.5 text-[11px] font-bold text-white">
                  {sidebarNav.threadsCount}
                </span>
              )}
            </a>
            <a href="#recap" className="block rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10">
              Recap
            </a>
            <a href="#drafts" className="block rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10">
              Drafts & sent
            </a>
          </div>
          <div className="border-t border-white/10 py-figma-2">
            <div className="px-figma-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white/50">
              ★ Starred
            </div>
            {sidebarNav.starredChannels.map((ch) => (
              <a
                key={ch}
                href={`#${ch}`}
                className="block rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10"
              >
                #{ch.replace("#", "")}
              </a>
            ))}
          </div>
          <div className="border-t border-white/10 py-figma-2">
            <div className="px-figma-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white/50">
              🚀 Project Beta
            </div>
            {sidebarNav.projectBetaChannels.map((ch) => (
              <a
                key={ch}
                href={`#${ch}`}
                className="block rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10"
              >
                {ch}
              </a>
            ))}
          </div>
          <div className="border-t border-white/10 py-figma-2">
            <div className="px-figma-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white/50">
              Channels
            </div>
            {sidebarNav.channels.map((ch) => (
              <a
                key={ch}
                href={`#${ch}`}
                className="block rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10"
              >
                #{ch.replace("#", "")}
              </a>
            ))}
          </div>
          <div className="border-t border-white/10 py-figma-2">
            <div className="px-figma-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white/50">
              Direct messages
            </div>
            {sidebarNav.directMessages.map((dm) => (
              <a
                key={dm.name}
                href="#"
                className="flex items-center gap-1 rounded px-figma-2 py-1 font-sans text-[13px] text-white hover:bg-white/10"
              >
                <span className="flex-1">{dm.name}</span>
                {(dm.unread ?? 0) > 0 && (
                  <span className="rounded-full bg-figma-base-inverse-highlight-2 px-1.5 text-[11px] font-bold text-white">
                    {dm.unread}
                  </span>
                )}
                {(dm.count ?? 0) > 0 && (
                  <span className="text-[11px] text-white/60">{dm.count}</span>
                )}
              </a>
            ))}
          </div>
          <div className="border-t border-white/10 py-figma-2">
            <div className="px-figma-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white/50">
              Apps
            </div>
            {sidebarNav.apps.map((app) => (
              <a
                key={app}
                href={`#${app}`}
                className={`flex items-center gap-2 rounded px-figma-2 py-1 font-sans text-[13px] ${
                  app === sidebarNav.activeApp
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {app === "Slackbot AI" ? "🤖" : "📊"} {app}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        {/* Top bar with search */}
        <header className="flex h-12 shrink-0 items-center gap-figma-4 border-b border-white/10 bg-ui-sidebar px-figma-4">
          <input
            type="search"
            placeholder="Search Acme Inc"
            className="flex-1 max-w-md rounded-figma-2 border-0 bg-white/15 px-figma-3 py-2 font-sans text-[13px] text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/30"
            aria-label="Search"
          />
          <button type="button" className="p-2 text-white/80 hover:text-white" aria-label="Menu">
            ⋮
          </button>
        </header>

        {/* Chat header */}
        <div className="flex shrink-0 flex-col border-b border-[#E8E8E8] bg-white px-figma-6 py-figma-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-figma-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-figma-base-important text-figma-content-important">
                <span className="text-xl">🤖</span>
              </div>
              <span className="font-sans text-[20px] font-bold leading-[28px] text-ui-primary-text">
                {chatHeader.agentName}
              </span>
            </div>
            <div className="flex items-center gap-figma-2">
              <button
                type="button"
                className="rounded-figma-2 bg-ui-trend-positive px-figma-4 py-2 font-sans text-[13px] font-semibold text-white hover:bg-[#238c3d] active:bg-[#1e7a35]"
              >
                + New Chat
              </button>
              <button type="button" className="p-2 text-ui-secondary-text hover:text-ui-primary-text" aria-label="More">
                ⋮
              </button>
            </div>
          </div>
          <nav className="mt-figma-3 flex gap-figma-6" aria-label="Chat tabs">
            {chatHeader.tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`font-sans text-[15px] font-semibold leading-[22px] ${
                  tab === chatHeader.activeTab
                    ? "text-ui-primary-text border-b-2 border-ui-primary-text pb-1"
                    : "text-ui-secondary-text hover:text-ui-primary-text"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Messages + input */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-figma-6 py-figma-6">
            {children ?? (
              <AgentMessageCard data={agentMessage} onPromptClick={onOptimize} />
            )}
          </div>
          <div className="shrink-0 border-t border-[#E8E8E8] bg-white px-figma-6 py-figma-4">
            <ChatInputArea placeholder={chatInputPlaceholder} />
          </div>
        </div>
      </main>
    </div>
  );
}
