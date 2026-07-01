"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import type { DashboardOverview } from "@/lib/api/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { Gauge } from "@/components/charts/gauge";

export default function ThreatScoreGauge({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full w-full min-w-0 min-h-0 items-center justify-center">
      <Gauge
        activeGradient={["#a855f7", "#06b6d4"]}
        centerValue={dashboard.threatScore}
        defaultLabel="THREAT SCORE"
        endAngle={400}
        formatOptions={{ maximumFractionDigits: 0 }}
        inactiveFillOpacity={0.4}
        inactiveGradient={["#334155", "#38bdf8"]}
        notchCornerRadius={7}
        spacing={0}
        startAngle={140}
        useGradient
        value={dashboard.threatScore}
      />
    </div>
  );
}
