import { useId } from "react";

interface ChartCardProps {
  chartLabel: string;
  chartData: number[][];
  yAxisLabels: [string, string];
  /** Fixed height to match Figma chart container */
  height?: number;
}

/**
 * Mini line chart with pixel-accurate labels.
 *
 * Y-axis labels are rendered as HTML (outside the SVG) so they are never
 * distorted by SVG scaling. The SVG itself uses preserveAspectRatio="none"
 * only for the chart geometry (area + line), which looks fine when stretched.
 */
export function ChartCard({
  chartLabel,
  chartData,
  yAxisLabels: [yMin, yMax],
  height = 80,
}: ChartCardProps) {
  const gradientId = useId();

  // Width of the Y-axis label column in pixels (matches left padding in SVG).
  const yAxisWidth = 32;

  const xs = chartData.map(([x]) => x);
  const ys = chartData.map(([, y]) => y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeY = maxY - minY || 1;

  // SVG viewBox is 0..100 wide, 0..height tall (unitless, aspect-free).
  const vbWidth = 100;
  const vbHeight = height;
  const padding = { top: 4, right: 4, bottom: 0, left: 0 };
  const chartW = vbWidth - padding.left - padding.right;
  const chartH = vbHeight - padding.top - padding.bottom;

  const toPoint = (_: unknown, i: number) => {
    const x = padding.left + xs[i] * chartW;
    const y = padding.top + chartH - ((ys[i] - minY) / rangeY) * chartH;
    return { x, y };
  };

  const pts = chartData.map(toPoint);
  const linePoints = pts.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = [
    `${pts[0].x},${vbHeight}`,
    ...pts.map(({ x, y }) => `${x},${y}`),
    `${pts[pts.length - 1].x},${vbHeight}`,
  ].join(" ");

  return (
    <div className="mt-3 w-full">
      {/* Chart row: y-axis labels + svg */}
      <div className="flex" style={{ height }}>
        {/* Y-axis labels — plain HTML, never stretched */}
        <div
          className="relative shrink-0 select-none"
          style={{ width: yAxisWidth }}
        >
          <span
            className="absolute right-2 top-0 font-sans text-[10px] leading-none text-[#B0B0B0]"
          >
            {yMax}
          </span>
          <span
            className="absolute right-2 bottom-0 font-sans text-[10px] leading-none text-[#B0B0B0]"
          >
            {yMin}
          </span>
        </div>

        {/* Chart geometry only — stretching is fine for area + line */}
        <svg
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          className="flex-1"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#E6F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4285F4" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill={`url(#${gradientId})`} />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#4285F4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Chart label below */}
      <p className="mt-1 font-sans text-[12px] font-semibold leading-[18px] text-ui-chart-line">
        {chartLabel}
      </p>
    </div>
  );
}
