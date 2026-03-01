import type { ReactNode } from "react";

export type StatusVariant = "off_track" | "on_track" | "at_risk";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<
  StatusVariant,
  { bg: string; text: string }
> = {
  off_track: {
    bg: "bg-ui-off-track-bg",
    text: "text-white",
  },
  on_track: {
    bg: "bg-figma-base-inverse-highlight-2",
    text: "text-white",
  },
  at_risk: {
    bg: "bg-amber-500",
    text: "text-white",
  },
};

export function StatusBadge({ variant, children, className = "" }: StatusBadgeProps) {
  const styles = variantStyles[variant];
  return (
    <span
      className={`inline-flex items-center rounded-ui-pill px-2.5 py-0.5 font-sans text-[12px] font-semibold leading-[18px] ${styles.bg} ${styles.text} ${className}`}
      role="status"
    >
      {children}
    </span>
  );
}
