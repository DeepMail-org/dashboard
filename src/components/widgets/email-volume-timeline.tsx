"use client";

import { useMemo } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";
import type { DashboardOverview } from "@/lib/api/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { EChartsWrapper } from "@/components/charts/echarts-wrapper";

export default function EmailVolumeTimeline({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  const option = useMemo(() => {
    const hours = dashboard.emailVolume.map((d) =>
      new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    const counts = dashboard.emailVolume.map((d) => d.count);

    return {
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "cross" as const, lineStyle: { color: "var(--color-accent, #a855f7)", opacity: 0.4 } },
      },
      grid: { left: 48, right: 16, top: 16, bottom: 28 },
      xAxis: {
        type: "category" as const,
        data: hours,
        axisLabel: { fontSize: 9, interval: 3, color: "var(--color-dimmed, #888)" },
        axisLine: { lineStyle: { color: "var(--color-border, #333)" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value" as const,
        splitLine: { lineStyle: { color: "var(--color-border, #333)", opacity: 0.3, type: "dashed" as const } },
        axisLabel: { fontSize: 9, color: "var(--color-dimmed, #888)" },
      },
      series: [
        {
          type: "line" as const,
          data: counts,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#a855f7" },
          areaStyle: {
            color: {
              type: "linear" as const,
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(168, 85, 247, 0.3)" },
                { offset: 1, color: "rgba(168, 85, 247, 0.02)" },
              ],
            },
          },
        },
      ],
    };
  }, [dashboard.emailVolume]);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-display text-2xl font-bold text-fg">
          {dashboard.totalAnalyzed.toLocaleString()}
        </span>
        <span className="text-xs text-muted">emails analyzed (24h)</span>
      </div>
      <div className="min-h-0 flex-1">
        <EChartsWrapper option={option} />
      </div>
    </div>
  );
}
