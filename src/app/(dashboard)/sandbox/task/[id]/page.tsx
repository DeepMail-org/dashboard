"use client";

import { useSandboxStore } from "@/stores/sandbox-store";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";
import { ArrowLeft, Play, XSquare, RotateCcw, Monitor, Activity, Network, HardDrive, Bug, ShieldAlert, Clock, FolderArchive, Settings2, ShieldCheck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SandboxTerminal } from "@/components/sandbox/sandbox-terminal";
import { SandboxConfigPanel } from "@/components/sandbox/sandbox-config";
import { SandboxTaskDetail, TABS } from "@/components/sandbox/sandbox-task-detail";

import { PageWrapper } from "@/components/layout/page-wrapper";

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const activeTab = searchParams.get("tab") || "overview";

  const task = useSandboxStore((s) => s.tasks.find((t) => t.id === taskId));
  const updateStatus = useSandboxStore((s) => s.updateTaskStatus);

  // If task doesn't exist, redirect back to queue
  useEffect(() => {
    if (!task) {
      router.replace("/sandbox/queue");
    }
  }, [task, router]);

  if (!task) return null;

  return (
    <PageWrapper noPadding>
      <div className="flex flex-col h-full bg-bg overflow-hidden max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-surface-2 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/sandbox/queue")}
            className="p-1.5 rounded-lg border border-border bg-surface text-muted hover:text-fg hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-fg flex items-center gap-2">
              {task.name}
              {task.status === "completed" && task.verdict === "malicious" && (
                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-danger/10 text-danger border border-danger/30">Malicious</span>
              )}
              {task.status === "completed" && task.verdict === "clean" && (
                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-success/10 text-success border border-success/30">Clean</span>
              )}
              {task.status === "running" && (
                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-accent/10 text-accent border border-accent/30 animate-pulse">Running</span>
              )}
            </h1>
            <span className="text-[10px] font-mono text-muted">{task.id} • {task.tenant}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.status === "pending" && (
            <>
              <button onClick={() => updateStatus(task.id, "CANCEL")} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface border border-border text-[11px] font-medium hover:bg-surface-hover">
                <XSquare className="h-3.5 w-3.5" /> Cancel
              </button>
              <button onClick={() => updateStatus(task.id, "LAUNCH")} className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-accent text-[11px] font-bold text-white hover:bg-accent/90 shadow">
                <Play className="h-3.5 w-3.5" /> Launch
              </button>
            </>
          )}
          {(task.status === "completed" || task.status === "failed") && (
            <button onClick={() => updateStatus(task.id, "RETRY")} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface border border-border text-[11px] font-medium hover:bg-surface-hover">
              <RotateCcw className="h-3.5 w-3.5" /> Re-analyze
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center px-6 border-b border-border bg-surface shrink-0 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(`/sandbox/task/${task.id}?tab=${tab.id}`)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-[12px] font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id 
                ? "border-accent text-accent" 
                : "border-transparent text-muted hover:text-fg hover:border-border"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-bg">
        {activeTab === "overview" && (
          <div className="h-full overflow-y-auto p-6">
             <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                   <div className="rounded-xl border border-border bg-surface p-6">
                     <h3 className="text-sm font-bold text-fg mb-4">Executive Summary</h3>
                     <p className="text-sm text-muted leading-relaxed">
                       This sample was submitted by <strong>{task.owner}</strong> on {new Date(task.createdAt).toLocaleString()}. 
                       {task.status === "completed" 
                         ? ` The analysis finished after 47s execution. DeepMail ML models classified this file as ${task.verdict?.toUpperCase()} with ${task.confidence}% confidence. It generated ${task.iocCount} high-fidelity IOCs.`
                         : " The analysis is currently pending or running."}
                     </p>
                   </div>
                   
                   {task.status === "pending" && (
                     <div className="h-96">
                       <SandboxConfigPanel task={task} />
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
        <SandboxTaskDetail task={task} activeTab={activeTab} />
      </div>
      </div>
    </PageWrapper>
  );
}
