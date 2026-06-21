"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { useState } from "react";
import { MOCK_VULNERABILITIES } from "@/lib/data-access/vulnerabilities";
import { SeverityPill } from "@/components/ui/severity-pill";
import { ExportButton } from "@/components/ui/export-button";
import { Search, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EXPLOIT_BADGE: Record<string, { label: string; class: string }> = {
  exploited:          { label: "Actively Exploited", class: "text-danger bg-danger/10 border-danger/20" },
  poc_available:      { label: "PoC Available",      class: "text-orange bg-orange/10 border-orange/20" },
  no_known_exploit:   { label: "No Known Exploit",   class: "text-muted bg-fg/5 border-border" },
};

export default function VulnerabilitiesPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_VULNERABILITIES.filter(
    (v) =>
      !search ||
      v.cveId.toLowerCase().includes(search.toLowerCase()) ||
      v.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageWrapper
      header={
        <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="dm-heading text-xl text-fg">Vulnerabilities</h1>
          <p className="mt-1 text-xs text-muted">{filtered.length} CVEs · Sorted by ExPRT rating</p>
        </div>
        <ExportButton onExport={(fmt) => { void fmt; return new Promise((r) => setTimeout(r, 600)); }} />
        </div>
      }
    >
      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total CVEs",          value: "496",   color: "text-fg" },
          { label: "Critical",            value: "12",    color: "text-danger" },
          { label: "Actively Exploited",  value: "4",     color: "text-orange" },
          { label: "Avg. Days Open",      value: "34",    color: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-4 py-3 shadow-card">
            <div className={cn("font-display text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5 w-fit">
        <Search className="h-3.5 w-3.5 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search CVEs…"
          className="w-56 bg-transparent text-xs text-fg outline-none placeholder:text-dimmed"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border shadow-card">
        <table className="w-full text-left">
          <thead>
            <tr>
              {["CVE ID", "Severity", "CVSS", "Exploit Status", "Title", "Affected", "Published"].map((col) => (
                <th key={col} className="border-b border-border bg-fg/2 px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-muted">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((vuln) => {
              const exploit = EXPLOIT_BADGE[vuln.exploitStatus];
              return (
                <tr key={vuln.cveId} className="border-b border-fg/5 transition-colors hover:bg-fg/4 group">
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/vulnerabilities/${vuln.cveId}`}
                      className="flex items-center gap-1.5 font-mono text-[12px] text-accent hover:underline"
                    >
                      <Shield className="h-3 w-3" />
                      {vuln.cveId}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <SeverityPill severity={vuln.severity} size="xs" />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "font-mono text-[13px] font-bold",
                      vuln.cvssScore >= 9 ? "text-danger" : vuln.cvssScore >= 7 ? "text-orange" : "text-warning",
                    )}>
                      {vuln.cvssScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded border px-2 py-0.5 text-[10px] font-medium", exploit.class)}>
                      {exploit.label}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3.5">
                    <Link href={`/vulnerabilities/${vuln.cveId}`} className="text-[12px] text-fg hover:text-accent line-clamp-1">
                      {vuln.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[12px] text-fg">{vuln.affectedCount}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[11px] text-muted">{vuln.publishDate}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
