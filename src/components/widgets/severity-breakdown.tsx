"use client";

import { useMemo } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";
import type { DashboardOverview } from "@/lib/api/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { PieChart, PieSlice, PieCenter } from "@/components/charts/pie-chart";

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#a855f7",
  Info: "#6b7280",
};

export default function SeverityBreakdown({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  const total = useMemo(
    () => dashboard.severityBreakdown.reduce((s, d) => s + d.count, 0),
    [dashboard.severityBreakdown]
  );

  const pieData = useMemo(() => {
    return dashboard.severityBreakdown.map((d) => ({
      label: d.severity,
      value: d.count,
      fill: SEVERITY_COLORS[d.severity] ?? d.color ?? "#888",
    }));
  }, [dashboard.severityBreakdown]);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-wrap">
      <div className="relative min-h-[120px] min-w-[120px] flex-1 p-2 flex items-center justify-center">
        <PieChart data={pieData} innerRadius={55} padAngle={0.05} cornerRadius={4} className="h-full w-full">
          {pieData.map((_, i) => (
            <PieSlice key={i} index={i} />
          ))}
          <PieCenter defaultLabel="TOTAL" className="font-mono" />
        </PieChart>
      </div>
      <div className="flex min-w-[110px] flex-1 flex-col justify-center gap-1.5 p-2">
        {dashboard.severityBreakdown.map((d) => (
          <div key={d.severity} className="flex items-center gap-2 text-xs">
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: SEVERITY_COLORS[d.severity] ?? d.color }}
            />
            <span className="text-muted">{d.severity}</span>
            <span className="ml-auto font-mono text-secondary">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
