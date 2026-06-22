"use client";

import { useState } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";

type TimeRange = "1d" | "7d" | "30d" | "90d";

const RANGE_DATA: Record<TimeRange, { bars: { primary: number; secondary: number; danger?: boolean }[]; labels: string[] }> = {
  "1d": {
    bars: [
      { primary: 85, secondary: 35 },
      { primary: 60, secondary: 20 },
      { primary: 95, secondary: 45, danger: true },
      { primary: 55, secondary: 25 },
      { primary: 90, secondary: 40 },
      { primary: 70, secondary: 30 },
      { primary: 80, secondary: 35 },
      { primary: 65, secondary: 25 },
      { primary: 50, secondary: 15 },
      { primary: 40, secondary: 10 },
    ],
    labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "Now"],
  },
  "7d": {
    bars: [
      { primary: 70, secondary: 30 },
      { primary: 82, secondary: 38 },
      { primary: 65, secondary: 28 },
      { primary: 90, secondary: 42, danger: true },
      { primary: 75, secondary: 32 },
      { primary: 55, secondary: 22 },
      { primary: 48, secondary: 18 },
    ],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  "30d": {
    bars: [
      { primary: 60, secondary: 25 },
      { primary: 72, secondary: 30 },
      { primary: 88, secondary: 40, danger: true },
      { primary: 65, secondary: 28 },
      { primary: 55, secondary: 22 },
      { primary: 78, secondary: 35 },
      { primary: 70, secondary: 30 },
      { primary: 82, secondary: 38 },
      { primary: 50, secondary: 20 },
      { primary: 45, secondary: 18 },
      { primary: 68, secondary: 28 },
      { primary: 75, secondary: 32 },
    ],
    labels: ["W1", "W2", "W3", "W4"],
  },
  "90d": {
    bars: [
      { primary: 75, secondary: 32 },
      { primary: 68, secondary: 28 },
      { primary: 82, secondary: 38, danger: true },
      { primary: 60, secondary: 25 },
      { primary: 55, secondary: 22 },
      { primary: 70, secondary: 30 },
      { primary: 78, secondary: 35 },
      { primary: 65, secondary: 28 },
      { primary: 50, secondary: 20 },
      { primary: 72, secondary: 30 },
      { primary: 85, secondary: 40 },
      { primary: 58, secondary: 24 },
    ],
    labels: ["Jan", "Feb", "Mar"],
  },
};

const RANGE_OPTIONS: { key: TimeRange; label: string }[] = [
  { key: "1d", label: "1D" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
];

export default function ThreatVolumeTimeline({ isLoading, containerWidth }: WidgetProps) {
  const [range, setRange] = useState<TimeRange>("1d");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const { bars, labels } = RANGE_DATA[range];
  const isCompact = containerWidth < 350;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-end gap-1">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setRange(opt.key)}
            className={`rounded px-2 py-0.5 text-[10px] font-medium transition-all ${
              range === opt.key
                ? "bg-accent/20 text-accent"
                : "text-dimmed hover:text-muted hover:bg-fg/5"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="relative mb-2 min-h-0 flex flex-1 items-end justify-around border-b border-border">
        {[25, 50, 75].map((pct) => (
          <div
            key={pct}
            className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-fg/8"
            style={{ top: `${pct}%` }}
          />
        ))}
        {bars.map((bar, i) => (
          <div
            key={`${range}-${i}`}
            className="group z-[1] flex h-full flex-1 items-end justify-center gap-[2px] px-[1px]"
            onMouseEnter={() => setHoveredBar(i)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <div
              className="min-w-[3px] max-w-3 flex-1 rounded-t transition-all duration-200"
              style={{
                height: `${bar.primary}%`,
                background: bar.danger
                  ? "linear-gradient(to top, rgba(239,68,68,0.2), rgba(239,68,68,0.8))"
                  : "linear-gradient(to top, rgba(168,85,247,0.2), rgba(168,85,247,0.8))",
                border: bar.danger
                  ? "1px solid rgba(239,68,68,0.5)"
                  : "1px solid rgba(168,85,247,0.5)",
                borderBottom: "none",
                boxShadow: hoveredBar === i
                  ? bar.danger
                    ? "0 -4px 16px rgba(239,68,68,0.4)"
                    : "0 -4px 16px rgba(168,85,247,0.4)"
                  : bar.danger
                    ? "0 -4px 12px rgba(239,68,68,0.2)"
                    : "0 -4px 12px rgba(168,85,247,0.2)",
                transform: hoveredBar === i ? "scaleY(1.03)" : "scaleY(1)",
                transformOrigin: "bottom",
              }}
            />
            <div
              className="min-w-[3px] max-w-3 flex-1 rounded-t transition-all duration-200"
              style={{
                height: `${bar.secondary}%`,
                background: "linear-gradient(to top, rgba(255,255,255,0.05), rgba(255,255,255,0.3))",
                border: "1px solid rgba(255,255,255,0.2)",
                borderBottom: "none",
                transform: hoveredBar === i ? "scaleY(1.03)" : "scaleY(1)",
                transformOrigin: "bottom",
              }}
            />
            {hoveredBar === i && (
              <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-bg/95 px-2 py-0.5 text-[9px] font-mono text-fg shadow-lg border border-border/50">
                {bar.primary}% / {bar.secondary}%
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted">
        {labels.map((l) => (
          <span key={l} className={isCompact ? "text-[8px]" : ""}>{l}</span>
        ))}
      </div>
    </div>
  );
}
