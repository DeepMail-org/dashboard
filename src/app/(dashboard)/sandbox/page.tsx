"use client";

import { useSandboxStore, SandboxTaskStatus } from "@/stores/sandbox-store";
import { SandboxConfigPanel } from "@/components/sandbox/sandbox-config";
import { SandboxTerminal } from "@/components/sandbox/sandbox-terminal";
import { File, Clock, Play, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_ICONS: Record<SandboxTaskStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-muted" />,
  running: <Activity className="h-4 w-4 text-accent animate-pulse" />,
  completed: <CheckCircle className="h-4 w-4 text-success" />,
  failed: <XCircle className="h-4 w-4 text-danger" />,
};

const STATUS_STYLES: Record<SandboxTaskStatus, string> = {
  pending: "border-border bg-surface",
  running: "border-accent/40 bg-accent/5",
  completed: "border-success/30 bg-success/5",
  failed: "border-danger/30 bg-danger/5",
};

export default function SandboxPage() {
  const tasks = useSandboxStore((s) => s.tasks);
  const activeTaskId = useSandboxStore((s) => s.activeTaskId);
  const setActiveTask = useSandboxStore((s) => s.setActiveTask);
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left: Task Queue */}
      <div className="w-80 shrink-0 flex flex-col border-r border-border bg-bg">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-bold text-fg">Sandbox Tasks</h2>
          <p className="text-[11px] text-muted mt-1">{tasks.length} tasks in queue</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <AlertTriangle className="h-8 w-8 text-muted/30 mb-2" />
              <p className="text-[12px] font-medium text-muted">No tasks in queue</p>
              <p className="text-[10px] text-muted/60 mt-1">Send a file from the inbox to analyze it.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setActiveTask(task.id)}
                className={cn(
                  "w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
                  STATUS_STYLES[task.status],
                  activeTaskId === task.id ? "ring-2 ring-accent" : "hover:border-fg/20"
                )}
              >
                <div className="mt-0.5 shrink-0 bg-bg p-1.5 rounded-md border border-border shadow-sm">
                  {STATUS_ICONS[task.status]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-fg">{task.name}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted">{task.status}</span>
                    <span className="text-[10px] text-muted/60">
                      {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Dynamic View */}
      <div className="flex flex-1 flex-col overflow-hidden bg-bg">
        {!activeTask ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center text-muted">
              <File className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">Select a task from the queue to view details</p>
            </div>
          </div>
        ) : (
          <>
            {activeTask.status === "pending" && <SandboxConfigPanel task={activeTask} />}
            {activeTask.status === "running" && <SandboxTerminal task={activeTask} />}
            {activeTask.status === "completed" && <SandboxTerminal task={activeTask} />}
            {activeTask.status === "failed" && (
              <div className="flex h-full items-center justify-center">
                <p className="text-danger font-mono text-sm">Execution Failed</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
