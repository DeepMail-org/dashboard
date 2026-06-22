"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { useState, useMemo, useEffect, Fragment } from "react";
import {
  ChevronDown, ChevronRight, Search, Plus, RefreshCw,
  Shield, ExternalLink, UserPlus, FolderOpen, CheckCircle,
  ArrowUpDown, ArrowUp, ArrowDown, Grid3x3
} from "lucide-react";
import { SeverityPill } from "@/components/ui/severity-pill";
import { StatusBadge } from "@/components/ui/status-badge";
import { ExportButton } from "@/components/ui/export-button";
import { FilterChipBar } from "@/components/detections/detection-filter-bar";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_DETECTIONS, type Detection, type Severity, type DetectionStatus } from "@/lib/data-access/detections";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "127",   label: "Detections Today",     color: "text-fg" },
  { value: "14",    label: "Critical",              color: "text-danger" },
  { value: "94.2%", label: "True Positive Rate",    color: "text-success" },
  { value: "3",     label: "Open Incidents",        color: "text-orange" },
];

// ── Expand-Row Detail ─────────────────────────────────────────────────────────
function DetectionRowDetail({ detection }: { detection: Detection }) {
  const handleCreateCase = async () => {
    toast.promise(
      new Promise((r) => setTimeout(r, 800)),
      {
        loading: "Creating case…",
        success: `Case created from detection ${detection.id}`,
        error: "Failed to create case",
      },
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 bg-bg/50 px-6 py-5 border-t border-accent/20 md:grid-cols-3">
      {/* Description */}
      <div className="col-span-2 space-y-4">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted">Description</p>
          <p className="text-[12px] leading-relaxed text-secondary">{detection.description}</p>
        </div>

        {detection.relatedIocs.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">Related IOCs</p>
            <div className="flex flex-wrap gap-1.5">
              {detection.relatedIocs.map((ioc) => (
                <span
                  key={ioc}
                  className="rounded border border-accent/20 bg-accent/5 px-2 py-0.5 font-mono text-[10px] text-accent"
                >
                  {ioc}
                </span>
              ))}
            </div>
          </div>
        )}

        {detection.adversary && (
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted">Associated Adversary</p>
            <span className="inline-flex items-center gap-1.5 rounded border border-danger/25 bg-danger/8 px-2.5 py-1 text-[11px] font-medium text-danger">
              <Shield className="h-3 w-3" />
              {detection.adversary}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Actions</p>
        <button
          onClick={handleCreateCase}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] text-secondary transition-colors hover:border-accent/40 hover:text-fg"
        >
          <FolderOpen className="h-3.5 w-3.5 text-muted" />
          Create Case
        </button>
        <button className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] text-secondary transition-colors hover:border-accent/40 hover:text-fg">
          <UserPlus className="h-3.5 w-3.5 text-muted" />
          Assign to Me
        </button>
        <button className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] text-secondary transition-colors hover:border-accent/40 hover:text-fg">
          <CheckCircle className="h-3.5 w-3.5 text-muted" />
          Mark Resolved
        </button>
        <a
          href="/threat-intel"
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] text-secondary transition-colors hover:border-accent/40 hover:text-fg"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted" />
          View in Threat Intel
        </a>
      </div>
    </div>
  );
}

