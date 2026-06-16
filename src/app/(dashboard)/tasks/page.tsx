"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, X, Play, RefreshCw, Terminal, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { MOCK_TASKS, cancelTask, retryTask, type Task, type TaskStatus, type TaskType } from "@/lib/data-access/tasks";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { toast } from "sonner";

const TYPE_ICON: Record<TaskType, React.ElementType> = {
  scan:    Terminal,
  sandbox: Terminal,
  report:  Terminal,
  sync:    RefreshCw,
  cleanup: Terminal,
  train:   Play,
};

const TYPE_COLOR: Record<TaskType, string> = {
  scan:    "text-info",
  sandbox: "text-warning",
  report:  "text-accent",
  sync:    "text-success",
  cleanup: "text-muted",
  train:   "text-orange",
};

function ProgressBar({ value, status }: { value: number; status: TaskStatus }) {
  const color =
    status === "failed" ? "bg-danger" :
    status === "completed" ? "bg-success" :
    status === "running" ? "bg-accent" :
    "bg-muted";

  return (
    <div className="w-full rounded-full bg-fg/10 h-1.5 overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-500", color, status === "running" && "animate-pulse")}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function TaskRow({ task, onCancel, onRetry }: {
  task: Task;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  const Icon = TYPE_ICON[task.type];

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-linear-to-b from-fg/5 to-surface p-4 transition-colors hover:border-border-hover">
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface", TYPE_COLOR[task.type])}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[13px] font-medium text-fg leading-snug">{task.name}</p>
              <p className="mt-0.5 text-[11px] text-muted">{task.description}</p>
            </div>
            <StatusBadge status={task.status as "running" | "completed" | "failed" | "pending"} />
          </div>

          {/* Progress bar */}
          {(task.status === "running" || task.status === "completed") && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-muted">Progress</span>
                <span className="font-mono text-[10px] text-muted">{task.progress}%</span>
              </div>
              <ProgressBar value={task.progress} status={task.status} />
            </div>
          )}

          {/* Error message */}
          {task.status === "failed" && task.error && (
            <div className="mt-2 rounded-md border border-danger/20 bg-danger/5 px-3 py-2">
              <div className="flex items-start gap-1.5">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
                <p className="font-mono text-[10px] text-danger break-all">{task.error}</p>
              </div>
            </div>
          )}

          {/* Metadata row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-dimmed">
            <span className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {formatDistanceToNow(parseISO(task.createdAt), { addSuffix: true })}
            </span>
            <span>·</span>
            <span>Triggered by <span className="text-muted">{task.triggeredBy}</span></span>
            {task.durationSec && (
              <>
                <span>·</span>
                <span>Duration: <span className="text-muted">{Math.floor(task.durationSec / 60)}m {task.durationSec % 60}s</span></span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {task.status === "running" && (
            <button
              onClick={() => onCancel(task.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-danger/10 hover:text-danger"
              title="Cancel task"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {task.status === "failed" && (
            <button
              onClick={() => onRetry(task.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent/10 hover:text-accent"
              title="Retry task"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const handleCancel = async (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "failed" as TaskStatus, error: "Cancelled by user" } : t));
    await cancelTask(id);
    toast.success("Task cancelled");
  };

  const handleRetry = async (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "pending" as TaskStatus, progress: 0, error: undefined } : t));
    await retryTask(id);
    toast.success("Task queued for retry");
  };

  const FILTERS: Array<{ key: TaskStatus | "all"; label: string }> = [
    { key: "all", label: "All" },
    { key: "running", label: "Running" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "failed", label: "Failed" },
  ];

  const stats = {
    running: tasks.filter((t) => t.status === "running").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    failed: tasks.filter((t) => t.status === "failed").length,
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="dm-heading text-xl text-fg">Tasks & Jobs</h1>
          <p className="mt-1 text-xs text-muted">Background pipeline operations and scheduled jobs</p>
        </div>
        <button className="flex items-center gap-2 rounded-md border border-border bg-surface px-3.5 py-1.5 text-xs text-secondary hover:bg-surface-hover">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          { label: "Running", value: stats.running, color: "text-info" },
          { label: "Pending", value: stats.pending, color: "text-warning" },
          { label: "Completed", value: stats.completed, color: "text-success" },
          { label: "Failed", value: stats.failed, color: "text-danger" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-4 py-3">
            <div className={cn("font-display text-2xl font-bold", s.color)}>{s.value}</div>
            <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 border-b border-border">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-2 text-[12px] transition-colors",
              filter === f.key
                ? "border-b-2 border-accent text-fg"
                : "text-muted hover:text-fg",
            )}
          >
            {f.label}
            <span className={cn(
              "ml-1.5 rounded-full px-1.5 py-px text-[9px] font-bold",
              filter === f.key ? "bg-accent/20 text-accent" : "bg-fg/8 text-dimmed",
            )}>
              {f.key === "all" ? tasks.length : tasks.filter((t) => t.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map((task) => (
          <TaskRow key={task.id} task={task} onCancel={handleCancel} onRetry={handleRetry} />
        ))}
      </div>
    </div>
  );
}
