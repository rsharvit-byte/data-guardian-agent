import type { MetricCardData } from "@/data/mockData";
import { StatusBadge } from "./StatusBadge";
import { ChartCard } from "./ChartCard";

interface MetricCardProps {
  data: MetricCardData;
  className?: string;
}

export function MetricCard({ data, className = "" }: MetricCardProps) {
  return (
    <article
      className={`flex flex-1 min-w-0 flex-col rounded-ui-card bg-white p-figma-4 shadow-figma-level-1 ${className}`}
    >
      <div className="flex items-start justify-between gap-figma-2">
        <div>
          <h3 className="font-sans text-[15px] font-normal leading-[22px] text-ui-primary-text">
            {data.title}
          </h3>
          <p className="mt-0.5 font-sans text-[13px] leading-[18px] text-ui-secondary-text">
            {data.subtitle}
          </p>
        </div>
      </div>
      <div className="mt-figma-3 flex flex-wrap items-baseline gap-figma-2">
        <span className="font-sans text-[22px] font-bold leading-tight text-ui-primary-text">
          {data.value}
        </span>
        <StatusBadge variant={data.status}>
          {data.status === "off_track" ? "Off Track" : data.status === "at_risk" ? "At Risk" : "On Track"}
        </StatusBadge>
      </div>
      <p className="mt-figma-2 font-sans text-[12px] leading-[18px] text-ui-trend-positive">
        {data.trend}
      </p>
      <ChartCard
        chartLabel={data.chartLabel}
        chartData={data.chartData}
        yAxisLabels={data.yAxisLabels}
        height={80}
      />
    </article>
  );
}
