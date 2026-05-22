"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import type { PipelineStage } from "@/lib/api/types";
import { DEMO_PIPELINE } from "@/lib/demo-data";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";

const STATUS_CONFIG = {
  healthy: { icon: CheckCircle, color: "text-success", bg: "bg-success/20", label: "Healthy" },
  degraded: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/20", label: "Degraded" },
  down: { icon: Activity, color: "text-danger", bg: "bg-danger/20", label: "Down" },
} as const;

export default function PipelineStatus({ data, isLoading, containerWidth }: WidgetProps) {
  const stages = (data as PipelineStage[]) ?? DEMO_PIPELINE;

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const healthyCount = stages.filter((s) => s.status === "healthy").length;
  const isCompact = containerWidth < 350;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${healthyCount === stages.length ? "bg-success" : "bg-warning"}`} />
          <span className="text-xs text-muted">
            {healthyCount}/{stages.length} stages healthy
          </span>
        </div>
        <span className="font-mono text-xs text-accent">
          {stages[0]?.throughput ?? 0} msg/min
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {stages.map((stage) => {
          const config = STATUS_CONFIG[stage.status];
          const Icon = config.icon;
          return (
            <div
              key={stage.name}
              className="flex items-center gap-3 rounded-md border border-border/50 bg-surface/50 px-3 py-2 transition-colors hover:bg-surface-hover hover:border-border"
            >
              <div className={`rounded-md p-1 ${config.bg}`}>
                <Icon className={`h-3 w-3 ${config.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-secondary">{stage.name}</div>
                <div className="mt-0.5 flex gap-3 text-[10px] text-dimmed">
                  <span>{stage.latency}ms</span>
                  <span>{stage.errorRate}% err</span>
                </div>
              </div>
              {!isCompact && (
                <div className="text-right">
                  <div className="font-mono text-xs text-secondary">{stage.throughput}</div>
                  <div className="text-[10px] text-dimmed">msg/min</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
