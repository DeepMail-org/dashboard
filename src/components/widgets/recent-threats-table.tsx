"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import type { ThreatEntry } from "@/lib/api/types";
import { DEMO_THREATS } from "@/lib/demo-data";

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-danger/20 text-danger",
  high: "bg-orange/20 text-orange",
  medium: "bg-warning/20 text-warning",
  low: "bg-accent/20 text-accent",
  info: "bg-muted/20 text-muted",
};

const STATUS_STYLES: Record<string, string> = {
  quarantined: "text-warning",
  blocked: "text-danger",
  detected: "text-orange",
  delivered: "text-muted",
};

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function RecentThreatsTable({ data, isLoading, containerWidth }: WidgetProps) {
  const threats = (data as ThreatEntry[]) ?? DEMO_THREATS;

  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  const isCompact = containerWidth < 500;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          Live Threat Feed
        </span>
        <span className="font-mono text-xs text-accent">{threats.length} threats</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-surface">
            <tr className="border-b border-border/50 text-left text-muted">
              <th className="pb-2 pr-2 font-medium">Severity</th>
              <th className="pb-2 pr-2 font-medium">Subject</th>
              {!isCompact && <th className="pb-2 pr-2 font-medium">Type</th>}
              <th className="pb-2 pr-2 font-medium">Status</th>
              <th className="pb-2 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {threats.map((threat) => (
              <tr
                key={threat.id}
                className="group border-b border-border/30 transition-colors hover:bg-surface-hover cursor-pointer"
              >
                <td className="py-2 pr-2">
                  <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${SEVERITY_STYLES[threat.severity]}`}>
                    {threat.severity}
                  </span>
                </td>
                <td className="max-w-[200px] truncate py-2 pr-2 text-secondary group-hover:text-fg transition-colors">
                  {threat.subject}
                </td>
                {!isCompact && (
                  <td className="py-2 pr-2 font-mono text-muted">{threat.type}</td>
                )}
                <td className={`py-2 pr-2 capitalize ${STATUS_STYLES[threat.status]}`}>
                  {threat.status}
                </td>
                <td className="py-2 text-right font-mono text-dimmed">
                  {timeAgo(threat.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
