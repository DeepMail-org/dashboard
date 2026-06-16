"use client";

import { useMemo } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";
import type { DashboardOverview } from "@/lib/api/types";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { EChartsWrapper } from "@/components/charts/echarts-wrapper";

export default function ThreatScoreGauge({ data, isLoading }: WidgetProps) {
  const dashboard = (data as DashboardOverview) ?? DEMO_DASHBOARD;

  const option = useMemo(
    () => ({
      series: [
        {
          type: "gauge" as const,
          startAngle: 220,
          endAngle: -40,
          min: 0,
          max: 100,
          radius: "90%",
          axisLine: {
            lineStyle: {
              width: 14,
              color: [
                [0.3, "#10b981"],
                [0.7, "#eab308"],
                [1, "#ef4444"],
              ],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: {
            width: 5,
            length: "60%",
            itemStyle: { color: "var(--color-fg, #f5f5f5)" },
          },
          anchor: {
            show: true,
            size: 10,
            itemStyle: {
              borderWidth: 2,
              borderColor: "var(--color-accent, #a855f7)",
              color: "var(--color-surface, #1a1a2e)",
            },
          },
          detail: {
            valueAnimation: true,
            fontSize: 32,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            color: "var(--color-fg, #f5f5f5)",
            offsetCenter: [0, "40%"],
            formatter: "{value}",
          },
          title: {
            fontSize: 11,
            color: "var(--color-muted, #888)",
            offsetCenter: [0, "65%"],
          },
          data: [{ value: dashboard.threatScore, name: "THREAT SCORE" }],
        },
      ],
    }),
    [dashboard.threatScore],
  );

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return <EChartsWrapper option={option} />;
}
