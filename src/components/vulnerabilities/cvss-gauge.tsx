"use client";

import { cn } from "@/lib/utils";

interface CvssGaugeProps {
  label: string;
  rating: "critical" | "high" | "medium" | "low" | "unknown";
  score?: number;
  className?: string;
}

const RATING_CONFIG = {
  critical: { color: "bg-danger", label: "Critical", widthPct: 100 },
  high:     { color: "bg-orange", label: "High",     widthPct: 75 },
  medium:   { color: "bg-warning",label: "Medium",   widthPct: 50 },
  low:      { color: "bg-success",label: "Low",      widthPct: 25 },
  unknown:  { color: "bg-muted",  label: "Unknown",  widthPct: 10 },
};

const SEGMENTS = [
  { label: "Low",      color: "bg-success/80",  flex: 1 },
  { label: "Medium",   color: "bg-warning/80",  flex: 1 },
  { label: "High",     color: "bg-orange/80",   flex: 1 },
  { label: "Critical", color: "bg-danger/80",   flex: 1 },
];

export function CvssGauge({ label, rating, score, className }: CvssGaugeProps) {
  const config = RATING_CONFIG[rating];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-fg">
          <span className="text-danger">*</span>
          {label}
        </span>
        {score !== undefined && (
          <span className="font-mono text-[11px] text-muted">{score.toFixed(1)}</span>
        )}
      </div>

      {/* Segmented bar */}
      <div className="flex h-2 gap-0.5 rounded-full overflow-hidden">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.label}
            className={cn(
              "flex-1 transition-all",
              seg.label.toLowerCase() === rating
                ? seg.color
                : "bg-fg/10",
            )}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[9px] text-dimmed">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Critical</span>
      </div>

      {/* Current rating badge */}
      <div className="flex items-center gap-1.5 text-[11px]">
        <span className={cn("h-2 w-2 rounded-full", config.color)} />
        <span className="font-medium text-secondary">{config.label}</span>
      </div>
    </div>
  );
}