// ── Sortable Column Header ───────────────────────────────────────────────────
type SortKey = "severity" | "detectTime" | "name" | "status" | "hostname";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-2.5 w-2.5 opacity-30" />;
  return dir === "asc"
    ? <ArrowUp className="h-2.5 w-2.5 text-accent" />
    : <ArrowDown className="h-2.5 w-2.5 text-accent" />;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const SEV_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function DetectionsPage() {
  const [loading, setLoading] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("detectTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [sevFilter, setSevFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDetections(MOCK_DETECTIONS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleRow = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let d = [...detections];
    if (sevFilter.length) d = d.filter((x) => sevFilter.includes(x.severity));
    if (statusFilter.length) d = d.filter((x) => statusFilter.includes(x.status));
    if (categoryFilter.length) d = d.filter((x) => categoryFilter.includes(x.category));
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q) ||
          x.hostname.toLowerCase().includes(q) ||
          x.adversary?.toLowerCase().includes(q),
      );
    }
    d.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "severity") cmp = SEV_ORDER[a.severity] - SEV_ORDER[b.severity];
      else if (sortKey === "detectTime") cmp = a.detectTime.localeCompare(b.detectTime);
      else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "hostname") cmp = a.hostname.localeCompare(b.hostname);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return d;
  }, [detections, sevFilter, statusFilter, categoryFilter, search, sortKey, sortDir]);

  // Group by date
  const grouped = useMemo(() => {
    const groups = new Map<string, Detection[]>();
    for (const d of filtered) {
      const day = format(parseISO(d.detectTime), "MMM dd, yyyy");
      const list = groups.get(day) ?? [];
      list.push(d);
      groups.set(day, list);
    }
    return groups;
  }, [filtered]);

  const clearAllFilters = () => {
    setSevFilter([]); setStatusFilter([]); setCategoryFilter([]); setSearch("");
  };

  const FILTER_DEFS = {
    severity: [
      { value: "critical", label: "Critical" },
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
    status: [
      { value: "new", label: "New" },
      { value: "in_progress", label: "In Progress" },
      { value: "resolved", label: "Resolved" },
      { value: "closed", label: "Closed" },
    ],
    category: [
      { value: "Phishing", label: "Phishing" },
      { value: "Malware", label: "Malware" },
      { value: "Credential", label: "Credential" },
      { value: "C2", label: "C2" },
      { value: "Spam", label: "Spam" },
      { value: "ML Model", label: "ML Model" },
    ],
  };

  const ACTIVE_FILTERS = [
    { key: "severity", label: "Severity", values: sevFilter },
    { key: "status", label: "Status", values: statusFilter },
    { key: "category", label: "Category", values: categoryFilter },
  ];

  const handleFilterChange = (key: string, values: string[]) => {
    if (key === "severity") setSevFilter(values);
    else if (key === "status") setStatusFilter(values);
    else if (key === "category") setCategoryFilter(values);
  };

  const COL_HEADER = (key: SortKey | null, label: string, className = "") => (
    <th
      onClick={key ? () => toggleSort(key) : undefined}
      className={cn(
        "border-b border-border bg-fg/2 px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted",
        key && "cursor-pointer select-none hover:text-fg transition-colors",
        className,
      )}
    >
      <span className="flex items-center gap-1">
        {label}
        {key && <SortIcon active={sortKey === key} dir={sortDir} />}
      </span>
    </th>
  );

  return (
    <PageWrapper
      header={
        <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="dm-heading text-xl text-fg">Detections</h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              List is up to date
            </span>
            <span className="text-dimmed">·</span>
            <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""} ({MOCK_DETECTIONS.length.toLocaleString()} total)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            onExport={(fmt) => {
              void fmt;
              return new Promise((r) => setTimeout(r, 600));
            }}
          />
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-hover">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button className="flex items-center gap-2 rounded-md bg-fg px-3.5 py-1.5 text-xs font-medium text-bg transition-opacity hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            New Detection Rule
          </button>
        </div>
        </div>
      }
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Stats row */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4 shrink-0">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-4 py-3 shadow-card">
            <div className={cn("font-display text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

        {/* Filter bar + search */}
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-surface/60 px-5 py-3 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Search detections…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 bg-transparent text-xs text-fg outline-none placeholder:text-dimmed"
            />
          </div>
          <FilterChipBar
            filters={FILTER_DEFS}
            activeFilters={ACTIVE_FILTERS}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            rightSlot={
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] text-muted transition-colors hover:text-fg">
                <Grid3x3 className="h-3 w-3" />
                MITRE ATT&CK® Matrix
              </button>
            }
          />
        </div>
      </div>

        {/* Table */}
        {loading ? (
          <SkeletonTable rows={7} cols={8} />
        ) : filtered.length === 0 ? (
        <EmptyState
          title="No detections match your filters"
          description="Try adjusting your filter criteria or clearing all filters."
          icon={Shield}
          action={
            <button
              onClick={clearAllFilters}
              className="rounded-md bg-fg/8 px-3 py-1.5 text-xs text-secondary hover:bg-fg/12"
            >
              Clear Filters
            </button>
          }
        />
        ) : (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden rounded-xl border border-border shadow-card">
            <div className="flex-1 min-h-0 overflow-auto relative">
              <table className="w-full text-left relative">
                <thead className="sticky top-0 z-10 bg-surface">
                  <tr>
                    <th className="w-8 border-b border-border bg-[#131315] px-3 py-3" />
                {COL_HEADER("severity", "Sev")}
                {COL_HEADER("detectTime", "Detect Time")}
                {COL_HEADER("name", "Name")}
                {COL_HEADER(null, "Category")}
                {COL_HEADER(null, "ATT&CK Tactic")}
                {COL_HEADER("hostname", "Hostname")}
                {COL_HEADER(null, "Assigned To")}
                {COL_HEADER("status", "Status")}
                {COL_HEADER(null, "Source")}
              </tr>
            </thead>
            <tbody>
              {Array.from(grouped.entries()).map(([day, items]) => (
                <Fragment key={`group-frag-${day}`}>
                  {/* Date group row */}
                  <tr className="group-row">
                    <td
                      colSpan={10}
                      className="border-b border-fg/5 bg-fg/3 px-4 py-2"
                    >
                      <span className="text-[11px] font-semibold text-muted">{day}</span>
                      <span className="ml-2 text-[11px] text-dimmed">— {items.length} detection{items.length !== 1 ? "s" : ""}</span>
                    </td>
                  </tr>

                  {items.map((det) => {
                    const isExpanded = expanded.has(det.id);
                    return (
                      <Fragment key={det.id}>
                        <tr
                          onClick={() => toggleRow(det.id)}
                          className={cn(
                            "cursor-pointer border-b border-fg/5 transition-colors hover:bg-fg/4",
                            isExpanded && "bg-accent/4 border-b-0",
                          )}
                        >
                          {/* Expand toggle */}
                          <td className="px-3 py-3.5">
                            <div className="flex items-center justify-center text-muted">
                              {isExpanded
                                ? <ChevronDown className="h-3.5 w-3.5" />
                                : <ChevronRight className="h-3.5 w-3.5" />
                              }
                            </div>
                          </td>

                          {/* Severity */}
                          <td className="px-4 py-3.5">
                            <SeverityPill severity={det.severity} size="xs" />
                          </td>

                          {/* Detect time */}
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-[11px] text-muted">
                              {format(parseISO(det.detectTime), "HH:mm:ss")}
                            </span>
                          </td>

                          {/* Name */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col">
                              <span className="text-[12px] font-medium text-fg">{det.name}</span>
                              <span className="font-mono text-[10px] text-dimmed">{det.id}</span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3.5">
                            <span className="rounded bg-fg/5 px-2 py-0.5 text-[10px] text-muted">
                              {det.category}
                            </span>
                          </td>

                          {/* MITRE ATT&CK */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col">
                              <span className="text-[11px] text-secondary">{det.mitreTactic}</span>
                              <span className="font-mono text-[10px] text-accent">{det.mitreId}</span>
                            </div>
                          </td>

                          {/* Hostname */}
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-[11px] text-fg">{det.hostname}</span>
                            {det.username && (
                              <div className="text-[10px] text-muted">{det.username}</div>
                            )}
                          </td>

                          {/* Assigned To */}
                          <td className="px-4 py-3.5">
                            <span className="text-[12px] text-muted">{det.assignedTo}</span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge
                              status={
                                det.status === "in_progress" ? "running"
                                  : det.status === "new" ? "new"
                                  : det.status as "resolved" | "closed"
                              }
                            />
                          </td>

                          {/* Source */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-muted">{det.vendor}</span>
                              <span className="text-[10px] text-dimmed">{det.sourceProduct}</span>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        {isExpanded && (
                          <tr key={`${det.id}-detail`} className="border-b border-fg/5">
                            <td colSpan={10} className="p-0">
                              <DetectionRowDetail detection={det} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
