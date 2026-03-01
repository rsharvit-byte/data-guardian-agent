import type { Config } from "tailwindcss";

/**
 * Design tokens matched to screenshot (pixel-perfect).
 * Screenshot: Slack-style UI with Marketing Intelligence Agent, metric cards, CTA.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Screenshot-exact colors
        "ui-sidebar": "#360C36",
        "ui-primary-text": "#2C2D2E",
        "ui-secondary-text": "#6E6F70",
        "ui-muted-text": "#B0B0B0",
        "ui-off-track-bg": "#E04040",
        "ui-trend-positive": "#28A745",
        "ui-chart-line": "#4285F4",
        "ui-chart-fill": "#E6F0FF",
        "ui-cta-bg": "#F8F8F8",
        "ui-cta-border": "#D0D0D0",
        "ui-input-bg": "#F5F5F5",
        "ui-card-shadow": "rgba(0,0,0,0.06)",
        // Legacy/alias
        "figma-primary-fg": "#2C2D2E",
        "figma-primary-bg": "#FFFFFF",
        "figma-core-content-primary": "#2C2D2E",
        "figma-core-content-secondary": "#6E6F70",
        "figma-core-content-tertiary": "#B0B0B0",
        "figma-gray-20": "#D0D0D0",
        "figma-aubergine-100": "#360C36",
        "figma-aubergine-90": "#4A154B",
        "figma-content-highlight-2": "#28A745",
        "figma-chart-blue": "#4285F4",
        "figma-chart-blue-light": "#E6F0FF",
        "figma-base-inverse-secondary": "#83388A",
        "figma-base-important": "#EABDFB",
        "figma-content-important": "#4A154B",
        "figma-base-inverse-highlight-2": "#20A271",
        "figma-core-content-inverse-secondary": "#F5F5F5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      fontSize: {
        "figma-micro": ["12px", { lineHeight: "18px" }],
        "figma-caption": ["13px", { lineHeight: "18px" }],
        "figma-body": ["15px", { lineHeight: "22px" }],
        "figma-subtitle": ["20px", { lineHeight: "28px" }],
      },
      fontWeight: {
        "figma-regular": "400",
        "figma-bold": "600",
        "figma-semibold": "600",
        "figma-black": "700",
      },
      boxShadow: {
        "figma-level-1": "0 1px 4px 0 rgba(0, 0, 0, 0.06)",
        "figma-level-2": "0 4px 12px 0 rgba(0, 0, 0, 0.1)",
        "figma-level-3": "0 18px 48px 0 rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        "figma-1": "4px",
        "figma-2": "6px",
        "figma-3": "12px",
        "ui-card": "6px",
        "ui-pill": "9999px",
        "ui-cta": "6px",
      },
      spacing: {
        "figma-0": "0",
        "figma-1": "4px",
        "figma-2": "8px",
        "figma-3": "12px",
        "figma-4": "16px",
        "figma-5": "20px",
        "figma-6": "24px",
        "figma-8": "32px",
        "figma-9": "40px",
      },
    },
  },
  plugins: [],
} satisfies Config;
