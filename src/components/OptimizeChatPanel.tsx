import { useEffect, useRef, useState } from "react";
import { DetailsModal } from "./DetailsModal";

interface OptimizeChatPanelProps {
  onClose: () => void;
  adsPaused?: boolean;
  onAdsPaused?: () => void;
  onOpenBudgetModal?: () => void;
}

// ─── Design tokens (Figma node 442:325933) ───────────────────────────────────
const C = {
  textDark:     "#03234D",   // on-surface-3
  textMid:      "#2E2E2E",   // on-surface-2
  textLight:    "#5C5C5C",   // on-surface-1
  textBlue:     "#0250D9",   // accent-2
  border1:      "#C9C9C9",   // border-1
  border2:      "#5C5C5C",   // border-2 (used on inputs + buttons)
  bgSurface:    "#FFFFFF",
  bgPage:       "#F3F3F3",   // surface-container-2
  bgBox:        "#F3F3F3",   // gray info boxes inside cards
  bgSuggested:  "#EDF4FF",   // brand-base-95 (blue tint for Suggested Changes)
  panelShadow:  "0px 0px 4.4px 0px rgba(0,0,0,0.08), -1px 0px 1.44px 0px rgba(0,0,0,0.03), -4px 0px 4.4px 0px rgba(0,0,0,0.09)",
};

// ─── Sparkle icon — utility:sparkles (inline SVG, always renders) ────────────
function SparkleIcon({ size = 16, color = C.textBlue }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      {/* Large 4-pointed star */}
      <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" />
      {/* Small star (upper right) */}
      <path d="M19 2L19.9 4.6L22.5 5.5L19.9 6.4L19 9L18.1 6.4L15.5 5.5L18.1 4.6Z" />
    </svg>
  );
}

// ─── Pill button (View Details / Review) ─────────────────────────────────────
function PillButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center transition-colors hover:bg-gray-50 active:bg-gray-100"
      style={{
        height: 32,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 9999,
        border: `1px solid ${C.border2}`,
        background: C.bgSurface,
        color: C.textBlue,
        fontSize: 14,
        lineHeight: "19px",
        fontWeight: 590,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

// ─── Priority badge ───────────────────────────────────────────────────────────
const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  High:   { bg: "#FDDDE3", text: "#B60554" },
  Medium: { bg: "#FFF3CD", text: "#92610A" },
  Low:    { bg: "#D1FAE5", text: "#027A48" },
};

function PriorityBadge({ label }: { label: string }) {
  const s = PRIORITY_STYLES[label] ?? { bg: "#F3F3F3", text: "#5C5C5C" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 20,
        padding: "0 8px",
        borderRadius: 9999,
        background: s.bg,
        color: s.text,
        fontSize: 11,
        fontWeight: 590,
        lineHeight: "20px",
        whiteSpace: "nowrap",
      }}
    >
      {label} Priority
    </span>
  );
}

// ─── Individual suggestion card ───────────────────────────────────────────────
interface SuggestionCardProps {
  title: string;
  bodyText: string;
  infoBox: React.ReactNode;
  suggestedText: string;
  buttonLabel: string;
  onButton?: () => void;
  footerNote?: string;
  priorityLabel?: string;
}

