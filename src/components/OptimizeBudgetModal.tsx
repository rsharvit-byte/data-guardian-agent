// ─── Optimize Budget Modal ────────────────────────────────────────────────────
// Shown when "Review" is clicked on the CPL Attribution suggestion card.

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
  modalShadow: "0px -1px 1.7px 0px rgba(0,0,0,0.03), 0px 5.7px 5.9px 0px rgba(0,0,0,0.07), 0px 0px 5.9px 0px rgba(0,0,0,0.07)",
};

interface Row {
  channel: string;
  adSet: string;
  currentBudget: string;
  currentCPL: string;
  suggestedBudget: string;
  cplChange: string;
  cplGood: boolean;
}

const ROWS: Row[] = [
  { channel: "Meta Ads",     adSet: "Summer Ads – Promo X",         currentBudget: "$18,000", currentCPL: "$8.2",  suggestedBudget: "$9,000",  cplChange: "-45%", cplGood: true  },
  { channel: "Meta Ads",     adSet: "Summer Ads – Brand Awareness",  currentBudget: "$14,000", currentCPL: "$5.1",  suggestedBudget: "$18,000", cplChange: "+29%", cplGood: false },
  { channel: "Google Ads",   adSet: "Investment Segment",            currentBudget: "$9,000",  currentCPL: "$11.4", suggestedBudget: "$4,000",  cplChange: "-56%", cplGood: true  },
  { channel: "Google Ads",   adSet: "Insurance Segment",             currentBudget: "$7,500",  currentCPL: "$3.8",  suggestedBudget: "$12,000", cplChange: "+60%", cplGood: false },
  { channel: "LinkedIn Ads", adSet: "Fall 2 – Retargeting",          currentBudget: "$5,000",  currentCPL: "$9.7",  suggestedBudget: "$2,000",  cplChange: "-60%", cplGood: true  },
  { channel: "LinkedIn Ads", adSet: "Sale for 2024",                  currentBudget: "$3,500",  currentCPL: "$4.2",  suggestedBudget: "$5,000",  cplChange: "+43%", cplGood: false },
];

function Badge({ label, good }: { label: string; good: boolean }) {
  const { bg, text } = good ? C.badgeGreen : C.badgeRed;
  return (
    <span
      className="inline-flex items-center justify-center font-sans font-semibold"
      style={{
        minWidth: 48,
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

function Th({ label, width }: { label: string; width?: number }) {
  return (
    <th
      style={{
        width,
        minWidth: width,
        height: 36,
        background: C.bgHeader,
        borderBottom: `1px solid ${C.border1}`,
        padding: "0 12px",
        fontWeight: 590,
        fontSize: 13,
        lineHeight: "18px",
        color: C.textMid,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        textAlign: "left",
      }}
    >
      {label}
    </th>
  );
}

interface OptimizeBudgetModalProps {
  onClose: () => void;
}

export function OptimizeBudgetModal({ onClose }: OptimizeBudgetModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.40)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex flex-col items-end" style={{ width: 900, maxHeight: "90vh" }}>
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center mb-2 hover:bg-white/20 transition-colors"
          style={{
            width: 24, height: 24, borderRadius: 9999,
            border: `1px solid ${C.border2}`,
            background: C.bgWhite,
          }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M13 1 1 13M1 1l12 12" stroke={C.textMid} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Modal card */}
        <div
          className="flex flex-col w-full overflow-hidden"
          style={{
            borderRadius: 20,
            background: C.bgWhite,
            boxShadow: C.modalShadow,
            maxHeight: "calc(90vh - 40px)",
          }}
        >
          {/* Header */}
          <div
            className="flex flex-col items-center justify-center shrink-0"
            style={{ padding: 16, gap: 8, borderBottom: `1px solid ${C.border1}`, borderRadius: "20px 20px 0 0" }}
          >
            <p className="text-center w-full" style={{ fontSize: 20, lineHeight: "28px", fontWeight: 400, color: C.textDark }}>
              Optimize Budget
            </p>
            <p className="text-center w-full" style={{ fontSize: 13, lineHeight: "18px", color: C.textMid }}>
              Review suggested budget reallocation based on CPL performance across ad sets.
              <br />
              Click Apply to update budgets in your connected ad channels.
            </p>
          </div>

          {/* Scrollable table */}
          <div className="flex-1 overflow-auto" style={{ borderTop: `1px solid ${C.border1}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 160 }} />
                <col style={{ width: 240 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 140 }} />
                <col style={{ width: 110 }} />
              </colgroup>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  <Th label="Channel" width={160} />
                  <Th label="Ad Set" width={240} />
                  <Th label="Current Budget" width={130} />
                  <Th label="Current CPL" width={110} />
                  <Th label="Suggested Budget" width={140} />
                  <Th label="CPL Change" width={110} />
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={i} style={{ background: C.bgWhite }}>
                    <td style={{ height: 48, borderBottom: `1px solid ${C.border1}`, padding: "0 12px", fontSize: 13, color: C.textMid, verticalAlign: "middle" }}>
                      {row.channel}
                    </td>
                    <td style={{ height: 48, borderBottom: `1px solid ${C.border1}`, padding: "0 12px", fontSize: 13, color: C.textMid, verticalAlign: "middle" }}>
                      {row.adSet}
                    </td>
                    <td style={{ height: 48, borderBottom: `1px solid ${C.border1}`, padding: "0 12px", fontSize: 13, fontWeight: 700, color: C.textMid, verticalAlign: "middle" }}>
                      {row.currentBudget}
                    </td>
                    <td style={{ height: 48, borderBottom: `1px solid ${C.border1}`, padding: "0 12px", verticalAlign: "middle" }}>
                      <Badge label={row.currentCPL} good={false} />
                    </td>
                    <td style={{ height: 48, borderBottom: `1px solid ${C.border1}`, padding: "0 12px", fontSize: 13, fontWeight: 700, color: C.textBlue, verticalAlign: "middle" }}>
                      {row.suggestedBudget}
                    </td>
                    <td style={{ height: 48, borderBottom: `1px solid ${C.border1}`, padding: "0 12px", verticalAlign: "middle" }}>
                      <Badge label={row.cplChange} good={row.cplGood} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{ padding: "12px 16px", borderTop: `1px solid ${C.border1}`, borderRadius: "0 0 20px 20px" }}
          >
            <p style={{ fontSize: 13, lineHeight: "18px", color: C.textMid }}>
              Total estimated CPL improvement: <strong style={{ color: C.textDark }}>~32%</strong>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center font-sans font-semibold hover:opacity-90 active:opacity-80 transition-colors"
              style={{
                height: 36, padding: "0 24px", borderRadius: 9999,
                background: C.textBlue, color: "#FFFFFF",
                fontSize: 14, lineHeight: "19px", fontWeight: 590, border: "none",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
