"use client";

import { useState, useEffect } from "react";
import { Clock, FolderOpen, Plus } from "lucide-react";
import { MOCK_CASES, type Case, type CaseStatus, updateCaseStatus } from "@/lib/data-access/cases";
import { SeverityPill } from "@/components/ui/severity-pill";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO, addHours, isPast } from "date-fns";
import { toast } from "sonner";

// ── SLA Countdown ─────────────────────────────────────────────────────────────
function SlaCountdown({ createdAt, slaHours }: { createdAt: string; slaHours: number }) {
  const deadline = addHours(parseISO(createdAt), slaHours);
  const expired = isPast(deadline);
  const remaining = formatDistanceToNow(deadline, { addSuffix: true });

  return (
    <div className={cn(
      "flex items-center gap-1 text-[10px]",
      expired ? "text-danger" : slaHours <= 4 ? "text-orange" : "text-muted",
    )}>
      <Clock className="h-3 w-3 shrink-0" />
      <span>{expired ? "SLA expired" : remaining}</span>
    </div>
  );
}

// ── Case Card ─────────────────────────────────────────────────────────────────
function CaseCard({ case: c, onDragStart }: { case: Case; onDragStart: (id: string) => void }) {
  const SOURCE_LABEL: Record<string, string> = {
    email: "Email",
    sandbox: "Sandbox",
    detection_rule: "Detection Rule",
    manual: "Manual",
  };

  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("caseId", c.id); onDragStart(c.id); }}
      className="group cursor-grab rounded-xl border border-border bg-linear-to-b from-fg/5 to-surface p-3.5 shadow-sm transition-all hover:border-border-hover hover:shadow-md active:cursor-grabbing active:opacity-80 active:scale-95"
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-dimmed">{c.id}</span>
        <SeverityPill severity={c.severity} size="xs" showDot={false} />
      </div>

      {/* Title */}
      <p className="text-[12px] font-medium text-fg leading-snug line-clamp-2">{c.title}</p>

      {/* Tags */}
      {c.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {c.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded bg-fg/5 px-1.5 py-px text-[9px] text-dimmed">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Source badge */}
          <span className="rounded bg-fg/5 px-1.5 py-px text-[9px] text-dimmed">
            {SOURCE_LABEL[c.source]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <SlaCountdown createdAt={c.createdAt} slaHours={c.slaDeadlineHours} />
          {/* Assignee avatar */}
          <div className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold",
            c.assigneeInitials === "?" ? "bg-border text-dimmed" : "bg-accent/20 text-accent",
          )}>
            {c.assigneeInitials}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Kanban Column ─────────────────────────────────────────────────────────────
const COLUMN_CONFIG: Record<CaseStatus, { label: string; color: string; headerColor: string }> = {
  new:         { label: "New",         color: "border-accent/30",   headerColor: "text-accent" },
  in_progress: { label: "In Progress", color: "border-info/30",     headerColor: "text-info" },
  pending:     { label: "Pending",     color: "border-warning/30",  headerColor: "text-warning" },
  resolved:    { label: "Resolved",    color: "border-success/30",  headerColor: "text-success" },
  closed:      { label: "Closed",      color: "border-border",      headerColor: "text-muted" },
};

function KanbanColumn({
  status,
  cases,
  onDrop,
  dragOverStatus,
  setDragOverStatus,
}: {
  status: CaseStatus;
  cases: Case[];
  onDrop: (caseId: string, targetStatus: CaseStatus) => void;
  dragOverStatus: CaseStatus | null;
  setDragOverStatus: (s: CaseStatus | null) => void;
}) {
  const config = COLUMN_CONFIG[status];
  const isDragOver = dragOverStatus === status;
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border-2 transition-colors",
        isDragOver ? config.color : "border-transparent",
        "min-h-80",
      )}
      onDragOver={(e) => { e.preventDefault(); setDragOverStatus(status); }}
      onDragLeave={() => setDragOverStatus(null)}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("caseId");
        if (id) onDrop(id, status);
        setDragOverStatus(null);
      }}
    >
      {/* Column header */}
      <div className={cn(
        "flex items-center justify-between rounded-t-lg px-3 py-2.5 mb-2",
        isDragOver ? "bg-fg/5" : "bg-fg/3",
      )}>
        <div className="flex items-center gap-2">
          <span className={cn("text-[11px] font-semibold", config.headerColor)}>{config.label}</span>
          <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-fg/8 px-1 text-[10px] font-medium text-muted">
            {cases.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className={cn(
        "flex flex-col gap-2 flex-1 rounded-b-lg px-1 py-1 transition-colors",
        isDragOver && "bg-fg/5",
      )}>
        {cases.map((c) => (
          <CaseCard key={c.id} case={c} onDragStart={(id) => setDraggingId(id)} />
        ))}
        {cases.length === 0 && !isDragOver && (
          <div className="flex flex-1 items-center justify-center py-8 text-[11px] text-dimmed">
            Drop cases here
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const COLUMN_ORDER: CaseStatus[] = ["new", "in_progress", "pending", "resolved", "closed"];

export default function CasesBoardPage() {
  const [cases, setCases] = useState<Case[]>(MOCK_CASES);
  const [dragOverStatus, setDragOverStatus] = useState<CaseStatus | null>(null);

  const handleDrop = async (caseId: string, targetStatus: CaseStatus) => {
    const c = cases.find((x) => x.id === caseId);
    if (!c || c.status === targetStatus) return;
    setCases((prev) => prev.map((x) => x.id === caseId ? { ...x, status: targetStatus } : x));
    await updateCaseStatus(caseId, targetStatus);
    toast.success(`Case ${caseId} moved to ${COLUMN_CONFIG[targetStatus].label}`);
  };

  const grouped = COLUMN_ORDER.reduce((acc, status) => {
    acc[status] = cases.filter((c) => c.status === status);
    return acc;
  }, {} as Record<CaseStatus, Case[]>);

  return (
    <div className="mx-auto w-full px-6 py-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="dm-heading text-xl text-fg">Case Board</h1>
          <p className="mt-1 text-xs text-muted">{cases.length} total cases · Drag to update status</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-fg px-3.5 py-1.5 text-xs font-medium text-bg hover:opacity-90">
          <Plus className="h-3.5 w-3.5" />
          New Case
        </button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-5 gap-3">
        {COLUMN_ORDER.map((status) => (
          <div key={status} className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-4 py-3">
            <div className={cn("font-display text-xl font-bold", COLUMN_CONFIG[status].headerColor)}>
              {grouped[status].length}
            </div>
            <div className="mt-0.5 text-[11px] text-muted">{COLUMN_CONFIG[status].label}</div>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${COLUMN_ORDER.length}, minmax(240px, 1fr))` }}>
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            cases={grouped[status]}
            onDrop={handleDrop}
            dragOverStatus={dragOverStatus}
            setDragOverStatus={setDragOverStatus}
          />
        ))}
      </div>
    </div>
  );
}
