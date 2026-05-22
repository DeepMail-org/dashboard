"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { CreditCard } from "lucide-react";

const DEMO_USAGE = [
  { label: "Emails Scanned", used: 42_847, limit: 50_000, unit: "emails" },
  { label: "Sandbox Analyses", used: 1_234, limit: 2_000, unit: "analyses" },
  { label: "API Calls", used: 89_200, limit: 100_000, unit: "calls" },
  { label: "Storage", used: 3.2, limit: 5, unit: "GB" },
];

function UsageMeter({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = (used / limit) * 100;
  const isWarning = pct >= 80;
  const isCritical = pct >= 95;

  return (
    <div className="rounded-lg border border-border/50 bg-surface/50 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-secondary">{label}</span>
        <span className={`font-mono ${isCritical ? "text-danger" : isWarning ? "text-warning" : "text-muted"}`}>
          {typeof used === "number" && used > 100
            ? used.toLocaleString()
            : used}{" "}
          / {typeof limit === "number" && limit > 100 ? limit.toLocaleString() : limit} {unit}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-border/50">
        <div
          className={`h-full rounded-full transition-all ${
            isCritical ? "bg-danger" : isWarning ? "bg-warning" : "bg-accent"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function BillingUsage({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-3.5 w-3.5 text-muted" />
          <span className="font-display text-sm font-semibold text-fg">Enterprise Plan</span>
        </div>
        <span className="text-xs text-muted">Resets in 14 days</span>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {DEMO_USAGE.map((u) => (
          <UsageMeter key={u.label} {...u} />
        ))}
      </div>
    </div>
  );
}
