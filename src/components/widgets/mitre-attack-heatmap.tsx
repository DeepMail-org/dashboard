"use client";

import { useMemo } from "react";
import type { WidgetProps } from "@/lib/dashboard/types";
import { EChartsWrapper } from "@/components/charts/echarts-wrapper";

const TACTICS = [
  "Recon", "Resource Dev", "Initial Access", "Execution",
  "Persistence", "Priv Esc", "Defense Evasion", "Cred Access",
  "Discovery", "Lateral Mov", "Collection", "C2", "Exfiltration",
];

const WEEKS = ["W1", "W2", "W3", "W4"];

function generateDemoData() {
  const data: [number, number, number][] = [];
  for (let t = 0; t < TACTICS.length; t++) {
    for (let w = 0; w < WEEKS.length; w++) {
      const v = Math.floor(Math.random() * 30);
      if (v > 3) data.push([w, t, v]);
    }
  }
  return data;
}

export default function MitreAttackHeatmap({ isLoading }: WidgetProps) {
  const option = useMemo(() => {
    const data = generateDemoData();
    const maxVal = Math.max(...data.map((d) => d[2]), 1);

    return {
      tooltip: {
        position: "top" as const,
        formatter: (params: unknown) => {
          const p = params as { value: [number, number, number] };
          return `${TACTICS[p.value[1]]}: ${p.value[2]} detections`;
        },
      },
      grid: { left: 90, right: 16, top: 16, bottom: 32 },
      xAxis: {
        type: "category" as const,
        data: WEEKS,
        axisLabel: { fontSize: 9, color: "var(--color-dimmed, #888)" },
        axisTick: { show: false },
        axisLine: { show: false },
        splitArea: { show: false },
      },
      yAxis: {
        type: "category" as const,
        data: TACTICS,
        axisLabel: { fontSize: 9, color: "var(--color-dimmed, #888)" },
        axisTick: { show: false },
        axisLine: { show: false },
        splitArea: { show: false },
      },
      visualMap: {
        min: 0,
        max: maxVal,
        calculable: false,
        show: false,
        inRange: {
          color: ["var(--color-surface, #1a1a2e)", "var(--color-accent-muted, #a855f740)", "#a855f7", "#ef4444"],
        },
      },
      series: [{
        type: "heatmap" as const,
        data,
        label: { show: false },
        itemStyle: { borderRadius: 3, borderWidth: 2, borderColor: "var(--color-bg, #111)" },
        emphasis: { itemStyle: { borderColor: "var(--color-fg, #fff)", borderWidth: 1 } },
      }],
    };
  }, []);

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;
  return <EChartsWrapper option={option} />;
}
