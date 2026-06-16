/**
 * AG Grid theme — uses CSS var() so it adapts to dark/light mode automatically.
 */
export const AG_GRID_DEEPMAIL_THEME = {
  "--ag-background-color": "var(--color-bg, oklch(15% 0.005 280))",
  "--ag-header-background-color": "var(--color-surface, oklch(19% 0.005 280))",
  "--ag-row-hover-color": "var(--color-surface-hover, oklch(23% 0.01 280))",
  "--ag-selected-row-background-color": "var(--color-accent-soft, oklch(60% 0.15 280 / 0.08))",
  "--ag-border-color": "var(--color-border, oklch(26% 0.01 280))",
  "--ag-foreground-color": "var(--color-fg, oklch(98% 0 0))",
  "--ag-secondary-foreground-color": "var(--color-muted, oklch(65% 0.01 280))",
  "--ag-header-foreground-color": "var(--color-secondary, oklch(80% 0.005 280))",
  "--ag-cell-horizontal-padding": "12px",
  "--ag-row-border-color": "var(--color-border, oklch(26% 0.01 280 / 0.5))",
  "--ag-font-family": "'Inter', system-ui, sans-serif",
  "--ag-font-size": "12px",
  "--ag-header-height": "36px",
  "--ag-row-height": "32px",
  "--ag-border-radius": "0px",
  "--ag-odd-row-background-color": "var(--color-surface-2, oklch(16.5% 0.005 280))",
  "--ag-input-focus-border-color": "var(--color-accent, oklch(60% 0.15 280))",
  "--ag-checkbox-checked-color": "var(--color-accent, oklch(60% 0.15 280))",
  "--ag-range-selection-border-color": "var(--color-accent, oklch(60% 0.15 280))",
} as const;
