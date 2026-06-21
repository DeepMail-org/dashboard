"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Kanban, Clock, FolderOpen } from "lucide-react";
import { SeverityPill } from "@/components/ui/severity-pill";
import { StatusBadge } from "@/components/ui/status-badge";
import { ExportButton } from "@/components/ui/export-button";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_CASES, type CaseStatus } from "@/lib/data-access/cases";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO, addHours, isPast } from "date-fns";

const STATUS_MAP: Record<CaseStatus, "new" | "running" | "pending" | "resolved" | "closed"> = {
  new:         "new",
  in_progress: "running",
  pending:     "pending",
  resolved:    "resolved",
  closed:      "closed",
};

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");

  const filtered = useMemo(() => {
    let d = MOCK_CASES;
    if (statusFilter !== "all") d = d.filter((c) => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter((c) => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
    }
    return d;
  }, [search, statusFilter]);

  const counts = useMemo(() => ({
    all:         MOCK_CASES.length,
    new:         MOCK_CASES.filter((c) => c.status === "new").length,
    in_progress: MOCK_CASES.filter((c) => c.status === "in_progress").length,
    pending:     MOCK_CASES.filter((c) => c.status === "pending").length,
    resolved:    MOCK_CASES.filter((c) => c.status === "resolved").length,
    closed:      MOCK_CASES.filter((c) => c.status === "closed").length,
  }), []);

  const FILTER_TABS: Array<{ key: CaseStatus | "all"; label: string }> = [
    { key: "all",         label: "All" },
    { key: "new",         label: "New" },
    { key: "in_progress", label: "In Progress" },
    { key: "pending",     label: "Pending" },
    { key: "resolved",    label: "Resolved" },
    { key: "closed",      label: "Closed" },
  ];

  return (
    <PageWrapper noPadding>
      <div className="mx-auto w-full px-6 py-6 overflow-y-auto">
        {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="dm-heading text-xl text-fg">Cases</h1>
          <p className="mt-1 text-xs text-muted">{filtered.length} of {MOCK_CASES.length} cases</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/cases/board"
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
          >
            <Kanban className="h-3.5 w-3.5" />
            Board View
          </Link>
          <ExportButton onExport={(fmt) => { void fmt; return new Promise((r) => setTimeout(r, 600)); }} />
          <button className="flex items-center gap-2 rounded-md bg-fg px-3.5 py-1.5 text-xs font-medium text-bg hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            New Case
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {[
          { label: "Open",        value: counts.new + counts.in_progress + counts.pending, color: "text-danger" },
          { label: "New",         value: counts.new,         color: "text-accent" },
          { label: "In Progress", value: counts.in_progress, color: "text-info" },
          { label: "Resolved",    value: counts.resolved,    color: "text-success" },
          { label: "Closed",      value: counts.closed,      color: "text-muted" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-4 py-3 shadow-card">
            <div className={cn("font-display text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="mb-4 flex items-center gap-4 border-b border-border">
        <div className="flex">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "px-3 py-2.5 text-[12px] transition-colors",
                statusFilter === tab.key
                  ? "border-b-2 border-accent text-fg font-medium"
                  : "text-muted hover:text-fg",
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-1 rounded-full px-1.5 py-px text-[9px] font-bold",
                statusFilter === tab.key ? "bg-accent/20 text-accent" : "bg-fg/8 text-dimmed",
              )}>
                {tab.key === "all" ? counts.all : counts[tab.key as CaseStatus]}
              </span>
            </button>
          ))}
        </div>
        <div className="ml-auto mb-1 flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases…"
            className="w-44 bg-transparent text-xs text-fg outline-none placeholder:text-dimmed"
          />
        </div>
      </div>

      {/* Cases table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No cases match your filters"
          description="Try adjusting the status filter or search query."
          icon={FolderOpen}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border shadow-card">
          <table className="w-full text-left">
            <thead>
              <tr>
                {["Case ID", "Severity", "Title", "Assignee", "Status", "SLA", "Source", "Tags"].map((col) => (
                  <th key={col} className="border-b border-border bg-fg/2 px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const deadline = addHours(parseISO(c.createdAt), c.slaDeadlineHours);
                const expired = isPast(deadline);
                return (
                  <tr key={c.id} className="border-b border-fg/5 transition-colors hover:bg-fg/4">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[12px] text-accent">{c.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <SeverityPill severity={c.severity} size="xs" />
                    </td>
                    <td className="max-w-xs px-4 py-3.5">
                      <p className="text-[12px] font-medium text-fg line-clamp-1">{c.title}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold",
                          c.assigneeInitials === "?" ? "bg-border text-dimmed" : "bg-accent/20 text-accent",
                        )}>
                          {c.assigneeInitials}
                        </div>
                        <span className="text-[11px] text-muted">{c.assignee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={STATUS_MAP[c.status]} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={cn(
                        "flex items-center gap-1 text-[10px]",
                        expired ? "text-danger" : c.slaDeadlineHours <= 4 ? "text-orange" : "text-muted",
                      )}>
                        <Clock className="h-3 w-3 shrink-0" />
                        {expired ? "Expired" : formatDistanceToNow(deadline, { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-fg/5 px-2 py-0.5 text-[10px] capitalize text-muted">
                        {c.source.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded bg-fg/5 px-1.5 py-px text-[9px] text-dimmed">{tag}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </PageWrapper>
  );
}
