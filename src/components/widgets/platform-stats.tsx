"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { WidgetProps } from "@/lib/dashboard/types";

const STATS = [
  { label: "Emails Scanned", value: "1.2M", trend: "up" as const, delta: "+12.4%" },
  { label: "Threats Blocked", value: "4,291", trend: "down" as const, delta: "-8.2%" },
  { label: "Avg Response", value: "< 2s", trend: "down" as const, delta: "-0.3s" },
  { label: "Uptime", value: "99.97%", trend: "up" as const, delta: "+0.02%" },
];

export default function PlatformStats({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid grid-cols-2 gap-4">
        {STATS.map((stat) => {
          const isPositive = stat.trend === "up" ? stat.label !== "Threats Blocked" : stat.label === "Threats Blocked";
          return (
            <div key={stat.label} className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{stat.label}</div>
              <div className="font-display text-xl font-bold text-fg">{stat.value}</div>
              <div className={`flex items-center gap-1 text-[10px] font-medium ${isPositive ? "text-success" : "text-danger"}`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.delta}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
