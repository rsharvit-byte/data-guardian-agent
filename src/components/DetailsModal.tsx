import { useEffect, useState } from "react";

// ─── Design tokens (Figma node 320:93878 / 320:94058) ────────────────────────
const C = {
  textDark:   "#03234D",
  textMid:    "#5C5C5C",
  textBlue:   "#0250D9",
  border1:    "#C9C9C9",
  border2:    "#5C5C5C",
  bgHeader:   "#F3F3F3",
  bgWhite:    "#FFFFFF",
  badgeRed:   { bg: "#FDDDE3", text: "#B60554" },
  badgeGreen: { bg: "#ECFDF5", text: "#027A48" },
  modalShadow:"0px -1px 1.7px 0px rgba(0,0,0,0.03), 0px 5.7px 5.9px 0px rgba(0,0,0,0.07), 0px 0px 5.9px 0px rgba(0,0,0,0.07)",
};

// ─── Themed ad thumbnail SVGs — match campaign names ─────────────────────────
const AdThumb = {
  /** Summer Ads — blue sky, bright sun, green grass */
  summer1: (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" style={{ borderRadius: 4, display: "block" }}>
      <rect width="56" height="40" fill="#64B5F6" rx="4" />
      {/* Sky gradient overlay */}
      <rect width="56" height="28" fill="#42A5F5" />
      {/* Sun */}
      <circle cx="42" cy="11" r="7" fill="#FFD600" />
      {/* Sun rays */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line key={i}
          x1={42 + Math.cos(deg * Math.PI / 180) * 9}
          y1={11 + Math.sin(deg * Math.PI / 180) * 9}
          x2={42 + Math.cos(deg * Math.PI / 180) * 12}
          y2={11 + Math.sin(deg * Math.PI / 180) * 12}
          stroke="#FFD600" strokeWidth="1.5" strokeLinecap="round"
        />
      ))}
      {/* Clouds */}
      <ellipse cx="14" cy="10" rx="8" ry="4" fill="white" opacity="0.9" />
      <ellipse cx="20" cy="9" rx="6" ry="3.5" fill="white" opacity="0.9" />
      {/* Ground */}
      <rect x="0" y="28" width="56" height="12" fill="#66BB6A" />
      {/* Ground highlight */}
      <rect x="0" y="28" width="56" height="3" fill="#81C784" />
    </svg>
  ),
  /** Summer Ads 2 — beach/warm sunset feel */
  summer2: (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" style={{ borderRadius: 4, display: "block" }}>
      <rect width="56" height="40" fill="#FFA726" rx="4" />
      {/* Sky */}
      <rect width="56" height="24" fill="#FF7043" />
      {/* Gradient sky */}
      <rect width="56" height="12" fill="#FFCC02" opacity="0.5" />
      {/* Sun low */}
      <circle cx="28" cy="20" r="9" fill="#FFD600" opacity="0.85" />
      {/* Water */}
      <rect x="0" y="24" width="56" height="16" fill="#1565C0" rx="0 0 4 4" />
      {/* Waves */}
      <path d="M0 26 Q7 24 14 26 Q21 28 28 26 Q35 24 42 26 Q49 28 56 26" stroke="white" strokeWidth="1" opacity="0.5" fill="none" />
      {/* Sun reflection */}
      <rect x="24" y="24" width="8" height="12" fill="#FFD600" opacity="0.3" />
    </svg>
  ),
  /** Fall Ads — orange sky, autumn tree, falling leaves */
  fall: (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" style={{ borderRadius: 4, display: "block" }}>
      <rect width="56" height="40" fill="#BF360C" rx="4" />
      {/* Sky */}
      <rect width="56" height="26" fill="#E64A19" />
      {/* Tree trunk */}
      <rect x="24" y="18" width="5" height="14" fill="#5D4037" rx="1" />
      {/* Canopy */}
      <ellipse cx="26" cy="16" rx="12" ry="10" fill="#E65100" />
      <ellipse cx="18" cy="20" rx="8" ry="7" fill="#FF6D00" />
      <ellipse cx="34" cy="20" rx="8" ry="7" fill="#FF8F00" />
      {/* Leaves on ground */}
      <ellipse cx="10" cy="36" rx="5" ry="2.5" fill="#FF6D00" opacity="0.8" />
      <ellipse cx="46" cy="37" rx="4" ry="2" fill="#E65100" opacity="0.8" />
      <ellipse cx="30" cy="38" rx="4" ry="2" fill="#FF8F00" opacity="0.7" />
      {/* Ground */}
      <rect x="0" y="34" width="56" height="6" fill="#4E342E" rx="0 0 4 4" />
    </svg>
  ),
  /** Fall Ads 2 — finance/investment theme with upward arrow */
  fallInvest: (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" style={{ borderRadius: 4, display: "block" }}>
      <rect width="56" height="40" fill="#1B5E20" rx="4" />
      {/* Chart background */}
      <rect x="4" y="6" width="48" height="28" fill="#2E7D32" rx="3" />
      {/* Grid lines */}
      {[12,18,24,30].map((y, i) => <line key={i} x1="8" y1={y} x2="48" y2={y} stroke="white" strokeWidth="0.5" opacity="0.3" />)}
      {/* Rising chart line */}
      <polyline points="8,30 16,26 24,22 32,16 40,12 48,8" stroke="#69F0AE" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Area fill */}
      <polygon points="8,30 16,26 24,22 32,16 40,12 48,8 48,34 8,34" fill="#69F0AE" opacity="0.15" />
      {/* Arrow up */}
      <path d="M44 9l3-4 3 4" stroke="#69F0AE" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Dollar */}
      <text x="10" y="14" fontSize="8" fill="white" opacity="0.7" fontFamily="sans-serif">$</text>
    </svg>
  ),
  /** Winter Ads — snowy blue scene */
  winter: (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" style={{ borderRadius: 4, display: "block" }}>
      <rect width="56" height="40" fill="#90CAF9" rx="4" />
      {/* Sky */}
      <rect width="56" height="26" fill="#BBDEFB" />
      {/* Mountains */}
      <polygon points="0,26 14,8 28,26" fill="#E3F2FD" />
      <polygon points="18,26 32,6 46,26" fill="#ECEFF1" />
      <polygon points="30,26 44,10 58,26" fill="#E3F2FD" />
      {/* Snow caps */}
      <polygon points="14,8 10,16 18,16" fill="white" />
      <polygon points="32,6 28,14 36,14" fill="white" />
      {/* Snowflakes */}
      {[[10,10],[44,8],[22,16]].map(([cx,cy], i) => (
        <g key={i}>
          <line x1={cx-3} y1={cy} x2={cx+3} y2={cy} stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1={cx} y1={cy-3} x2={cx} y2={cy+3} stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1={cx-2} y1={cy-2} x2={cx+2} y2={cy+2} stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1={cx+2} y1={cy-2} x2={cx-2} y2={cy+2} stroke="white" strokeWidth="1" opacity="0.7" />
        </g>
      ))}
      {/* Snow ground */}
      <rect x="0" y="26" width="56" height="14" fill="white" rx="0 0 4 4" />
      <ellipse cx="28" cy="26" rx="28" ry="3" fill="white" />
    </svg>
  ),
  /** Autumn Ads (LinkedIn) — professional warm scene */
  autumn1: (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" style={{ borderRadius: 4, display: "block" }}>
      <rect width="56" height="40" fill="#E65100" rx="4" />
      {/* Sky */}
      <rect width="56" height="22" fill="#BF360C" />
      {/* Big leaf silhouettes */}
      <path d="M8 22 C8 14 16 10 20 16 C20 10 26 8 28 16 C30 8 36 10 36 16 C40 10 48 14 48 22Z" fill="#FF6D00" />
      {/* Leaf veins */}
      <path d="M28 22 L28 10 M28 16 L22 13 M28 16 L34 13" stroke="#E64A19" strokeWidth="0.7" opacity="0.6" />
      {/* Ground */}
      <rect x="0" y="30" width="56" height="10" fill="#4E342E" rx="0 0 4 4" />
      {/* Scattered small leaves */}
      <circle cx="12" cy="32" r="3" fill="#FF8F00" />
      <circle cx="42" cy="34" r="2.5" fill="#FF6D00" />
      <circle cx="28" cy="35" r="2" fill="#E65100" />
    </svg>
  ),
  /** Autumn Ads 2 (LinkedIn) — sale/promo theme */
  autumn2: (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" style={{ borderRadius: 4, display: "block" }}>
      <rect width="56" height="40" fill="#4A148C" rx="4" />
      {/* Sale tag background */}
      <rect x="6" y="6" width="44" height="28" fill="#6A1B9A" rx="4" />
      {/* SALE text suggestion */}
      <rect x="12" y="13" width="32" height="6" fill="#CE93D8" rx="2" />
      <rect x="16" y="23" width="24" height="4" fill="#AB47BC" rx="2" />
      {/* Star burst */}
      <circle cx="46" cy="8" r="6" fill="#FFD600" />
      <text x="43" y="11" fontSize="7" fill="#4A148C" fontFamily="sans-serif" fontWeight="bold">%</text>
      {/* Ribbon */}
      <path d="M6 6 L18 18 L6 18Z" fill="#9C27B0" opacity="0.5" />
    </svg>
  ),
} as const;

