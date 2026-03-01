interface AISummarySectionProps {
  summaryText: string;
  promptButtonLabel: string;
  onPromptClick?: () => void;
}

/**
 * CTA button: screenshot-exact — height 40px, padding 12px 20px, radius 6px,
 * border #D0D0D0, background #F8F8F8, dark grey text.
 */
export function AISummarySection({
  summaryText,
  promptButtonLabel,
  onPromptClick,
}: AISummarySectionProps) {
  return (
    <div className="mt-figma-4">
      <p className="font-sans text-[15px] leading-[22px] font-normal text-ui-primary-text">
        {summaryText}
      </p>
      <button
        type="button"
        onClick={onPromptClick}
        className="
          mt-figma-3 flex h-10 items-center rounded-ui-cta border border-ui-cta-border bg-ui-cta-bg
          px-5 py-3 font-sans text-[13px] font-semibold leading-[18px] text-ui-primary-text
          transition-colors hover:bg-[#EEEEEE] active:bg-[#E8E8E8] active:shadow-inner
        "
      >
        {promptButtonLabel}
      </button>
    </div>
  );
}
