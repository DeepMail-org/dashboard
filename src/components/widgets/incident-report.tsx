"use client";

import type { WidgetProps } from "@/lib/dashboard/types";

const TIMELINE = [
  { time: "14:23", label: "Detected", detail: "ML model flagged credential harvesting pattern", color: "bg-danger" },
  { time: "14:25", label: "Quarantined", detail: "12 emails moved to quarantine across 8 mailboxes", color: "bg-warning" },
  { time: "14:31", label: "Investigation Started", detail: "SOC analyst AK assigned and began triage", color: "bg-accent" },
  { time: "14:48", label: "Blocklist Updated", detail: "Sender domain + 3 IPs added to block rules", color: "bg-success" },
];

const METRICS = [
  { label: "Affected Mailboxes", value: "8" },
  { label: "Emails Quarantined", value: "12" },
  { label: "MTTR", value: "25m" },
  { label: "Escalation", value: "Auto" },
];

export default function IncidentReport({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-danger/15 px-2 py-0.5 text-[9px] font-bold uppercase text-danger">Critical</span>
            <span className="text-[10px] text-muted">INC-2026-0518</span>
          </div>
          <h3 className="mt-1 text-sm font-medium text-fg">Credential Phishing Campaign</h3>
        </div>
        <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[9px] font-bold uppercase text-success">Resolved</span>
      </div>

      {/* Metrics row */}
      <div className="mb-3 grid grid-cols-4 gap-2">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-md bg-fg/3 px-2.5 py-2 text-center">
            <div className="font-display text-base font-bold text-fg">{m.value}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="flex-1 space-y-0 overflow-y-auto">
        {TIMELINE.map((event, i) => (
          <div key={i} className="relative flex gap-3 pb-3">
            {/* Connector line */}
            {i < TIMELINE.length - 1 && (
              <div className="absolute left-[5px] top-4 h-full w-px bg-border" />
            )}
            <div className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${event.color}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium text-fg">{event.label}</span>
                <span className="font-mono text-[10px] text-muted">{event.time}</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
