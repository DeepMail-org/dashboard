"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react";
import { getCveDetail, getAffectedHosts, type Vulnerability, type AffectedHost } from "@/lib/data-access/vulnerabilities";
import { CvssGauge } from "@/components/vulnerabilities/cvss-gauge";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SeverityPill } from "@/components/ui/severity-pill";
import { StatusBadge } from "@/components/ui/status-badge";
import { ExportButton } from "@/components/ui/export-button";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type DetailTab = "details" | "remediations" | "exprt" | "cvss" | "exploits";

const CVSS_ATTRS = [
  { label: "Attack Vector",       value: "Network",          score: "N" },
  { label: "Attack Complexity",   value: "Low",              score: "L" },
  { label: "Privileges Required", value: "None",             score: "N" },
  { label: "User Interaction",    value: "None",             score: "N" },
  { label: "Scope",               value: "Unchanged",        score: "U" },
  { label: "Confidentiality",     value: "High",             score: "H" },
  { label: "Integrity",           value: "High",             score: "H" },
  { label: "Availability",        value: "High",             score: "H" },
];

type SortKey = "hostname" | "assetCriticality" | "daysOpen" | "status";
type SortDir = "asc" | "desc";

export default function CveDetailPage() {
  const params = useParams();
  const cveId = params.cveId as string;
  const [vuln, setVuln] = useState<Vulnerability | null>(null);
  const [hosts, setHosts] = useState<AffectedHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("daysOpen");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    Promise.all([getCveDetail(cveId), getAffectedHosts(cveId)]).then(([v, h]) => {
      setVuln(v);
      setHosts(h);
      setLoading(false);
    });
  }, [cveId]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortedHosts = [...hosts].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "hostname") cmp = a.hostname.localeCompare(b.hostname);
    else if (sortKey === "daysOpen") cmp = a.daysOpen - b.daysOpen;
    else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleSelect = (hostname: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(hostname) ? next.delete(hostname) : next.add(hostname);
      return next;
    });
  };

  const handleSuppress = () => {
    toast.success(`Suppressed ${selected.size} host${selected.size !== 1 ? "s" : ""}`);
    setSelected(new Set());
  };

  const SortIcon = ({ key }: { key: SortKey }) => {
    if (sortKey !== key) return <ArrowUpDown className="h-2.5 w-2.5 opacity-30" />;
    return sortDir === "asc" ? <ArrowUp className="h-2.5 w-2.5 text-accent" /> : <ArrowDown className="h-2.5 w-2.5 text-accent" />;
  };

  const TABS: Array<{ key: DetailTab; label: string }> = [
    { key: "details", label: "Details" },
    { key: "remediations", label: "Remediations" },
    { key: "exprt", label: "ExPRT Rating" },
    { key: "cvss", label: "CVSS Attributes" },
    { key: "exploits", label: "Exploit Sources" },
  ];

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-6 py-6 space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-surface" />
        <div className="h-8 w-64 animate-pulse rounded bg-surface" />
        <SkeletonTable rows={10} cols={7} />
      </div>
    );
  }

  if (!vuln) {
    return (
      <div className="px-6 py-12 text-center text-muted">CVE not found: {cveId}</div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-6">
      {/* Breadcrumb */}
      <BreadcrumbNav
        items={[
          { label: "Exposure Management" },
          { label: "Vulnerabilities", href: "/vulnerabilities" },
          { label: vuln.cveId },
        ]}
        className="mb-4"
      />

      {/* CVE Header */}
      <div className="mb-6 flex items-start gap-3">
        <h1 className="dm-heading text-2xl text-fg">{vuln.cveId}</h1>
        <SeverityPill severity={vuln.severity} />
        <div className="ml-2 flex items-center gap-3 text-xs text-muted">
          <a href="#" className="flex items-center gap-1 hover:text-accent">Vendor advisory <ExternalLink className="h-3 w-3" /></a>
          <span>·</span>
          <a href={`https://nvd.nist.gov/vuln/detail/${vuln.cveId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent">NVD <ExternalLink className="h-3 w-3" /></a>
        </div>
      </div>

      {/* Status + Details grid */}
      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Status card */}
        <div className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 p-5 space-y-5">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted">Status</h2>
          <CvssGauge label="ExPRT Rating" rating={vuln.exPrtRating} />
          <div className="border-t border-border pt-4">
            <CvssGauge
              label="Exploit Status"
              rating={vuln.exploitStatus === "exploited" ? "critical" : vuln.exploitStatus === "poc_available" ? "high" : "low"}
            />
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-[10px] text-muted mb-2">Vulnerability data providers</p>
            <div className="flex flex-wrap gap-1.5">
              {vuln.dataProviders.map((p) => (
                <span key={p} className="rounded bg-fg/8 px-2 py-0.5 text-[11px] text-secondary">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Detail tabs */}
        <div className="col-span-2 overflow-hidden rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-3 text-[12px] transition-colors",
                  activeTab === tab.key
                    ? "border-b-2 border-accent text-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "details" && (
              <div className="space-y-4">
                <div>
                  <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">Description</p>
                  <p className="text-[13px] leading-relaxed text-secondary">{vuln.description}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">References</p>
                  <p className="text-[12px] text-muted">No additional references found</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted">Utility</p>
                    <p className="text-[12px] text-secondary">{vuln.utilityType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted">Vulnerability Type</p>
                    <div className="flex items-center gap-1">
                      <p className="text-[12px] text-secondary">{vuln.vulnerabilityType}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "remediations" && (
              <div className="space-y-3">
                <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                  <p className="text-[12px] font-medium text-success">Recommended Action</p>
                  <p className="mt-1 text-[12px] text-secondary">
                    Update to version 5.8.0.24 or newer. Apply vendor patch immediately for all affected systems.
                  </p>
                </div>
                <ol className="space-y-2 text-[12px] text-secondary">
                  {[
                    "Identify all affected Cleo installations across your environment",
                    "Download the latest patch from the Cleo vendor portal",
                    "Apply the patch during the next maintenance window",
                    "Verify the Autorun directory settings are not configured with default paths",
                    "Monitor for any signs of exploitation using DeepMail detection rules",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[9px] font-bold text-accent">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === "cvss" && (
              <div className="grid grid-cols-2 gap-3">
                {CVSS_ATTRS.map((attr) => (
                  <div key={attr.label} className="rounded-lg border border-border bg-surface/50 px-3 py-2.5">
                    <p className="text-[10px] text-muted">{attr.label}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-accent">{attr.score}</span>
                      <span className="text-[12px] text-secondary">{attr.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === "exprt" || activeTab === "exploits") && (
              <p className="text-[12px] text-muted">
                {activeTab === "exprt"
                  ? "ExPRT (Exploitation Prediction Rating Tool) analyzes threat intelligence, exploit availability, and attack complexity to provide a holistic risk rating."
                  : "No publicly known exploit sources documented for this CVE in our threat intelligence database."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Affected hosts table */}
      <div className="rounded-xl border border-border shadow-card overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between border-b border-border bg-fg/2 px-5 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-[13px] font-semibold text-fg">Vulnerabilities</h2>
            <span className="rounded-full bg-fg/8 px-2 py-0.5 text-[10px] text-muted">{hosts.length} items</span>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <button
                onClick={handleSuppress}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:border-warning/40 hover:text-warning"
              >
                Suppress {selected.size} selected
              </button>
            )}
            <button className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-secondary hover:bg-surface-hover">
              Create Ticket
            </button>
            <ExportButton onExport={(fmt) => { void fmt; return new Promise((r) => setTimeout(r, 600)); }} />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="border-b border-border bg-fg/2 px-4 py-3 w-8" />
              {[
                { key: "hostname" as SortKey, label: "Hostname" },
                { key: "assetCriticality" as SortKey, label: "Asset Criticality" },
                { key: null, label: "Remediation" },
                { key: null, label: "Vulnerable Version" },
                { key: "status" as SortKey, label: "Status" },
                { key: "daysOpen" as SortKey, label: "Days Open" },
                { key: null, label: "Actions" },
              ].map(({ key, label }) => (
                <th
                  key={label}
                  onClick={key ? () => toggleSort(key) : undefined}
                  className={cn(
                    "border-b border-border bg-fg/2 px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-muted",
                    key && "cursor-pointer select-none hover:text-fg",
                  )}
                >
                  <span className="flex items-center gap-1">
                    {label}
                    {key && <SortIcon key={key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedHosts.map((host) => (
              <tr key={host.hostname} className="border-b border-fg/5 transition-colors hover:bg-fg/4">
                <td className="px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.has(host.hostname)}
                    onChange={() => toggleSelect(host.hostname)}
                    className="accent-accent"
                  />
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-[12px] text-fg">{host.hostname}</span>
                </td>
                <td className="px-4 py-3.5">
                  <SeverityPill severity={host.assetCriticality} size="xs" />
                </td>
                <td className="px-4 py-3.5">
                  <span className="rounded bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
                    {host.remediation}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-fg">{host.vulnerableVersion}</span>
                    <span className="text-[10px] text-muted">→ {host.patchVersion}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={host.status} />
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn(
                    "font-mono text-[12px] font-semibold",
                    host.daysOpen > 30 ? "text-danger" : host.daysOpen > 14 ? "text-orange" : "text-muted",
                  )}>
                    {host.daysOpen}d
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-fg">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
