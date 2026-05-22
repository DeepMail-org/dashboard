"use client";

import { useState } from "react";
import { Search, Globe, AlertTriangle, Clock, ExternalLink } from "lucide-react";

type IocType = "ip" | "domain" | "hash" | "url" | "email";
type Severity = "critical" | "high" | "medium" | "low";

interface Ioc {
  type: IocType;
  value: string;
  severity: Severity;
  source: string;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
}

const TYPE_BADGE: Record<IocType, string> = {
  ip: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  domain: "bg-accent/10 text-accent border-accent/20",
  hash: "bg-orange/10 text-orange border-orange/20",
  url: "bg-warning/10 text-warning border-warning/20",
  email: "bg-success/10 text-success border-success/20",
};

const SEV_DOT: Record<Severity, string> = {
  critical: "bg-danger",
  high: "bg-orange",
  medium: "bg-warning",
  low: "bg-muted",
};

const DEMO_IOCS: Ioc[] = [
  { type: "ip", value: "185.220.101.34", severity: "critical", source: "AlienVault OTX", firstSeen: "2026-05-14", lastSeen: "2026-05-16", tags: ["C2", "Emotet", "APT28"] },
  { type: "domain", value: "evil-cdn.ru", severity: "critical", source: "VirusTotal", firstSeen: "2026-05-10", lastSeen: "2026-05-16", tags: ["Malware Hosting", "Fast-Flux"] },
  { type: "hash", value: "a8f3c2d1e9b74a2f8c1d3e5b7a9c0f2d", severity: "high", source: "DeepMail Sandbox", firstSeen: "2026-05-16", lastSeen: "2026-05-16", tags: ["Trojan", "Dropper"] },
  { type: "url", value: "https://microsft-alert.com/verify", severity: "high", source: "PhishTank", firstSeen: "2026-05-15", lastSeen: "2026-05-16", tags: ["Phishing", "Credential Harvest"] },
  { type: "ip", value: "103.45.67.89", severity: "high", source: "Abuse IPDB", firstSeen: "2026-05-12", lastSeen: "2026-05-16", tags: ["Phishing", "Botnet"] },
  { type: "domain", value: "dhl-tracking.info", severity: "medium", source: "URLhaus", firstSeen: "2026-05-13", lastSeen: "2026-05-16", tags: ["Brand Impersonation"] },
  { type: "email", value: "payments@ext-vendor.xyz", severity: "high", source: "DeepMail", firstSeen: "2026-05-16", lastSeen: "2026-05-16", tags: ["BEC", "Reply-To Mismatch"] },
  { type: "hash", value: "b7c4d2e1f8a93b5c6d7e8f0a1b2c3d4e", severity: "medium", source: "MISP", firstSeen: "2026-05-11", lastSeen: "2026-05-15", tags: ["Macro", "VBA"] },
];

const FEED_ITEMS = [
  { source: "AlienVault OTX", time: "2m ago", title: "New Emotet variant targeting finance sector", severity: "critical" as const },
  { source: "VirusTotal", time: "15m ago", title: "Bulk IOC update: 847 new malicious IPs from RU", severity: "high" as const },
  { source: "MISP", time: "1h ago", title: "APT28 campaign IOCs shared by CERT-EU", severity: "critical" as const },
  { source: "PhishTank", time: "2h ago", title: "Microsoft brand phishing URLs — 234 new entries", severity: "high" as const },
  { source: "URLhaus", time: "3h ago", title: "DHL impersonation domains batch submission", severity: "medium" as const },
];

export default function ThreatIntelPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<IocType | "all">("all");

  const filtered = DEMO_IOCS.filter((ioc) => {
    if (typeFilter !== "all" && ioc.type !== typeFilter) return false;
    if (search && !ioc.value.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-350 p-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="font-display text-lg font-medium text-fg">Threat Intelligence</h1>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" />
          Last sync: 2 minutes ago
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* IOC Browser — 2 cols */}
        <div className="col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                placeholder="Search IOCs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 bg-transparent text-xs text-fg placeholder:text-muted outline-none"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "ip", "domain", "hash", "url", "email"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-md px-2.5 py-1 text-[11px] uppercase transition-colors ${
                    typeFilter === t ? "bg-fg/8 text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* IOC Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 shadow-card">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {["Type", "Value", "Severity", "Source", "First Seen", "Tags"].map((col) => (
                    <th key={col} className="border-b border-border bg-fg/2 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ioc) => (
                  <tr key={ioc.value} className="transition-colors hover:bg-fg/3">
                    <td className="border-b border-fg/3 px-4 py-3">
                      <span className={`rounded border px-1.5 py-px text-[9px] font-semibold uppercase ${TYPE_BADGE[ioc.type]}`}>
                        {ioc.type}
                      </span>
                    </td>
                    <td className="border-b border-fg/3 px-4 py-3 font-mono text-xs text-fg">{ioc.value}</td>
                    <td className="border-b border-fg/3 px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${SEV_DOT[ioc.severity]}`} />
                        <span className="text-xs capitalize text-muted">{ioc.severity}</span>
                      </span>
                    </td>
                    <td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">{ioc.source}</td>
                    <td className="border-b border-fg/3 px-4 py-3 font-mono text-[11px] text-muted">{ioc.firstSeen}</td>
                    <td className="border-b border-fg/3 px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {ioc.tags.map((tag) => (
                          <span key={tag} className="rounded bg-fg/5 px-1.5 py-px text-[9px] text-muted">{tag}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feed — 1 col */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-fg">Live Feed</h2>
          <div className="space-y-2">
            {FEED_ITEMS.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-hover">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-accent">{item.source}</span>
                  <span className="font-mono text-[10px] text-dimmed">{item.time}</span>
                </div>
                <p className="text-xs leading-relaxed text-secondary">{item.title}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${SEV_DOT[item.severity]}`} />
                  <span className="text-[10px] capitalize text-muted">{item.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
