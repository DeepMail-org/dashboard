"use client";

import { useMemo } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";
import { EChartsWrapper } from "@/components/charts/echarts-wrapper";

const DEMO_VECTORS = [
  { name: "Phishing", value: 85 },
  { name: "Malware", value: 62 },
  { name: "BEC", value: 48 },
  { name: "Ransomware", value: 33 },
  { name: "Data Exfil", value: 27 },
  { name: "Zero-Day", value: 15 },
];

export default function AttackVectorRadar({ isLoading }: WidgetProps) {
  const option = useMemo(() => ({
    radar: {
      indicator: DEMO_VECTORS.map((v) => ({ name: v.name, max: 100 })),
      shape: "polygon" as const,
      axisLine: { lineStyle: { color: "var(--color-border, #333)" } },
      splitLine: { lineStyle: { color: "var(--color-border, #333)", opacity: 0.3 } },
      splitArea: { show: false },
      axisName: { color: "var(--color-muted, #888)", fontSize: 10 },
    },
    series: [{
      type: "radar" as const,
      data: [{
        value: DEMO_VECTORS.map((v) => v.value),
        name: "Attack Vectors",
        lineStyle: { color: "#a855f7", width: 2 },
        areaStyle: { color: "rgba(168, 85, 247, 0.15)" },
        itemStyle: { color: "#a855f7" },
      }],
    }],
  }), []);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;
  return <EChartsWrapper option={option} />;
}
