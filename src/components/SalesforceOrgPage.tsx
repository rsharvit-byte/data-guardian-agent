import { useState, useId } from "react";
import { OptimizeChatPanel } from "./OptimizeChatPanel";
import { OptimizeBudgetModal } from "./OptimizeBudgetModal";

interface SalesforceOrgPageProps {
  onBack: () => void;
}

// ─── Figma design tokens (node 320:92342) ───────────────────────────────────
const C = {
  bgPage: "#F3F3F3",
  bgCard: "#FFFFFF",
  navShadow: "0 -1px 1px 0 rgba(0,0,0,0.05), 0 1.4px 1.5px 0 rgba(0,0,0,0.09), 0 0 1.49px 0 rgba(0,0,0,0.09)",
  cardShadow: "0 -1px 1px 0 rgba(0,0,0,0.05), 0 1.4px 1.5px 0 rgba(0,0,0,0.09), 0 0 1.49px 0 rgba(0,0,0,0.09)",
  textDark: "#03234D",   // on-surface-3
  textMid: "#2E2E2E",    // on-surface-2
  textLight: "#5C5C5C",  // on-surface-1
  textLink: "#0250D9",   // accent-2
  textBlue: "#066AFE",   // brand-base-50
  selectedBg: "#D6E6FF",
  selectedBorder: "#066AFE",
  badgeRed: "#BA0517",
  badgeRedBg: "#FEDED8",
  green: "#056764",
  borderLight: "#C9C9C9",
  chartLine: "#066AFE",
  chartRange: "#EBF3FF",
};

// ─── Goal card mini-chart ───────────────────────────────────────────────────
function GoalChart({
  yTop, yBottom, label,
}: { yTop: string; yBottom: string; label: string }) {
  const gradId = useId();
  const W = 100; const H = 81;
  const pl = 0; const pr = 4; const pt = 9; const pb = 30;
  const cw = W - pl - pr; const ch = H - pt - pb;

  const raw = [[0,0.18],[0.15,0.25],[0.3,0.38],[0.45,0.48],[0.62,0.60],[0.78,0.72],[0.9,0.82],[1,0.85]];
  const pts = raw.map(([x, y]) => ({ x: pl + x * cw, y: pt + ch - y * ch }));
  const line = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = [
    `${pts[0].x},${H - pb}`,
    ...pts.map(p => `${p.x},${p.y}`),
    `${pts[pts.length-1].x},${H - pb}`,
  ].join(" ");

  return (
    <div className="w-full">
      <div className="flex w-full" style={{ height: H }}>
        {/* Y-axis labels — plain HTML, never stretched */}
        <div className="relative shrink-0 flex flex-col justify-between pb-[22px] pr-2 text-right" style={{ width: 34 }}>
          <span className="font-sans text-[13px] leading-[18px]" style={{ color: C.textMid }}>{yTop}</span>
          <span className="font-sans text-[13px] leading-[18px]" style={{ color: C.textMid }}>{yBottom}</span>
        </div>
        {/* SVG chart area */}
        <div className="relative flex-1">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.chartLine} stopOpacity="0.18" />
                <stop offset="100%" stopColor={C.chartRange} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* Baseline */}
            <line x1={pl} y1={H - pb} x2={W - pr} y2={H - pb} stroke={C.borderLight} strokeWidth="0.8" />
            {/* Area */}
            <polygon points={area} fill={`url(#${gradId})`} />
            {/* Line */}
            <polyline points={line} fill="none" stroke={C.chartLine} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* dot rendered in HTML below to stay perfectly round despite preserveAspectRatio="none" */}
          </svg>
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between" style={{ paddingBottom: 4 }}>
            <span className="font-sans text-[13px] leading-[18px] text-center" style={{ color: C.textMid }}>##</span>
            <span className="font-sans text-[13px] leading-[18px] text-center" style={{ color: C.textMid }}>##</span>
          </div>
          {/* End dot — HTML div so it is always a perfect circle */}
          <div
            className="absolute rounded-full"
            style={{
              width: 7,
              height: 7,
              background: C.chartLine,
              // last point is always at the right edge; y is a fraction of H
              top: `calc(${(pts[pts.length - 1].y / H) * 100}% - 3.5px)`,
              right: pr * (100 / W) + "%",
              transform: "translateX(50%)",
            }}
            aria-hidden
          />
          {/* "xx" label at end */}
          <div className="absolute" style={{ top: pts[pts.length-1].y - 8, right: 0 }}>
            <span className="font-sans text-[12px]" style={{ color: C.textMid }}>xx</span>
          </div>
        </div>
      </div>
      {/* Reference line + label */}
      <div className="mt-1">
        <div className="w-full h-px" style={{ background: C.chartLine }} />
        <span className="font-sans text-[12px] leading-[17px] pl-2" style={{ color: C.chartLine }}>{label}</span>
      </div>
    </div>
  );
}