function SuggestionCard({
  title,
  bodyText,
  infoBox,
  suggestedText,
  buttonLabel,
  onButton,
  footerNote,
  priorityLabel,
}: SuggestionCardProps) {
  return (
    <div
      className="flex flex-col items-start shrink-0"
      style={{
        width: 328,
        gap: 16,
        padding: 16,
        borderRadius: 8,
        border: `1px solid ${C.border1}`,
        background: C.bgSurface,
      }}
    >
      {/* ── Content rows ─────────────────────────────────────────── */}
      <div className="flex flex-col items-start w-full" style={{ gap: 8 }}>
        {/* Priority badge — shown only when filter = Priority */}
        {priorityLabel && <PriorityBadge label={priorityLabel} />}

        {/* Title */}
        <p
          className="w-full"
          style={{
            fontSize: 16,
            lineHeight: "22px",
            fontWeight: 590,
            color: C.textMid,
            whiteSpace: "pre-wrap",
          }}
        >
          {title}
        </p>

        {/* Body text */}
        <p style={{ fontSize: 13, lineHeight: "18px", color: C.textMid }}>
          {bodyText}
        </p>

        {/* Gray info box */}
        <div
          className="flex flex-col items-start shrink-0"
          style={{
            width: 296,
            padding: 8,
            borderRadius: 12,
            background: C.bgBox,
            fontSize: 13,
            lineHeight: "18px",
            color: C.textMid,
          }}
        >
          {infoBox}
        </div>

        {/* Blue Suggested Changes box */}
        <div
          className="flex flex-col items-start shrink-0"
          style={{
            width: 296,
            gap: 8,
            padding: 8,
            borderRadius: 12,
            background: C.bgSuggested,
          }}
        >
          <div className="flex items-center" style={{ gap: 8 }}>
            <SparkleIcon size={16} />
            <span
              style={{
                fontSize: 13,
                lineHeight: "18px",
                fontWeight: 590,
                color: C.textDark,
              }}
            >
              Suggested Changes
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              lineHeight: "18px",
              color: C.textMid,
              whiteSpace: "pre-wrap",
            }}
          >
            {suggestedText}
          </p>
        </div>
      </div>

      {/* ── Button row ───────────────────────────────────────────── */}
      <div className="flex items-center" style={{ gap: 8 }}>
        <PillButton label={buttonLabel} onClick={onButton} />
      </div>

      {/* ── Optional footer note (divider + pin icon + text) ─────── */}
      {footerNote && (
        <div className="flex flex-col items-start w-full" style={{ gap: 0 }}>
          {/* Divider */}
          <div className="w-full" style={{ height: 1, background: C.border1, marginBottom: 8 }} />
          <div className="flex items-start" style={{ gap: 4 }}>
            {/* Pin icon */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0 mt-0.5">
              <path
                d="M10 2.5a5 5 0 0 1 5 5c0 3.5-5 10-5 10S5 11 5 7.5a5 5 0 0 1 5-5zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                fill={C.textLight}
              />
            </svg>
            <p
              style={{
                fontSize: 13,
                lineHeight: "18px",
                color: C.textMid,
                width: 268,
                whiteSpace: "pre-wrap",
              }}
            >
              {footerNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="relative shrink-0 transition-colors duration-200"
      style={{
        width: 48,
        height: 24,
        borderRadius: 24,
        background: on ? "#066AFE" : "#C9C9C9",
        border: `1px solid ${on ? "#066AFE" : "#C9C9C9"}`,
        boxShadow: on
          ? "inset 0px 1px 0px rgba(0,0,0,0.25), inset 0px 0.5px 2px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(0,0,0,0.1)"
          : "inset 0px 1px 2px rgba(0,0,0,0.2)",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Check icon (left side, visible when ON) */}
      {on && (
        <span
          className="absolute flex items-center justify-center"
          style={{ left: 7, top: 5, width: 12, height: 12 }}
        >
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
            <path d="M1 4l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {/* Thumb */}
      <span
        className="absolute top-[2px] transition-all duration-200"
        style={{
          left: on ? 26 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

// ─── Management card ──────────────────────────────────────────────────────────
function ManagementCard({ title, on, onToggle }: { title: string; on: boolean; onToggle: () => void }) {
  return (
    <div
      className="flex flex-col items-start shrink-0"
      style={{
        width: 328,
        padding: 16,
        gap: 4,
        borderRadius: 8,
        border: `1px solid ${C.border1}`,
        background: C.bgSurface,
      }}
    >
      {/* Title */}
      <p style={{ fontSize: 16, lineHeight: "22px", fontWeight: 590, color: C.textMid }}>
        {title}
      </p>
      {/* Divider */}
      <div style={{ width: "100%", height: 1, background: C.border1, margin: "8px 0" }} />
      {/* Footer row */}
      <div className="flex items-center justify-between w-full">
        <a
          href="#"
          style={{ fontSize: 12, lineHeight: "17px", color: "#0469C1", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Manage
        </a>
        <div className="flex items-center" style={{ gap: 8 }}>
          <span style={{ fontSize: 13, lineHeight: "18px", fontWeight: 590, color: C.textMid }}>
            Autopilot
          </span>
          <ToggleSwitch on={on} onToggle={onToggle} />
        </div>
      </div>
    </div>
  );
}

const MANAGEMENT_ITEMS = [
  "Google Ads Budget",
  "Meta Ads Budget",
  "Orders Attribution Budget",
  "CPL Attribution Budget",
];

// ─── Panel ────────────────────────────────────────────────────────────────────
const FILTER_OPTIONS = ["All Suggestions", "Priority", "Type"] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export function OptimizeChatPanel({ onClose, adsPaused = false, onAdsPaused, onOpenBudgetModal }: OptimizeChatPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"Suggestions" | "Management">("Suggestions");
  const [filter, setFilter] = useState<FilterOption>("All Suggestions");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  // Autopilot toggle state — one entry per management item, all ON by default
  const [autopilot, setAutopilot] = useState<boolean[]>(MANAGEMENT_ITEMS.map(() => true));

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <>
      <div
        className="flex h-full flex-col bg-white shrink-0"
        style={{
          width: 360,
          minWidth: 360,
          borderRight: `1px solid ${C.border1}`,
          boxShadow: C.panelShadow,
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="flex shrink-0 items-center justify-between"
          style={{
            minHeight: 50,
            padding: 12,
            gap: 8,
            borderBottom: `1px solid ${C.border1}`,
            background: C.bgSurface,
          }}
        >
          <div className="flex items-center" style={{ gap: 8 }}>
            <span
              style={{
                fontSize: 20,
                lineHeight: "28px",
                fontWeight: 400,
                color: C.textDark,
                fontFamily: "'SF Pro Display', 'Inter', sans-serif",
              }}
            >
              Optimization
            </span>
            {/* Info icon */}
            <button
              type="button"
              className="flex items-center justify-center"
              style={{ width: 16, height: 16, borderRadius: 9999 }}
              aria-label="Information"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill={C.textLight} aria-hidden>
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z" />
              </svg>
            </button>
          </div>
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-full hover:bg-gray-100"
            style={{ width: 24, height: 24, borderRadius: 9999 }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M13 1 1 13M1 1l12 12" stroke={C.textLight} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────── */}
        <div
          className="flex shrink-0 items-stretch"
          style={{ background: C.bgSurface }}
        >
          {(["Suggestions", "Management"] as const).map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex items-center overflow-hidden"
                style={{
                  height: 40,
                  maxWidth: 240,
                  paddingLeft: 12,
                  paddingRight: 12,
                  gap: 8,
                  borderBottom: active
                    ? `3px solid ${C.textBlue}`
                    : `1px solid ${C.border1}`,
                  background: C.bgSurface,
                  color: active ? C.textBlue : C.textLight,
                  fontSize: 14,
                  lineHeight: "19px",
                  fontWeight: 590,
                  whiteSpace: "nowrap",
                }}
              >
                {tab === "Suggestions" && (
                  <SparkleIcon size={16} />
                )}
                {tab}
              </button>
            );
          })}
          {/* Spacer tab */}
          <div
            className="flex-1"
            style={{ borderBottom: `1px solid ${C.border1}`, height: 40 }}
          />
        </div>

        {/* ── Body (scrollable) ───────────────────────────────────────── */}
        <div
          className="flex flex-1 flex-col items-center overflow-y-auto"
          style={{ gap: 12, paddingBottom: 16 }}
        >
          {/* ── Management tab content ───────────────────────────────── */}
          {activeTab === "Management" && (
            <>
              {MANAGEMENT_ITEMS.map((title, i) => (
                <ManagementCard
                  key={title}
                  title={title}
                  on={autopilot[i]}
                  onToggle={() =>
                    setAutopilot((prev) => prev.map((v, j) => (j === i ? !v : v)))
                  }
                />
              ))}
            </>
          )}

          {/* ── Suggestions tab content ──────────────────────────────── */}
          {activeTab === "Suggestions" && (
            <>
          {/* Filter by */}
          <div
            ref={filterRef}
            className="flex flex-col items-start shrink-0 relative"
            style={{ width: 328, gap: 4, paddingTop: 12 }}
          >
            <p
              style={{
                fontSize: 13,
                lineHeight: "18px",
                fontWeight: 590,
                color: C.textMid,
              }}
            >
              Filter by
            </p>

            {/* Trigger */}
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center justify-between hover:bg-gray-50 transition-colors"
              style={{
                width: "100%",
                height: 32,
                paddingLeft: 8,
                paddingRight: 8,
                gap: 8,
                borderRadius: 8,
                border: `1px solid ${C.border2}`,
                background: C.bgSurface,
              }}
            >
              <span style={{ fontSize: 13, lineHeight: "18px", color: C.textMid }}>
                {filter}
              </span>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden
                style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }}
              >
                <path d="M2 4.5l5 5 5-5" stroke={C.textLight} strokeWidth="1.3" strokeLinecap="round" fill="none" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className="absolute z-30 flex flex-col overflow-hidden"
                style={{
                  top: "100%",
                  left: 0,
                  width: "100%",
                  marginTop: 2,
                  borderRadius: 8,
                  border: `1px solid ${C.border1}`,
                  background: C.bgSurface,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              >
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setFilter(opt); setDropdownOpen(false); }}
                    className="flex items-center text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                    style={{
                      height: 36,
                      padding: "0 12px",
                      fontSize: 13,
                      lineHeight: "18px",
                      color: opt === filter ? C.textBlue : C.textMid,
                      fontWeight: opt === filter ? 590 : 400,
                      background: opt === filter ? "#EDF4FF" : "transparent",
                      borderBottom: `1px solid ${C.border1}`,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Blue informational banner (hidden once ads are paused) ─────────── */}
          {!adsPaused && (
            <div
              className="flex items-start shrink-0"
              style={{
                width: 328,
                padding: 12,
                gap: 12,
                borderRadius: 8,
                background: "#D8E6FE",
              }}
            >
              {/* Blue sparkle icon */}
              <SparkleIcon size={16} color="#0B5CAB" />
              <p
                style={{
                  fontSize: 13,
                  lineHeight: "18px",
                  fontWeight: 590,
                  color: "#0B5CAB",
                  whiteSpace: "pre-wrap",
                  flex: 1,
                }}
              >
                its recommended pausing low performing ads before rebalancing the budget.
              </p>
            </div>
          )}

          {/* ── Suggestion cards (sorted by filter) ─────────────────── */}
          {(() => {
            // Card definitions with priority rank (lower = more urgent)
            const cards = [
              {
                id: "lead-gen",
                priorityRank: 1,
                priorityLabel: "High",
                render: (showPriority: boolean) =>
                  adsPaused ? (
                    // "10 Ads Paused" completed card
                    <div
                      key="lead-gen-paused"
                      className="flex flex-col items-start shrink-0"
                      style={{
                        width: 328,
                        padding: 16,
                        borderRadius: 8,
                        border: `1px solid ${C.border1}`,
                        background: C.bgSurface,
                      }}
                    >
                      <div className="flex items-center" style={{ gap: 8 }}>
                        <div
                          className="relative shrink-0 flex items-center justify-center"
                          style={{ width: 24, height: 24, borderRadius: "50%", background: "#41B658" }}
                        >
                          <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden>
                            <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span style={{ fontSize: 16, lineHeight: "22px", fontWeight: 590, color: C.textMid }}>
                          10 Ads Paused
                        </span>
                      </div>
                    </div>
                  ) : (
                    <SuggestionCard
                      key="lead-gen"
                      title={"Lead Generation: \n10 Underperforming Ads in Meta Ads"}
                      bodyText="Based on your current performance thresholds:"
                      infoBox={
                        <div style={{ fontSize: 13, lineHeight: "18px", color: C.textMid }}>
                          <p>
                            <strong style={{ fontWeight: 590 }}>{"Number of leads < 30"}</strong>
                            {" or "}
                            <strong style={{ fontWeight: 590 }}>{"CPL > $5"}</strong>
                          </p>
                          <p>&nbsp;</p>
                          <p style={{ color: "#022AC0" }}>Modify thresholds</p>
                        </div>
                      }
                      suggestedText="Pause these ads to save approximately $450/month in inefficient spend."
                      buttonLabel="View Details"
                      onButton={() => setShowModal(true)}
                      priorityLabel={showPriority ? "High" : undefined}
                    />
                  ),
              },
              {
                id: "cpl",
                priorityRank: 2,
                priorityLabel: "Medium",
                render: (showPriority: boolean) => (
                  <SuggestionCard
                    key="cpl"
                    title="CPL Attribution: Budget Inefficiency"
                    bodyText="Current Status:"
                    infoBox={
                      <div style={{ fontSize: 13, lineHeight: "18px", color: C.textMid }}>
                        <p>{"Total budget: "}<strong style={{ fontWeight: 590 }}>$95,000</strong></p>
                        <p>
                          {"Scale: "}<strong style={{ fontWeight: 590 }}>25 Ads</strong>
                          {" across "}<strong style={{ fontWeight: 590 }}>13 Ad Sets </strong>
                          {"in "}<strong style={{ fontWeight: 590 }}>4 Channels</strong>
                        </p>
                      </div>
                    }
                    suggestedText="Rebalance budget based on CPL performance. We've identified that 40% of your budget is being spent on ad sets with a CPL 2x higher than your average."
                    buttonLabel="Review"
                    onButton={onOpenBudgetModal}
                    priorityLabel={showPriority ? "Medium" : undefined}
                  />
                ),
              },
            ];

            const showPriority = filter === "Priority";
            const sorted = showPriority
              ? [...cards].sort((a, b) => a.priorityRank - b.priorityRank)
              : cards;

            return sorted.map((c) => c.render(showPriority));
          })()}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <DetailsModal
          onClose={() => setShowModal(false)}
          onAdsPaused={onAdsPaused}
        />
      )}
    </>
  );
}