const IMG_SUMMER_1 = AdThumb.summer1;
const IMG_SUMMER_2 = AdThumb.summer2;
const IMG_LI_1     = AdThumb.autumn1;
const IMG_LI_2     = AdThumb.autumn2;
const IMG_FALL     = AdThumb.fall;
const IMG_FALL_INV = AdThumb.fallInvest;
const IMG_WINTER   = AdThumb.winter;

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdRow {
  checked: boolean;
  spend: string;
  campaign: string;
  adSet: string;
  adImage?: React.ReactNode;
  adName: string;
  leads: string;
  leadsGood?: boolean;
  cpl: string;
  cplGood?: boolean;
}

interface ChannelGroup {
  name: string;
  icon: React.ReactNode;
  lastDate: string;
  totalSpend: string;
  rows: AdRow[];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Checkbox({
  checked,
  indeterminate = false,
  onClick,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onClick?: () => void;
}) {
  const active = checked || indeterminate;
  return (
    <div
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onClick?.()}
      className="flex items-center justify-center shrink-0"
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        border: `1px solid ${active ? "#066AFE" : C.border2}`,
        background: active ? "#066AFE" : C.bgWhite,
        cursor: onClick ? "pointer" : "default",
        boxShadow: active
          ? "inset 0px 1px 0px rgba(0,0,0,.25), inset 0px 0.5px 2px rgba(0,0,0,.5), inset 2px 2px 5px rgba(0,0,0,.1)"
          : undefined,
      }}
    >
      {indeterminate && (
        <div style={{ width: 8, height: 2, background: "white", borderRadius: 1 }} />
      )}
      {!indeterminate && checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function Badge({ label, good }: { label: string; good?: boolean }) {
  const { bg, text } = good ? C.badgeGreen : C.badgeRed;
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 font-sans font-semibold"
      style={{
        minWidth: 32,
        height: 20,
        padding: "0 6px",
        borderRadius: 4,
        background: bg,
        color: text,
        fontSize: 12,
        lineHeight: "17px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// Channel icon SVGs
function MetaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <defs>
        <linearGradient id="meta-g1" x1="1" y1="8" x2="15" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0082FB" />
          <stop offset="100%" stopColor="#A334FA" />
        </linearGradient>
      </defs>
      {/* Meta infinity mark — symmetric about y=8 */}
      <path
        d="M8 6C7 4.7 5.7 4 4.3 4 2.4 4 1 5.6 1 8s1.4 4 3.3 4c1.4 0 2.7-.7 3.7-2C9 11.3 10.3 12 11.7 12 13.6 12 15 10.4 15 8s-1.4-4-3.3-4C10.3 4 9 4.7 8 6z"
        fill="url(#meta-g1)"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M14.5 8.16c0-.5-.04-1-.12-1.5H8v2.83h3.65a3.13 3.13 0 01-1.35 2.05v1.7h2.19c1.28-1.18 2.01-2.92 2.01-5.08z" fill="#4285F4"/>
      <path d="M8 15c1.83 0 3.36-.61 4.48-1.65l-2.19-1.7c-.6.41-1.38.65-2.29.65-1.76 0-3.25-1.19-3.78-2.78H1.97v1.75A7 7 0 008 15z" fill="#34A853"/>
      <path d="M4.22 9.52A4.23 4.23 0 014 8c0-.53.09-1.04.22-1.52V4.73H1.97A7 7 0 001 8c0 1.13.27 2.2.97 3.27l2.25-1.75z" fill="#FBBC05"/>
      <path d="M8 3.7c1 0 1.88.34 2.58 1.01l1.94-1.94A7 7 0 001.97 4.73L4.22 6.48C4.75 4.89 6.24 3.7 8 3.7z" fill="#EA4335"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect width="16" height="16" rx="3" fill="#0077B5"/>
      <path d="M3.5 6h1.8v5.5H3.5V6zm.9-2.8a1.05 1.05 0 110 2.1 1.05 1.05 0 010-2.1zM6.8 6H8.5v.75c.25-.44.87-.87 1.8-.87 1.92 0 2.2 1.27 2.2 2.9v3.22H10.7V9.14c0-.68-.01-1.56-.95-1.56-.96 0-1.1.75-1.1 1.51v2.41H6.8V6z" fill="white"/>
    </svg>
  );
}

// Column header
function Th({ label, sortable = false, width }: { label: string; sortable?: boolean; width?: number }) {
  return (
    <th
      className="shrink-0 text-left"
      style={{
        width,
        minWidth: width,
        height: 36,
        background: C.bgHeader,
        borderBottom: `1px solid ${C.border1}`,
        padding: "0 8px",
        fontWeight: 590,
        fontSize: 13,
        lineHeight: "18px",
        color: C.textMid,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
      }}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortable && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill={C.textMid} aria-hidden>
            <path d="M6 8.5L2 4h8l-4 4.5z"/>
          </svg>
        )}
      </div>
    </th>
  );
}

