"use client";

import { cn } from "@/lib/utils";

type Severity = "critical" | "high" | "medium" | "low" | "info";

const SEV_CONFIG: Record<Severity, { label: string; classes: string; dot: string }> = {
  critical: {
    label: "Critical",
    classes: "bg-danger/10 text-danger border border-danger/25",
    dot: "bg-danger",
  },
  high: {
    label: "High",
    classes: "bg-orange/10 text-orange border border-orange/25",
    dot: "bg-orange",
  },
  medium: {
    label: "Medium",
    classes: "bg-warning/10 text-warning border border-warning/25",
    dot: "bg-warning",
  },
  low: {
    label: "Low",
    classes: "bg-success/10 text-success border border-success/25",
    dot: "bg-success",
  },
  info: {
    label: "Info",
    classes: "bg-info/10 text-info border border-info/25",
    dot: "bg-info",
  },
};

interface SeverityPillProps {
  severity: Severity;
  showDot?: boolean;
  size?: "xs" | "sm";
  className?: string;
}

export function SeverityPill({
  severity,
  showDot = true,
  size = "sm",
  className,
}: SeverityPillProps) {
  const config = SEV_CONFIG[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded font-medium capitalize",
        size === "xs" ? "px-1.5 py-px text-[10px]" : "px-2 py-0.5 text-[11px]",
        config.classes,
        className,
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      )}
      {config.label}
    </span>
  );
}
