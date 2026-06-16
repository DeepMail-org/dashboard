"use client";

import { useMemo } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";
import type { DashboardOverview } from "@/lib/api/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { EChartsWrapper } from "@/components/charts/echarts-wrapper";

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#a855f7",
  Info: "#6b7280",
};

export default function SeverityBreakdown({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  const option = useMemo(() => {
    const total = dashboard.severityBreakdown.reduce((s, d) => s + d.count, 0);

    return {
      tooltip: {
        trigger: "item" as const,
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number };
          return `${p.name}: ${p.value} (${p.percent}%)`;
        },
      },
      series: [
        {
          type: "pie" as const,
          radius: ["55%", "80%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: { borderRadius: 4 },
          label: {
            show: true,
            position: "center" as const,
            formatter: () => `${total}`,
            fontSize: 24,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            color: "var(--color-fg, #f5f5f5)",
          },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: 600 },
            scaleSize: 4,
          },
          data: dashboard.severityBreakdown.map((d) => ({
            name: d.severity,
            value: d.count,
            itemStyle: { color: SEVERITY_COLORS[d.severity] ?? d.color ?? "#888" },
          })),
        },
      ],
    };
  }, [dashboard.severityBreakdown]);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full">
      <div className="min-h-0 flex-1">
        <EChartsWrapper option={option} />
      </div>
      <div className="flex w-28 flex-col justify-center gap-1.5">
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