// ─── Off Track badge ────────────────────────────────────────────────────────
function OffTrackBadge() {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-sans text-[12px] font-medium leading-[17px]"
      style={{ background: C.badgeRedBg, color: C.badgeRed }}
    >
      Off Track
    </span>
  );
}

// ─── Goal metric card ───────────────────────────────────────────────────────
function GoalCard({
  title, subtitle, value, trend, yTop, yBottom, chartLabel,
}: {
  title: string; subtitle: string; value: string; trend: string;
  yTop: string; yBottom: string; chartLabel: string;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[12px] bg-white flex-1 min-w-0"
      style={{ minWidth: 220, padding: "12px 16px", boxShadow: C.cardShadow }}
    >
      {/* Header */}
      <div>
        <p className="font-sans text-[16px] leading-[22px] overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ color: C.textMid, fontWeight: 590 }}>
          {title}
        </p>
        <p className="font-sans text-[12px] leading-[17px]" style={{ color: C.textLight }}>
          {subtitle}
        </p>
      </div>
      {/* Value + badge */}
      <div className="flex items-center gap-2">
        <span className="font-sans text-[32px] leading-[40px]" style={{ color: C.textMid }}>{value}</span>
        <OffTrackBadge />
      </div>
      {/* Trend */}
      <div className="flex gap-2 items-center font-sans text-[12px] leading-[17px] whitespace-nowrap">
        <span style={{ color: C.green }}>+8%</span>
        <span style={{ color: C.textLight }}>{trend}</span>
      </div>
      {/* Chart */}
      <GoalChart yTop={yTop} yBottom={yBottom} label={chartLabel} />
    </div>
  );
}

