interface ChatInputAreaProps {
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInputArea({
  placeholder = "Ask Slackbot AI a question",
  disabled = false,
}: ChatInputAreaProps) {
  return (
    <div className="flex items-center gap-figma-2 rounded-figma-3 border border-[#E0E0E0] bg-ui-input-bg px-figma-4 py-figma-3">
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ui-muted-text/20 text-ui-primary-text"
        aria-label="Add attachment"
      >
        <span className="text-sm font-bold">+</span>
      </button>
      <button
        type="button"
        className="text-ui-muted-text hover:text-ui-secondary-text"
        aria-label="Format"
      >
        <span className="font-sans text-[13px]">Aa</span>
      </button>
      <button
        type="button"
        className="text-ui-muted-text hover:text-ui-secondary-text"
        aria-label="Emoji"
      >
        <span className="text-sm">😊</span>
      </button>
      <button
        type="button"
        className="font-sans text-[13px] font-semibold text-ui-muted-text hover:text-ui-secondary-text"
        aria-label="Mention"
      >
        @
      </button>
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[15px] leading-[22px] text-ui-primary-text placeholder:text-ui-muted-text focus:outline-none focus:ring-0"
        aria-label="Message"
      />
    </div>
  );
}
