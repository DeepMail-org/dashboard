"use client";

import { useState, DragEvent } from "react";
import Link from "next/link";
import { Plus, List, Filter } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low";
type CaseStatus = "new" | "investigating" | "containment" | "resolved";

interface CaseCard {
  id: string;
  title: string;
  severity: Severity;
  type: string;
  assignee: { initials: string; name: string };
  time: string;
  status: CaseStatus;
}

const SEV_BADGE: Record<Severity, string> = {
  critical: "text-danger bg-danger/10 border border-danger/20",
  high: "text-orange bg-orange/10 border border-orange/20",
  medium: "text-warning bg-warning/10 border border-warning/20",
  low: "text-muted bg-fg/5 border border-border",
};

const SEV_DOT: Record<Severity, string> = {
  critical: "bg-danger",
  high: "bg-orange",
  medium: "bg-warning",
  low: "bg-muted",
};

const COLUMN_CONFIG: { key: CaseStatus; label: string; dotColor: string; dotGlow: string }[] = [
  { key: "new", label: "New", dotColor: "bg-blue-500", dotGlow: "shadow-[0_0_6px_rgba(59,130,246,0.5)]" },
  { key: "investigating", label: "Investigating", dotColor: "bg-accent", dotGlow: "shadow-[0_0_6px_rgba(168,85,247,0.5)]" },
  { key: "containment", label: "Containment", dotColor: "bg-orange", dotGlow: "shadow-[0_0_6px_rgba(249,115,22,0.5)]" },
  { key: "resolved", label: "Resolved", dotColor: "bg-success", dotGlow: "shadow-[0_0_6px_rgba(16,185,129,0.5)]" },
];

const INITIAL_CARDS: CaseCard[] = [
  { id: "CAS-8824", title: "Suspicious OAuth token request from unknown app", severity: "high", type: "Phishing", assignee: { initials: "AK", name: "Amit K" }, time: "5m ago", status: "new" },
  { id: "CAS-8823", title: "Bulk credential harvesting via fake SSO portal", severity: "critical", type: "Phishing", assignee: { initials: "JR", name: "Jane R" }, time: "12m ago", status: "new" },
  { id: "CAS-8822", title: "Anomalous mail forwarding rule created", severity: "medium", type: "BEC", assignee: { initials: "TS", name: "Tom S" }, time: "34m ago", status: "new" },
  { id: "CAS-8821", title: "BEC attempt — wire transfer request to finance@", severity: "critical", type: "BEC", assignee: { initials: "MK", name: "Mike K" }, time: "45m ago", status: "investigating" },
  { id: "CAS-8819", title: "Malware payload in .iso attachment (Emotet variant)", severity: "critical", type: "Malware", assignee: { initials: "AK", name: "Amit K" }, time: "1h ago", status: "investigating" },
  { id: "CAS-8817", title: "Spearphishing campaign targeting C-suite", severity: "high", type: "Phishing", assignee: { initials: "JR", name: "Jane R" }, time: "2h ago", status: "investigating" },
  { id: "CAS-8815", title: "QR code phishing in PDF attachment", severity: "medium", type: "Phishing", assignee: { initials: "TS", name: "Tom S" }, time: "3h ago", status: "investigating" },
  { id: "CAS-8814", title: "Compromised mailbox — lateral phishing detected", severity: "critical", type: "Data Exfil", assignee: { initials: "MK", name: "Mike K" }, time: "4h ago", status: "containment" },
  { id: "CAS-8812", title: "Data exfiltration via auto-forward to external domain", severity: "high", type: "Data Exfil", assignee: { initials: "AK", name: "Amit K" }, time: "6h ago", status: "containment" },
  { id: "CAS-8810", title: "False positive — internal security test email", severity: "low", type: "Phishing", assignee: { initials: "JR", name: "Jane R" }, time: "8h ago", status: "resolved" },
  { id: "CAS-8808", title: "Credential phish blocked — user reported", severity: "medium", type: "Phishing", assignee: { initials: "TS", name: "Tom S" }, time: "12h ago", status: "resolved" },
  { id: "CAS-8806", title: "Spam wave from compromised partner domain", severity: "low", type: "Malware", assignee: { initials: "MK", name: "Mike K" }, time: "1d ago", status: "resolved" },
];

