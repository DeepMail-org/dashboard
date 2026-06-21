import { useMailStore } from "@/stores/mail-store";
import { 
  Inbox, Send, File, AlertTriangle, Trash2, 
  Star, AlertCircle, Tag, SquarePen, Activity, Hash, Plus, CheckSquare, X, Paperclip, Mic, Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const FOLDERS = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 99 },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: File, count: 4 },
  { id: "spam", label: "Spam", icon: AlertTriangle, count: 12 },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const VIEWS = [
  { id: "threats", label: "Threats", icon: Activity, count: 24 },
  { id: "starred", label: "Starred", icon: Star },
  { id: "important", label: "Important", icon: AlertCircle },
];

const LABELS = [
  { id: "promotional", label: "Promotional", color: "text-blue-400" },
  { id: "social", label: "Social", color: "text-pink-400" },
  { id: "health", label: "Health", color: "text-green-400" },
  { id: "bec", label: "BEC", color: "text-danger" },
  { id: "phishing", label: "Phishing", color: "text-orange" },
];

export function MailSidebar() {
  const filters = useMailStore((s) => s.filters);
  const setFilters = useMailStore((s) => s.setFilters);
  const setComposeState = useMailStore((s) => s.setComposeState);

  const resetFilters = { severity: [], labels: [], starred: false, important: false, hasAttachments: false };

  return (
    <div className="flex h-full flex-col border-r border-border py-4 relative">
      <div className="px-4 mb-6">
        <button 
          onClick={() => setComposeState("open")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-fg px-4 py-2 text-sm font-medium text-bg hover:bg-fg/90 transition-colors"
        >
          <SquarePen className="h-4 w-4" />
          Compose
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-6">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Mail</p>
          <div className="space-y-0.5">
            {FOLDERS.map((folder) => {
              const active = filters.folder === folder.id && filters.severity.length === 0 && filters.labels.length === 0 && !filters.starred && !filters.important;
              return (
                <button
                  key={folder.id}
                  onClick={() => setFilters({ folder: folder.id, ...resetFilters })}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                    active ? "bg-accent/15 text-accent" : "text-secondary hover:bg-surface-hover hover:text-fg"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <folder.icon className={cn("h-4 w-4", active ? "text-accent" : "text-muted")} />
                    {folder.label}
                  </div>
                  {folder.count && (
                    <span className={cn("text-[10px]", active ? "text-accent" : "text-muted")}>
                      {folder.count}{folder.count > 90 ? "+" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Smart Views</p>
          <div className="space-y-0.5">
            {VIEWS.map((view) => {
              const active = 
                (view.id === "threats" && filters.severity.includes("critical")) ||
                (view.id === "starred" && filters.starred) ||
                (view.id === "important" && filters.important);

              return (
                <button
                  key={view.id}
                  onClick={() => {
                    if (view.id === "threats") setFilters({ folder: "all", ...resetFilters, severity: ["critical", "high"] });
                    if (view.id === "starred") setFilters({ folder: "all", ...resetFilters, starred: true });
                    if (view.id === "important") setFilters({ folder: "all", ...resetFilters, important: true });
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                    active ? "bg-accent/15 text-accent" : "text-secondary hover:bg-surface-hover hover:text-fg"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <view.icon className={cn("h-4 w-4", active ? "text-accent" : "text-muted")} />
                    {view.label}
                  </div>
                  {view.count && (
                    <span className={cn("text-[10px]", active ? "text-accent" : "text-muted")}>
                      {view.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Labels</p>
            <button className="text-muted hover:text-fg transition-colors"><Plus className="h-3.5 w-3.5" /></button>
          </div>
          <div className="space-y-0.5">
            {LABELS.map((label) => {
              const active = filters.labels.includes(label.id);
              return (
                <button
                  key={label.id}
                  onClick={() => {
                    setFilters({ folder: "all", ...resetFilters, labels: [label.id] });
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors text-secondary hover:bg-surface-hover hover:text-fg",
                    active && "bg-fg/5 text-fg"
                  )}
                >
                  <Hash className={cn("h-3.5 w-3.5", label.color)} />
                  {label.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
