"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { Rss, AlertTriangle, Shield, Bug } from "lucide-react";

const FEED_ICONS = { alert: AlertTriangle, advisory: Shield, malware: Bug, feed: Rss };

const DEMO_FEED = [
  { type: "alert" as const, title: "APT29 targeting energy sector with new TTPs", source: "CISA", time: "12m ago", severity: "critical" as const },
  { type: "malware" as const, title: "New ransomware variant 'BlackSuit' observed in wild", source: "MalwareBazaar", time: "34m ago", severity: "high" as const },
  { type: "advisory" as const, title: "CVE-2024-38124: Windows RCE in LDAP", source: "NVD", time: "1h ago", severity: "critical" as const },
  { type: "feed" as const, title: "Emotet botnet activity resurgence detected", source: "Abuse.ch", time: "2h ago", severity: "high" as const },
  { type: "alert" as const, title: "Credential stuffing campaign targeting O365", source: "Internal SOC", time: "3h ago", severity: "medium" as const },
  { type: "advisory" as const, title: "DMARC policy bypass technique disclosed", source: "SecurityWeek", time: "5h ago", severity: "medium" as const },
];

const SEV_DOT = { critical: "bg-danger", high: "bg-orange", medium: "bg-warning", low: "bg-accent" };

export default function ThreatIntelFeed({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Threat Intel Feed</span>
        <Rss className="h-3 w-3 text-accent" />
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {DEMO_FEED.map((item, i) => {
          const Icon = FEED_ICONS[item.type];
          return (
            <div key={i} className="flex gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-surface-hover">
              <div className="mt-0.5 shrink-0">
                <Icon className="h-3.5 w-3.5 text-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-secondary leading-snug">{item.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-dimmed">
                  <div className={`h-1.5 w-1.5 rounded-full ${SEV_DOT[item.severity]}`} />
                  <span>{item.source}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
