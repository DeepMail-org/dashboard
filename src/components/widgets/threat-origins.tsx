"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { Globe } from "lucide-react";

const DEMO_ORIGINS = [
  { country: "Russia", city: "Moscow", count: 847, severity: "critical" as const, flag: "\u{1F1F7}\u{1F1FA}" },
  { country: "China", city: "Beijing", count: 623, severity: "high" as const, flag: "\u{1F1E8}\u{1F1F3}" },
  { country: "Nigeria", city: "Lagos", count: 412, severity: "high" as const, flag: "\u{1F1F3}\u{1F1EC}" },
  { country: "Brazil", city: "São Paulo", count: 298, severity: "medium" as const, flag: "\u{1F1E7}\u{1F1F7}" },
  { country: "Iran", city: "Tehran", count: 234, severity: "high" as const, flag: "\u{1F1EE}\u{1F1F7}" },
  { country: "India", city: "Mumbai", count: 189, severity: "medium" as const, flag: "\u{1F1EE}\u{1F1F3}" },
  { country: "Romania", city: "Bucharest", count: 156, severity: "medium" as const, flag: "\u{1F1F7}\u{1F1F4}" },
  { country: "Vietnam", city: "Hanoi", count: 134, severity: "low" as const, flag: "\u{1F1FB}\u{1F1F3}" },
];

const SEV_BAR = { critical: "bg-danger", high: "bg-orange", medium: "bg-warning", low: "bg-accent" };

export default function ThreatOrigins({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const maxCount = DEMO_ORIGINS[0]?.count ?? 1;
  const total = DEMO_ORIGINS.reduce((s, o) => s + o.count, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs text-muted">Threat Origins (30d)</span>
        </div>
        <span className="font-mono text-xs text-accent">{total.toLocaleString()} total</span>
      </div>
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {DEMO_ORIGINS.map((origin) => (
          <div key={origin.country} className="flex items-center gap-2.5">
            <span className="shrink-0 text-sm">{origin.flag}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">{origin.country}</span>
                <span className="font-mono text-muted">{origin.count}</span>
              </div>
              <div className="mt-0.5 h-1 w-full rounded-full bg-border/50">
                <div
                  className={`h-full rounded-full ${SEV_BAR[origin.severity]} transition-all`}
                  style={{ width: `${(origin.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