function DropIndicator({ beforeId, column }: { beforeId: string | null; column: CaseStatus }) {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full rounded bg-accent opacity-0"
    />
  );
}

function KanbanCard({ card, onDragStart }: { card: CaseCard; onDragStart: (e: DragEvent, card: CaseCard) => void }) {
  const isResolved = card.status === "resolved";
  return (
    <>
      <DropIndicator beforeId={card.id} column={card.status} />
      <div
        draggable="true"
        onDragStart={(e) => onDragStart(e, card)}
        className={`cursor-grab rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-border-hover hover:bg-surface-hover active:cursor-grabbing ${
          isResolved ? "opacity-60" : ""
        }`}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted">{card.id}</span>
          <span className={`rounded px-1.5 py-px text-[9px] font-semibold uppercase ${SEV_BADGE[card.severity]}`}>
            {card.severity}
          </span>
        </div>
        <div className="mb-2.5 text-xs leading-relaxed text-secondary">{card.title}</div>
        <div className="flex items-center justify-between">
          <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">
            {card.type}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-dimmed">{card.time}</span>
            <div
              className="grid h-5 w-5 place-items-center rounded-full bg-accent/20 text-[9px] font-semibold text-accent"
              title={card.assignee.name}
            >
              {card.assignee.initials}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function KanbanColumn({
  config,
  cards,
  setCards,
  allCards,
}: {
  config: (typeof COLUMN_CONFIG)[number];
  cards: CaseCard[];
  setCards: (cards: CaseCard[]) => void;
  allCards: CaseCard[];
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CaseCard) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(document.querySelectorAll(`[data-column="${config.key}"]`) as unknown as HTMLElement[]);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => { i.style.opacity = "0"; });
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + 50);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: indicators[indicators.length - 1] },
    );
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(true);
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const handleDragLeave = () => {
    clearHighlights();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setDragActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...allCards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, status: config.key };
      copy = copy.filter((c) => c.id !== cardId);

      if (before === "-1") {
        copy.push(cardToTransfer);
      } else {
        const insertAt = copy.findIndex((el) => el.id === before);
        if (insertAt !== -1) copy.splice(insertAt, 0, cardToTransfer);
        else copy.push(cardToTransfer);
      }
      setCards(copy);
    }
  };

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`h-2 w-2 rounded-full ${config.dotColor} ${config.dotGlow}`} />
          <span className="text-sm font-medium text-fg">{config.label}</span>
        </div>
        <span className="rounded-full bg-fg/5 px-2 py-0.5 font-mono text-[10px] text-muted">
          {cards.length}
        </span>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-1 flex-col gap-0 overflow-y-auto rounded-lg p-1 transition-colors ${
          dragActive ? "bg-accent/5" : ""
        }`}
      >
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={config.key} />
      </div>
    </div>
  );
}

export default function CaseBoardPage() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [showFilter, setShowFilter] = useState(false);

  const resolvedCount = cards.filter((c) => c.status === "resolved").length;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-8 py-4">
        <div>
          <h1 className="font-display text-lg font-medium text-fg">Case Board</h1>
          <p className="text-[11px] text-muted">
            {resolvedCount} of {cards.length} resolved · Updated just now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
              showFilter
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-border text-muted hover:bg-surface-hover hover:text-fg"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <Link
            href="/cases"
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-fg"
          >
            <List className="h-3.5 w-3.5" />
            List View
          </Link>
          <button className="flex items-center gap-2 rounded-md bg-fg px-4 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90">
            <Plus className="h-3.5 w-3.5" />
            New Case
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex flex-1 gap-5 overflow-x-auto p-6">
        {COLUMN_CONFIG.map((col) => {
          const columnCards = cards.filter((c) => c.status === col.key);
          return (
            <KanbanColumn
              key={col.key}
              config={col}
              cards={columnCards}
              setCards={setCards}
              allCards={cards}
            />
          );
        })}
      </div>
    </div>
  );
}
