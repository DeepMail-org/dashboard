"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { Server, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const DEMO_SERVICES = [
  { name: "API Gateway", status: "healthy" as const, uptime: 99.99, latency: 12, region: "us-east-1" },
  { name: "Mail Processor", status: "healthy" as const, uptime: 99.97, latency: 45, region: "us-east-1" },
  { name: "ML Engine", status: "degraded" as const, uptime: 99.85, latency: 230, region: "us-west-2" },
  { name: "Threat DB", status: "healthy" as const, uptime: 99.99, latency: 5, region: "us-east-1" },
  { name: "Sandbox Cluster", status: "healthy" as const, uptime: 99.95, latency: 89, region: "eu-west-1" },
  { name: "WebSocket Hub", status: "healthy" as const, uptime: 99.98, latency: 8, region: "us-east-1" },
  { name: "Redis Cache", status: "healthy" as const, uptime: 100.0, latency: 1, region: "us-east-1" },
  { name: "Log Ingest", status: "healthy" as const, uptime: 99.96, latency: 34, region: "us-east-1" },
];

const STATUS_ICON = { healthy: CheckCircle, degraded: AlertTriangle, down: XCircle };
const STATUS_COLOR = { healthy: "text-success", degraded: "text-warning", down: "text-danger" };

export default function InfraHealth({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const healthyCount = DEMO_SERVICES.filter((s) => s.status === "healthy").length;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-3.5 w-3.5 text-muted" />
          <span className="text-xs text-muted">
            {healthyCount}/{DEMO_SERVICES.length} services healthy
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-1.5">
          {DEMO_SERVICES.map((svc) => {
            const Icon = STATUS_ICON[svc.status];
            return (
              <div key={svc.name} className="flex items-center gap-2 rounded-md border border-border/50 bg-surface/50 px-2.5 py-2">
                <Icon className={`h-3 w-3 shrink-0 ${STATUS_COLOR[svc.status]}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-medium text-secondary">{svc.name}</div>
                  <div className="text-[10px] text-dimmed">{svc.latency}ms · {svc.uptime}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
