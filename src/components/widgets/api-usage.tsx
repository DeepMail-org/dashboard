"use client";

import { useMemo } from "react";
import { Cpu, ExternalLink } from "lucide-react";
import type { WidgetProps } from "@/lib/dashboard/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { EChartsWrapper } from "@/components/charts/echarts-wrapper";
import type { DashboardOverview } from "@/lib/api/types";

const STATS = [
  { label: "Daily API Calls", value: "12.4K" },
  { label: "Emails Processed", value: "8,847" },
  { label: "Threats Detected", value: "291" },
];

export default function ApiUsage({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  const option = useMemo(() => {
    const hours = dashboard.emailVolume.map((d) =>
      new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    const emailCounts = dashboard.emailVolume.map((d) => d.count);
    const threatCounts = dashboard.emailVolume.map((d) =>
      Math.floor(d.count * (0.02 + Math.random() * 0.03)),
    );

    return {
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "cross" as const, lineStyle: { color: "oklch(60% 0.15 280)", opacity: 0.3 } },
      },
      legend: {
        bottom: 0,
        textStyle: { color: "oklch(45% 0.01 280)", fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
      },
      grid: { left: 40, right: 12, top: 8, bottom: 28 },
      xAxis: {
        type: "category" as const,
        data: hours,
        axisLabel: { fontSize: 9, interval: 5, color: "oklch(45% 0.01 280)" },
        axisLine: { lineStyle: { color: "oklch(26% 0.01 280)" } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value" as const,
        splitLine: { lineStyle: { color: "oklch(26% 0.01 280)", opacity: 0.3, type: "dashed" as const } },
        axisLabel: { fontSize: 9, color: "oklch(45% 0.01 280)" },
      },
      series: [
        {
          name: "Emails",
          type: "line" as const,
          data: emailCounts,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#a855f7" },
          areaStyle: {
            color: {
              type: "linear" as const,
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(168, 85, 247, 0.25)" },
                { offset: 1, color: "rgba(168, 85, 247, 0.02)" },
              ],
            },
          },
        },
        {
          name: "Threats",
          type: "line" as const,
          data: threatCounts,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#e54040" },
          areaStyle: {
            color: {
              type: "linear" as const,
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(229, 64, 64, 0.2)" },
                { offset: 1, color: "rgba(229, 64, 64, 0.02)" },
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
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-accent" />
          <div>
            <div className="text-xs font-medium text-fg">Processing Metrics</div>
            <div className="text-[10px] text-muted">DeepMail Engine v2.4</div>
          </div>
        </div>
        <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-[9px] font-bold uppercase text-success">
          Real-Time
        </span>
      </div>

      {/* Stats row */}
      <div className="mb-2 grid grid-cols-3 gap-3">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-[10px] uppercase tracking-wider text-muted">{s.label}</div>
            <div className="font-display text-xl font-bold text-fg">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="min-h-0 flex-1">
        <EChartsWrapper option={option} />
      </div>

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between border-t border-border/50 pt-2">
        <span className="text-[10px] text-muted">Avg Processing: 1.2s</span>
        <button className="flex items-center gap-1 text-[10px] text-accent hover:underline">
          API Docs <ExternalLink className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}