// Data cell
function Td({
  children,
  width,
  bold = false,
  height = 50,
  border = "1px",
}: {
  children?: React.ReactNode;
  width?: number;
  bold?: boolean;
  height?: number;
  border?: string;
}) {
  return (
    <td
      style={{
        width,
        minWidth: width,
        height,
        borderBottom: `${border} solid ${C.border1}`,
        padding: "0 8px",
        fontSize: 13,
        lineHeight: "18px",
        fontWeight: bold ? 700 : 400,
        color: C.textMid,
        verticalAlign: "middle",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </td>
  );
}

// Channel group header row
function ChannelRow({
  icon,
  name,
  lastDate,
  spend,
  colCount,
  checked,
  indeterminate,
  onToggle,
  collapsed,
  onCollapseToggle,
}: {
  icon: React.ReactNode;
  name: string;
  lastDate: string;
  spend: string;
  colCount: number;
  checked: boolean;
  indeterminate: boolean;
  onToggle: () => void;
  collapsed: boolean;
  onCollapseToggle: () => void;
}) {
  return (
    <tr>
      {/* Checkbox cell */}
      <td
        style={{
          width: 40,
          height: 52,
          borderBottom: `1px solid ${C.border1}`,
          padding: "0 12px",
          verticalAlign: "middle",
        }}
      >
        <Checkbox checked={checked} indeterminate={indeterminate} onClick={onToggle} />
      </td>
      {/* Channel cell with expand icon + logo + name + date */}
      <td
        colSpan={colCount}
        style={{
          height: 52,
          borderBottom: `1px solid ${C.border1}`,
          padding: "8px",
          verticalAlign: "middle",
        }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            {/* Collapse/expand chevron */}
            <button
              type="button"
              onClick={onCollapseToggle}
              className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
              style={{ width: 20, height: 20 }}
              aria-label={collapsed ? "Expand" : "Collapse"}
            >
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden
                style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}
              >
                <path d="M2 4l4 4 4-4" stroke={C.textMid} strokeWidth="1.2" strokeLinecap="round" fill="none" />
              </svg>
            </button>
            <div className="shrink-0">{icon}</div>
            <a href="#" className="font-semibold underline" style={{ fontSize: 13, color: C.textBlue, fontWeight: 590, textDecorationSkipInk: "none" }}>
              {name}
            </a>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.textMid, marginLeft: 16 }}>{spend}</span>
          </div>
          <div style={{ fontSize: 12, color: C.textMid, paddingLeft: 52 }}>
            Last Data Date: {lastDate}
          </div>
        </div>
      </td>
    </tr>
  );
}