// ─── Tree row helpers ────────────────────────────────────────────────────────
function TreeRow({ label, selected = false, chevron = false, link = false }:
  { label: string; selected?: boolean; chevron?: boolean; link?: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-[6px] text-[13px] leading-[18px] font-sans cursor-pointer select-none"
      style={{
        height: 30,
        background: selected ? C.selectedBg : "white",
        borderLeft: selected ? `4px solid ${C.selectedBorder}` : "4px solid transparent",
        color: link ? C.textLink : selected ? C.textDark : C.textDark,
        fontWeight: selected ? 400 : 400,
      }}
    >
      {chevron && (
        <span className="text-[10px] shrink-0" style={{ color: C.textLight }}>▶</span>
      )}
      {!chevron && <span className="w-[10px] shrink-0" />}
      <span className="flex-1 truncate">{label}</span>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="w-full h-px my-2" style={{ background: C.borderLight }} />;
}

// ─── Main page ───────────────────────────────────────────────────────────────
const globalNavTabs = ["Home", "Data Management", "Goals", "Analytics"];
const goalTabs = [
  { label: "Active Goals", count: 22 },
  { label: "Off Track", count: 2, active: true },
  { label: "On Track", count: 20 },
  { label: "Expired", count: 3 },
];

export function SalesforceOrgPage({ onBack }: SalesforceOrgPageProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeGoalTab, setActiveGoalTab] = useState("Off Track");
  const [adsPaused, setAdsPaused] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col font-sans overflow-hidden" style={{ background: C.bgPage }}>

      {/* ── Global Header (Figma node 320:92453) ────────────────────────── */}
      <header className="flex h-[50px] shrink-0 items-center bg-white px-3 gap-2"
        style={{ borderBottom: "1px solid #DDDBDA" }}>

        {/* Salesforce cloud logo */}
        <button type="button" onClick={onBack} className="shrink-0 flex items-center justify-center w-[40px] h-[40px] rounded hover:bg-gray-50" aria-label="Home">
          <svg viewBox="0 0 40 28" width="40" height="28" fill="none" aria-hidden>
            <path d="M16.5 4.2c1.7-1.7 4-2.7 6.5-2.7 3.1 0 5.9 1.6 7.5 4.1 1.2-.5 2.5-.8 3.9-.8 5.3 0 9.6 4.3 9.6 9.6S39.7 24 34.4 24c-.6 0-1.3-.1-1.9-.2C30.9 26.1 28 27.6 24.7 27.6c-1.3 0-2.5-.3-3.6-.7C19.5 28.7 17 30 14.2 30 9.7 30 6 26.6 5.7 22.2 2.7 20.6.8 17.5.8 14 .8 8.7 5.1 4.4 10.4 4.4c2.2 0 4.2.8 5.8 2.1.1-.8.3-.1.3-.3z"
              fill="#00A1E0" transform="scale(0.8) translate(1, -1)" />
            <path d="M4 5 C5.5 2.5 8 1 11 1 C13.5 1 15.7 2.1 17.2 3.9 C18.2 3.3 19.4 3 20.7 3 C24.5 3 27.7 6.2 27.7 10 C27.7 10.3 27.7 10.6 27.6 10.9 C28.4 10.6 29.3 10.5 30.2 10.5 C33.5 10.5 36.2 13.2 36.2 16.5 C36.2 19.8 33.5 22.5 30.2 22.5 C29.8 22.5 29.4 22.5 29 22.4 C27.8 24.3 25.7 25.5 23.3 25.5 C22.5 25.5 21.7 25.3 21 25 C19.8 26.7 17.9 27.7 15.7 27.7 C12.6 27.7 10 25.5 9.4 22.7 C7.2 22 5.6 19.9 5.6 17.5 C5.6 16.2 6 15 6.7 14 C5.1 13 4 11.3 4 9.3 C4 7.4 4.9 5.7 4 5Z"
              fill="#00A1E0" />
          </svg>
        </button>

        {/* Search bar — centred, pill shaped */}
        <div className="flex flex-1 justify-center px-4">
          <div className="flex items-center gap-2 w-full max-w-[500px] h-[28px] rounded-full px-3"
            style={{ border: "1px solid #DDDBDA", background: "#FFFFFF" }}>
            {/* Lightning bolt icon */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="#5C5C5C" aria-hidden>
              <path d="M9 1L3 9h5l-1 6 7-9H9l1-5z" />
            </svg>
            <span className="font-sans text-[13px] leading-[18px]" style={{ color: "#5C5C5C" }}>Search...</span>
          </div>
        </div>

        {/* Right icon buttons */}
        <div className="flex items-center gap-0.5 shrink-0">

          {/* Agent Astro */}
          <button type="button" className="flex h-[32px] w-[32px] items-center justify-center rounded hover:bg-gray-100" aria-label="Agentforce">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <circle cx="9" cy="11" r="1.2" fill="#5C5C5C" stroke="none" />
              <circle cx="15" cy="11" r="1.2" fill="#5C5C5C" stroke="none" />
              <path d="M9 15.5c.8.8 2 1.2 3 1.2s2.2-.4 3-1.2" />
              <path d="M12 3v2M7 5l1.2 1.5M17 5l-1.2 1.5" />
            </svg>
          </button>

          {/* Favorites (star + chevron) */}
          <button type="button" className="flex h-[32px] items-center justify-center rounded px-1 gap-0.5 hover:bg-gray-100" aria-label="Favorites">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#5C5C5C" aria-hidden>
              <path d="M2 3.5l3 3 3-3" stroke="#5C5C5C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
          </button>

          {/* New (plus) */}
          <button type="button" className="flex h-[32px] w-[32px] items-center justify-center rounded hover:bg-gray-100" aria-label="New">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Trailhead (mountain) */}
          <button type="button" className="flex h-[32px] w-[32px] items-center justify-center rounded hover:bg-gray-100" aria-label="Trailhead">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 18l5-8 4 5 3-4 6 7H3z" />
            </svg>
          </button>

          {/* Help (question mark) */}
          <button type="button" className="flex h-[32px] w-[32px] items-center justify-center rounded hover:bg-gray-100" aria-label="Help">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7" />
              <circle cx="12" cy="17" r="0.5" fill="#5C5C5C" />
            </svg>
          </button>

          {/* Setup (gear) */}
          <button type="button" className="flex h-[32px] w-[32px] items-center justify-center rounded hover:bg-gray-100" aria-label="Setup">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {/* Notification (bell) */}
          <button type="button" className="flex h-[32px] w-[32px] items-center justify-center rounded hover:bg-gray-100" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* User avatar */}
          <div className="ml-1 flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full overflow-hidden"
            style={{ background: "#EEF2F8", border: "1px solid #DDDBDA" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5C5C5C" aria-hidden>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>

        </div>
      </header>

      {/* ── Global Navigation ───────────────────────────────────────────── */}
      <div className="flex h-10 shrink-0 items-center bg-white"
        style={{ boxShadow: C.navShadow }}>
        {/* App name + waffle */}
        <div className="flex items-center gap-4 pl-4 pr-6">
          <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" style={{ color: C.textLight }} fill="currentColor" aria-hidden>
            <rect x="1" y="1" width="4" height="4" rx="0.5" /><rect x="8" y="1" width="4" height="4" rx="0.5" /><rect x="15" y="1" width="4" height="4" rx="0.5" />
            <rect x="1" y="8" width="4" height="4" rx="0.5" /><rect x="8" y="8" width="4" height="4" rx="0.5" /><rect x="15" y="8" width="4" height="4" rx="0.5" />
            <rect x="1" y="15" width="4" height="4" rx="0.5" /><rect x="8" y="15" width="4" height="4" rx="0.5" /><rect x="15" y="15" width="4" height="4" rx="0.5" />
          </svg>
          <span className="font-sans text-[20px] leading-[28px]" style={{ color: C.textDark }}>
            Marketing Intelligence
          </span>
        </div>
        {/* Nav tabs */}
        <nav className="flex h-full items-stretch">
          {globalNavTabs.map((tab) => {
            const active = tab === "Goals";
            return (
              <button key={tab} type="button"
                className="relative flex items-center px-4 font-sans text-[13px] leading-[18px] whitespace-nowrap"
                style={{ color: active ? C.textLink : C.textLight, borderBottom: active ? `2px solid ${C.textLink}` : "2px solid transparent" }}>
                {tab}
              </button>
            );
          })}
        </nav>
        {/* Edit pencil */}
        <button type="button"
          className="ml-auto mr-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          style={{ color: C.textLight }}>
          ✏️
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left panel (272px) ──────────────────────────────────────── */}
        <aside className="flex shrink-0 p-2" style={{ width: 272 }}>
          <div className="flex w-full flex-col overflow-y-auto rounded-[20px] bg-white" style={{ boxShadow: C.cardShadow }}>
            <div className="p-3 flex flex-col h-full">

              {/* Search */}
              <div className="flex items-center gap-2 rounded border px-3 py-1.5 mb-0"
                style={{ borderColor: C.borderLight, height: 32 }}>
                <svg className="h-3.5 w-3.5 shrink-0" style={{ color: C.textLight }} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M6.5 11a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm4.157-1.136 2.83 2.829-.707.707-2.83-2.829A5.5 5.5 0 1 1 10.657 9.864z" />
                </svg>
                <span className="font-sans text-[13px]" style={{ color: C.textLight }}>Search…</span>
              </div>

              {/* Data Space breadcrumb */}
              <div className="flex items-center gap-2 px-4 py-4" style={{ height: 49 }}>
                <span className="font-sans text-[12px] leading-[17px]" style={{ color: C.textDark }}>Data Space:</span>
                <span className="font-sans text-[13px] leading-[18px]" style={{ color: C.textLink }}>EMEA</span>
                <span className="text-[10px]" style={{ color: C.textLight }}>▾</span>
              </div>

              {/* Tree items */}
              <TreeRow label="Goals" selected />
              <TreeRow label="Anchor Campaigns" />
              <Divider />
              <TreeRow label="External Channels" chevron />
              <TreeRow label="Attribution | Stage-Based" chevron />
              <TreeRow label="Attribution | Touch-Based" chevron />
              <TreeRow label="Segment Intelligence" chevron />
              <TreeRow label="B2B Analytics" chevron />
              <Divider />

              {/* Collections */}
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-sans text-[14px] leading-[19px] font-semibold" style={{ color: C.textDark }}>Collections</span>
                  <span className="text-[13px]" style={{ color: C.textLight }}>ℹ</span>
                </div>
                <span className="text-[13px]" style={{ color: C.textLight }}>+</span>
              </div>
              <p className="px-4 font-sans text-[13px] leading-[18px]" style={{ color: C.textDark }}>
                <span style={{ color: "#0B5CAB" }} className="cursor-pointer hover:underline">Create a collection</span>
                {" "}to start organizing your analytics content.
              </p>

              {/* Spacer pushes Tableau Next to bottom */}
              <div className="flex-1" />
              <Divider />
              <div className="flex items-center justify-between px-4 py-[6px]" style={{ height: 30 }}>
                <span className="font-sans text-[13px] leading-[18px] font-semibold" style={{ color: C.textLink }}>Tableau Next</span>
                <span className="text-[10px]" style={{ color: C.textLink }}>↗</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="flex flex-1 flex-col overflow-hidden px-4 py-0">
          <div className="flex flex-col h-full">

            {/* Page header — Figma node 320:92445 */}
            <div className="shrink-0 w-full" style={{ background: "#F3F3F3", padding: 16 }}>
              <div className="flex items-center gap-3" style={{ minHeight: 51 }}>
                {/* Goals icon — Standard Icons / G / goals — inline SVG */}
                <div
                  className="relative shrink-0 flex items-center justify-center"
                  style={{ width: 32, height: 32, background: "#1B96FF", borderRadius: 4 }}
                >
                  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden>
                    {/* Flag pole */}
                    <rect x="1" y="0" width="2" height="17" rx="1" fill="white" />
                    {/* Checkered flag — 3 cols × 3 rows, alternating */}
                    <rect x="3"  y="0" width="4" height="3" fill="white" />
                    <rect x="7"  y="0" width="4" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect x="11" y="0" width="4" height="3" fill="white" />
                    <rect x="3"  y="3" width="4" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect x="7"  y="3" width="4" height="3" fill="white" />
                    <rect x="11" y="3" width="4" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect x="3"  y="6" width="4" height="3" fill="white" />
                    <rect x="7"  y="6" width="4" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect x="11" y="6" width="4" height="3" fill="white" />
                  </svg>
                </div>

                {/* Title */}
                <h1
                  className="font-sans"
                  style={{ fontSize: 28, lineHeight: "35px", fontWeight: 400, color: "#03234D" }}>
                  Goals Overview
                </h1>

                {/* Actions */}
                <div className="ml-auto flex items-center gap-2">
                  {/* Create a Goal — brand-outline pill */}
                  <button
                    type="button"
                    className="font-sans hover:bg-[#F4F6FF] active:bg-[#EEF1FF] transition-colors"
                    style={{
                      height: 32,
                      paddingLeft: 16,
                      paddingRight: 16,
                      borderRadius: 9999,
                      border: "1px solid #0176D3",
                      background: "#FFFFFF",
                      color: "#0176D3",
                      fontSize: 14,
                      lineHeight: "19px",
                      fontWeight: 590,
                      whiteSpace: "nowrap",
                    }}>
                    Create a Goal
                  </button>

                  {/* Optimize — brand filled pill with sparkles icon */}
                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="flex items-center gap-1.5 font-sans text-white hover:opacity-90 active:opacity-75 transition-opacity"
                    style={{
                      height: 32,
                      paddingLeft: 16,
                      paddingRight: 16,
                      borderRadius: 9999,
                      border: "1px solid #0058D1",
                      background: "linear-gradient(180deg, #1B96FF 0%, #0176D3 100%)",
                      fontSize: 14,
                      lineHeight: "19px",
                      fontWeight: 590,
                      whiteSpace: "nowrap",
                    }}>
                    {/* utility:sparkles inline SVG */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden>
                      <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" />
                      <path d="M19 2L19.9 4.6L22.5 5.5L19.9 6.4L19 9L18.1 6.4L15.5 5.5L18.1 4.6Z" />
                    </svg>
                    Optimize
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs bar */}
            <div className="shrink-0 flex items-center justify-between pt-2 px-4 bg-white"
              style={{ borderRadius: "20px 20px 0 0", boxShadow: "0 1px 1px 0 rgba(0,0,0,0.1)", height: 48 }}>
              <nav className="flex h-full items-stretch gap-0">
                {goalTabs.map(({ label, count }) => {
                  const active = label === activeGoalTab;
                  return (
                    <button key={label} type="button"
                      onClick={() => setActiveGoalTab(label)}
                      className="flex items-center gap-1.5 px-4 font-sans text-[13px] leading-[18px] whitespace-nowrap border-b-2 transition-colors"
                      style={{
                        color: active ? C.textLink : C.textLight,
                        borderBottomColor: active ? C.textLink : "transparent",
                      }}>
                      {label}
                      <span className="font-sans text-[13px]">({count})</span>
                    </button>
                  );
                })}
              </nav>
              <div className="flex items-center gap-2 mb-1">
                <button type="button"
                  className="flex h-8 w-8 items-center justify-center rounded border text-[13px]"
                  style={{ borderColor: C.borderLight, color: C.textLight }}>
                  ↺
                </button>
                <div className="flex items-center gap-1.5 rounded border px-3"
                  style={{ borderColor: C.borderLight, height: 32 }}>
                  <svg className="h-3.5 w-3.5" style={{ color: C.textLight }} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path d="M6.5 11a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm4.157-1.136 2.83 2.829-.707.707-2.83-2.829A5.5 5.5 0 1 1 10.657 9.864z" />
                  </svg>
                  <span className="font-sans text-[13px]" style={{ color: C.textLight }}>Search…</span>
                </div>
              </div>
            </div>

            {/* Goal cards grid */}
            <div className="flex-1 overflow-y-auto bg-white px-[22px] py-4"
              style={{ borderRadius: "0 0 20px 20px" }}>
              <div className="flex flex-nowrap gap-[12px]">
                {!adsPaused && (
                  <GoalCard
                    title="Number of Leads"
                    subtitle="Quarter to Date"
                    value="20K"
                    trend="(1.4M) vs prior quarter to date"
                    yTop="800"
                    yBottom="$0"
                    chartLabel="# of Leads"
                  />
                )}
                <GoalCard
                  title="CPL"
                  subtitle="Quarter to Date"
                  value="$2.4"
                  trend="(1.4M) vs prior quarter to date"
                  yTop="$2"
                  yBottom="$0"
                  chartLabel="Lower CPC"
                />
              </div>
            </div>
          </div>
        </main>

        {/* ── Right chat panel ──────────────────────────────────────────── */}
        {chatOpen && (
          <OptimizeChatPanel
            onClose={() => setChatOpen(false)}
            adsPaused={adsPaused}
            onAdsPaused={() => setAdsPaused(true)}
            onOpenBudgetModal={() => setShowBudgetModal(true)}
          />
        )}

        {/* ── Optimize Budget modal ─────────────────────────────────────── */}
        {showBudgetModal && <OptimizeBudgetModal onClose={() => setShowBudgetModal(false)} />}
      </div>
    </div>
  );
}
