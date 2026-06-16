"use client";

import { cn } from "@/lib/utils";

type Status = "active" | "enabled" | "disabled" | "testing" | "running" | "completed" | "failed" | "queued" | "pending" | "new" | "resolved" | "closed" | "open" | "in_remediation" | "suppressed";

const STATUS_CONFIG: Record<Status, { label: string; classes: string; dot: string }> = {
  active:         { label: "Active",        classes: "bg-success/10 text-success border border-success/20", dot: "bg-success animate-pulse" },
  enabled:        { label: "Enabled",       classes: "bg-success/10 text-success border border-success/20", dot: "bg-success" },
  running:        { label: "Running",       classes: "bg-info/10 text-info border border-info/20",           dot: "bg-info animate-pulse" },
  completed:      { label: "Completed",     classes: "bg-success/10 text-success border border-success/20", dot: "bg-success" },
  pending:        { label: "Pending",       classes: "bg-warning/10 text-warning border border-warning/20", dot: "bg-warning" },
  testing:        { label: "Testing",       classes: "bg-warning/10 text-warning border border-warning/20", dot: "bg-warning" },
  queued:         { label: "Queued",        classes: "bg-fg/5 text-muted border border-border",             dot: "bg-dimmed" },
  new:            { label: "New",           classes: "bg-accent/10 text-accent border border-accent/20",    dot: "bg-accent" },
  failed:         { label: "Failed",        classes: "bg-danger/10 text-danger border border-danger/20",    dot: "bg-danger" },
  disabled:       { label: "Disabled",      classes: "bg-fg/3 text-dimmed border border-border",            dot: "bg-dimmed" },
  resolved:       { label: "Resolved",      classes: "bg-success/10 text-success border border-success/20", dot: "bg-success" },
  closed:         { label: "Closed",        classes: "bg-fg/5 text-muted border border-border",             dot: "bg-dimmed" },
  open:           { label: "Open",          classes: "bg-danger/10 text-danger border border-danger/20",    dot: "bg-danger" },
  in_remediation: { label: "In Remediation",classes: "bg-info/10 text-info border border-info/20",          dot: "bg-info" },
  suppressed:     { label: "Suppressed",    classes: "bg-fg/5 text-muted border border-border",             dot: "bg-dimmed" },
};

interface StatusBadgeProps {
  status: Status;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium",
        config.classes,
        className,
      )}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />}
      {config.label}
    </span>
  );
}