// Ad data row
function AdRow({ row, checked, onToggle }: { row: AdRow; checked: boolean; onToggle: () => void }) {
  return (
    <tr style={{ background: C.bgWhite }}>
      <td style={{ width: 40, height: 50, borderBottom: `1px solid ${C.border1}`, padding: "0 12px", verticalAlign: "middle" }}>
        <Checkbox checked={checked} onClick={onToggle} />
      </td>
      {/* Channel (empty for sub-rows) */}
      <Td width={248} height={50} />
      {/* Spend */}
      <Td width={108} height={50}>{row.spend}</Td>
      {/* Campaign Name */}
      <Td width={155} height={50} bold>{row.campaign}</Td>
      {/* Ad Set Name */}
      <Td width={155} height={50}>{row.adSet}</Td>
      {/* Ad Image */}
      <td style={{ width: 80, height: 50, borderBottom: `1px solid ${C.border1}`, padding: "4px 8px", verticalAlign: "middle" }}>
        {row.adImage ? (
          <div
            className="transition-transform duration-200 ease-out hover:scale-110 cursor-pointer"
            style={{ width: 56, height: 40, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}
          >
            {row.adImage}
          </div>
        ) : null}
      </td>
      {/* Ad Name */}
      <td style={{ width: 180, height: 50, borderBottom: `1px solid ${C.border1}`, padding: "0 8px", verticalAlign: "middle", maxWidth: 180, overflow: "hidden" }}>
        <a href="#" style={{ fontSize: 13, color: C.textBlue, textDecoration: "underline", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
          {row.adName}
        </a>
      </td>
      {/* Leads */}
      <td style={{ width: 80, height: 50, borderBottom: `1px solid ${C.border1}`, padding: "0 8px", verticalAlign: "middle" }}>
        <Badge label={row.leads} good={row.leadsGood} />
      </td>
      {/* CPL */}
      <td style={{ width: 80, height: 50, borderBottom: `1px solid ${C.border1}`, padding: "0 8px", verticalAlign: "middle" }}>
        <Badge label={row.cpl} good={row.cplGood} />
      </td>
    </tr>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const CHANNELS: ChannelGroup[] = [
  {
    name: "Meta Ads",
    icon: <MetaIcon />,
    lastDate: "3/9/2024 18:04",
    totalSpend: "36,081",
    rows: [
      { checked: true, spend: "$15,568", campaign: "Summer Ads", adSet: "Spring 2025", adImage: IMG_SUMMER_1, adName: "Refinance today with...", leads: "10", leadsGood: false, cpl: "$3", cplGood: true },
      { checked: true, spend: "$12,510", campaign: "Summer Ads", adSet: "Promo X...",  adImage: IMG_SUMMER_2, adName: "Rates are dropping,...",  leads: "6",  leadsGood: false, cpl: "$3", cplGood: true },
    ],
  },
  {
    name: "Google Ads",
    icon: <GoogleIcon />,
    lastDate: "3/9/2024 18:04",
    totalSpend: "$3,788",
    rows: [
      { checked: true, spend: "$1,658", campaign: "Fall Ads",   adSet: "Investment Segm...", adImage: IMG_FALL_INV, adName: "Invest more today",        leads: "2",   leadsGood: false, cpl: "$0.2", cplGood: true },
      { checked: true, spend: "$1,920", campaign: "Fall Ads",   adSet: "Insurance Segme...", adImage: IMG_FALL,     adName: "Insurance your way",        leads: "800", leadsGood: true,  cpl: "$5",   cplGood: true },
      { checked: true, spend: "$210",   campaign: "Winter Ads", adSet: "Spring 2025",        adImage: IMG_WINTER,   adName: "Discover your investi...", leads: "4",   leadsGood: false, cpl: "$5",   cplGood: true },
    ],
  },
  {
    name: "Linkedin Ads",
    icon: <LinkedInIcon />,
    lastDate: "3/9/2024 18:04",
    totalSpend: "$2,700",
    rows: [
      { checked: true,  spend: "$200", campaign: "Autumn Ads", adSet: "Fall 2",        adImage: IMG_LI_1, adName: "The name of the Ad", leads: "8", leadsGood: false, cpl: "$7",   cplGood: false },
      { checked: false, spend: "$100", campaign: "Autumn Ads", adSet: "Sale for 2024", adImage: IMG_LI_2, adName: "The name of the Ad", leads: "4", leadsGood: false, cpl: "$2.5", cplGood: true  },
    ],
  },
];

const COL_COUNT = 8; // cols after checkbox

// ─── Modal ────────────────────────────────────────────────────────────────────
interface DetailsModalProps {
  onClose: () => void;
  onAdsPaused?: () => void;
}

// Build initial checked set: all rows that start as checked
function buildInitialChecked(): Set<string> {
  const s = new Set<string>();
  CHANNELS.forEach((ch) =>
    ch.rows.forEach((row, i) => { if (row.checked) s.add(`${ch.name}-${i}`); })
  );
  return s;
}

// Total row count across all channels
const TOTAL_ROWS = CHANNELS.reduce((n, ch) => n + ch.rows.length, 0);

export function DetailsModal({ onClose, onAdsPaused }: DetailsModalProps) {
  const [paused, setPaused] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCollapse = (name: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  // Auto-close 1.5s after the success toast appears
  useEffect(() => {
    if (!paused) return;
    const timer = setTimeout(() => {
      onAdsPaused?.();
      onClose();
    }, 1500);
    return () => clearTimeout(timer);
  }, [paused, onAdsPaused, onClose]);
  const [checked, setChecked] = useState<Set<string>>(buildInitialChecked);

  const toggleRow = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const toggleChannel = (chName: string, rowCount: number) => {
    const keys = Array.from({ length: rowCount }, (_, i) => `${chName}-${i}`);
    const allChecked = keys.every((k) => checked.has(k));
    setChecked((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (allChecked ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const toggleAll = () => {
    if (checked.size === TOTAL_ROWS) {
      setChecked(new Set());
    } else {
      const all = new Set<string>();
      CHANNELS.forEach((ch) => ch.rows.forEach((_, i) => all.add(`${ch.name}-${i}`)));
      setChecked(all);
    }
  };

  const allChecked = checked.size === TOTAL_ROWS;
  const someChecked = checked.size > 0 && !allChecked;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.40)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex flex-col items-end" style={{ width: 1098, maxHeight: "90vh" }}>
        {/* ── Close button (above modal) ──────────────────────────── */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center mb-2 hover:bg-white/20 transition-colors"
          style={{
            width: 24,
            height: 24,
            borderRadius: 9999,
            border: `1px solid ${C.border2}`,
            background: C.bgWhite,
          }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M13 1 1 13M1 1l12 12" stroke={C.textMid} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* ── Modal card ──────────────────────────────────────────── */}
        <div
          className="flex flex-col w-full overflow-hidden"
          style={{
            borderRadius: 20,
            background: C.bgWhite,
            boxShadow: C.modalShadow,
            height: "calc(90vh - 40px)",
          }}
        >
          {/* Header */}
          <div
            className="flex flex-col items-center justify-center shrink-0"
            style={{
              padding: 16,
              gap: 8,
              borderBottom: `1px solid ${C.border1}`,
              background: C.bgWhite,
              borderRadius: "20px 20px 0 0",
            }}
          >
            <p
              className="text-center w-full"
              style={{ fontSize: 20, lineHeight: "28px", fontWeight: 400, color: C.textDark }}
            >
              Low-Performing Ads
            </p>
            <p
              className="text-center w-full"
              style={{ fontSize: 13, lineHeight: "18px", color: C.textMid }}
            >
              Click Pause to stop selected ads. Some channels require manual pausing in Ads Manager.
              <br />
              Low-performing ads are determined by each channel's defined thresholds.
            </p>
          </div>

          {/* Body — scrollable table */}
          <div className="flex-1 overflow-auto relative" style={{ borderTop: `1px solid ${C.border1}` }}>
            {/* ── Success toast (shown after Pause) ─────────────── */}
            {paused && (
              <div
                className="sticky top-0 z-20 flex items-center justify-between"
                style={{
                  background: "#D1FAE5",
                  padding: "10px 16px",
                  gap: 8,
                  borderBottom: `1px solid #6EE7B7`,
                }}
              >
                <div className="flex items-center gap-2">
                  {/* Green checkmark circle */}
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 9999,
                      background: "#059669",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 590, color: "#065F46", lineHeight: "19px" }}>
                    Your ads were paused
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPaused(false)}
                  className="flex items-center justify-center hover:bg-green-200 rounded-full transition-colors"
                  style={{ width: 20, height: 20 }}
                  aria-label="Dismiss"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M10 2 2 10M2 2l8 8" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: 40 }} />
                <col style={{ width: 248 }} />
                <col style={{ width: 108 }} />
                <col style={{ width: 155 }} />
                <col style={{ width: 155 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 180 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 80 }} />
              </colgroup>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  {/* Header checkbox — select all */}
                  <th
                    style={{
                      width: 40,
                      height: 36,
                      background: C.bgHeader,
                      borderBottom: `1px solid ${C.border1}`,
                      padding: "0 12px",
                      verticalAlign: "middle",
                    }}
                  >
                    <Checkbox
                      checked={allChecked}
                      indeterminate={someChecked}
                      onClick={toggleAll}
                    />
                  </th>
                  <Th label="Channel" width={248} />
                  <Th label="Spend" sortable width={108} />
                  <Th label="Campaign Name" width={155} />
                  <Th label="Ad Set Name" width={155} />
                  <Th label="Ad Image" width={80} />
                  <Th label="Ad Name" width={180} />
                  <Th label="Leads" width={80} />
                  <Th label="CPL" width={80} />
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((ch) => {
                  const keys = ch.rows.map((_, i) => `${ch.name}-${i}`);
                  const chAllChecked = keys.every((k) => checked.has(k));
                  const chSomeChecked = keys.some((k) => checked.has(k)) && !chAllChecked;
                  const isCollapsed = collapsed.has(ch.name);
                  return (
                    <>
                      <ChannelRow
                        key={ch.name}
                        icon={ch.icon}
                        name={ch.name}
                        lastDate={ch.lastDate}
                        spend={ch.totalSpend}
                        colCount={COL_COUNT}
                        checked={chAllChecked}
                        indeterminate={chSomeChecked}
                        onToggle={() => toggleChannel(ch.name, ch.rows.length)}
                        collapsed={isCollapsed}
                        onCollapseToggle={() => toggleCollapse(ch.name)}
                      />
                      {!isCollapsed && ch.rows.map((row, i) => (
                        <AdRow
                          key={`${ch.name}-${i}`}
                          row={row}
                          checked={checked.has(`${ch.name}-${i}`)}
                          onToggle={() => toggleRow(`${ch.name}-${i}`)}
                        />
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end shrink-0"
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${C.border1}`,
              background: C.bgWhite,
              borderRadius: "0 0 20px 20px",
            }}
          >
            <button
              type="button"
              disabled={paused}
              onClick={() => setPaused(true)}
              className="flex items-center justify-center font-sans font-semibold transition-colors"
              style={{
                height: 36,
                padding: "0 24px",
                borderRadius: 9999,
                background: paused ? "#C9C9C9" : "#0250D9",
                color: paused ? "#5C5C5C" : "#FFFFFF",
                fontSize: 14,
                lineHeight: "19px",
                fontWeight: 590,
                border: "none",
                cursor: paused ? "not-allowed" : "pointer",
              }}
            >
              Pause
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
