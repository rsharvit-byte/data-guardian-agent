import type { AgentMessageData } from "@/data/mockData";
import { MetricCard } from "./MetricCard";
import { AISummarySection } from "./AISummarySection";

interface AgentMessageCardProps {
  data: AgentMessageData;
  onPromptClick?: () => void;
}

export function AgentMessageCard({ data, onPromptClick }: AgentMessageCardProps) {
  return (
    <div className="flex gap-figma-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-figma-base-important text-figma-content-important">
        <span className="text-lg" aria-hidden>🤖</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-figma-2">
          <span className="font-sans text-[15px] font-semibold leading-[22px] text-ui-primary-text">
            {data.agentName}
          </span>
          <span className="rounded-figma-1 bg-ui-muted-text/25 px-figma-2 py-0.5 font-sans text-[12px] font-semibold uppercase tracking-wide text-ui-primary-text">
            {data.badgeLabel}
          </span>
          <span className="font-sans text-[13px] leading-[18px] text-ui-secondary-text">
            {data.timestamp}
          </span>
        </div>
        <div className="mt-figma-2 space-y-figma-2">
          {data.introLines.map((line, i) => (
            <p
              key={i}
              className="font-sans text-[15px] leading-[22px] text-ui-primary-text"
            >
              {line.includes("Lead Generation") ? (
                <>
                  {line.split("'Lead Generation'")[0]}
                  <strong className="font-semibold">'Lead Generation'</strong>
                  {line.split("'Lead Generation'")[1]}
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
        <div className="mt-figma-4 flex gap-figma-4">
          {data.metricCards.map((card) => (
            <MetricCard key={card.id} data={card} />
          ))}
        </div>
        <AISummarySection
          summaryText={data.summaryText}
          promptButtonLabel={data.promptButtonLabel}
          onPromptClick={onPromptClick}
        />
      </div>
    </div>
  );
}
