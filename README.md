# Budget Optimization Agent UI

Pixel-accurate implementation of the Figma design: [Budget-Optimization-Agent](https://www.figma.com/design/IxEdykuNMhQhigIR22Wsxl/Budget-Optimization-Agent?node-id=320-92217).

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** with design tokens from Figma
- **Vite** for build and dev server

## Project Structure

```
budget-optimization-agent/
├── index.html
├── package.json
├── tailwind.config.ts    # Figma design tokens (colors, typography, spacing, shadows, radius)
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── data/
    │   └── mockData.ts   # Static mock data for agent message, sidebar, chat header
    └── components/
        ├── index.ts
        ├── LayoutShell.tsx      # Slack-style 3-column layout
        ├── AgentMessageCard.tsx # Agent message with intro, metrics, summary
        ├── MetricCard.tsx       # Single metric + chart + status badge
        ├── ChartCard.tsx        # Mini line chart (placeholder data)
        ├── StatusBadge.tsx      # Off Track / On Track / At Risk
        ├── AISummarySection.tsx  # Summary text + prompt button
        └── ChatInputArea.tsx   # Input + formatting/emoji/mention controls
```

## Design Tokens (from Figma)

Defined in `tailwind.config.ts`:

- **Colors**: `figma-*` (primary, theme, core, palettes, semantic status/chart)
- **Typography**: Lato, `figma-micro` / `figma-caption` / `figma-body` / `figma-subtitle`, weights 400/700/900
- **Spacing**: `figma-0` … `figma-9`
- **Border radius**: `figma-1` (4px), `figma-2` (8px), `figma-3` (12px)
- **Shadows**: `figma-level-1` / `figma-level-2` / `figma-level-3`

All components use these tokens; no hardcoded values.

## Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview  # optional: preview production build
```

## Validation

- **Layout**: Three-column shell (app nav → workspace sidebar → main chat) matches Figma structure.
- **Spacing / typography**: Uses Figma token scale (spacing, font sizes, weights).
- **Cards**: MetricCards use `shadow-figma-level-1`, `rounded-figma-3`, and token padding.
- **Charts**: ChartCard uses fixed height (80px) and SVG with Figma chart colors (`#4992fe`, `#edf4ff`).
- **Badges**: StatusBadge uses semantic red for Off Track (`#ba0517`) and token typography.

If any value cannot be implemented exactly (e.g. asset or icon from Figma), a `// TODO` comment is left in code with the reason.
