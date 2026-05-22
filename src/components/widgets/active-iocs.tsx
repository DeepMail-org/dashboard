"use client";

import type { WidgetProps } from "@/lib/dashboard/types";
import { Globe, Hash, Link2, Mail } from "lucide-react";

const IOC_ICONS = { ip: Globe, domain: Globe, hash: Hash, url: Link2, email: Mail } as const;

const DEMO_IOCS = [
  { type: "ip" as const, value: "185.234.218.44", severity: "critical" as const, source: "OSINT", count: 12 },
  { type: "domain" as const, value: "malware-c2.xyz", severity: "critical" as const, source: "Internal", count: 8 },
  { type: "hash" as const, value: "a1b2c3d4e5f6...7890", severity: "high" as const, source: "VirusTotal", count: 5 },
  { type: "ip" as const, value: "91.215.85.12", severity: "high" as const, source: "Abuse.ch", count: 4 },
  { type: "url" as const, value: "https://phish.example/login", severity: "medium" as const, source: "PhishTank", count: 3 },
  { type: "domain" as const, value: "exfil-data.ru", severity: "high" as const, source: "OSINT", count: 3 },
];

const SEV_STYLE = {
  critical: "border-danger/40 bg-danger/10",
  high: "border-orange/40 bg-orange/10",
  medium: "border-warning/40 bg-warning/10",
  low: "border-accent/40 bg-accent/10",
};

export default function ActiveIocs({ isLoading }: WidgetProps) {
  if (isLoading) return <div className="h-full w-full animate-pulse rounded-lg bg-surface" />;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">Active IOCs</span>
        <span className="font-mono text-xs text-accent">{DEMO_IOCS.length}</span>
      </div>
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto">
        {DEMO_IOCS.map((ioc, i) => {
          const Icon = IOC_ICONS[ioc.type] ?? Globe;
          return (
            <div key={i} className={`flex items-center gap-2.5 rounded-md border px-2.5 py-1.5 ${SEV_STYLE[ioc.severity]}`}>
              <Icon className="h-3 w-3 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[11px] text-secondary">{ioc.value}</div>
                <div className="text-[10px] text-dimmed">{ioc.source} · {ioc.type.toUpperCase()}</div>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-muted">{ioc.count}×</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
