"use client";

import { useSandboxStore } from "@/stores/sandbox-store";
import { Server, Activity, Power, RefreshCw, Archive, Zap, Cpu, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SandboxWorkersPage() {
  const workers = useSandboxStore((s) => s.workers);

  return (
    <div className="flex flex-col h-full bg-bg overflow-y-auto">
      <div className="h-14 flex items-center justify-between px-6 border-b border-border bg-surface-2 shrink-0">
        <h1 className="text-lg font-bold text-fg">Worker Node Infrastructure</h1>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-[11px] font-bold text-white hover:bg-accent/90 shadow">
            <Zap className="h-3.5 w-3.5" /> Provision Node
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <div key={worker.id} className="rounded-xl border border-border bg-surface overflow-hidden hover:border-fg/20 transition-colors">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-start justify-between bg-surface-2/50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "grid h-10 w-10 place-items-center rounded-lg border",
                  worker.status === "healthy" ? "border-success/30 bg-success/10 text-success" :
                  worker.status === "busy" ? "border-warning/30 bg-warning/10 text-warning" :
                  "border-muted/30 bg-muted/10 text-muted"
                )}>
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-fg">{worker.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                      "text-[10px] uppercase font-bold",
                      worker.status === "healthy" ? "text-success" :
                      worker.status === "busy" ? "text-warning" : "text-muted"
                    )}>
                      {worker.status}
                    </span>
                    <span className="text-[10px] text-muted">• {worker.region}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button className="p-1.5 rounded hover:bg-surface text-muted hover:text-fg tooltip-trigger" title="Restart">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-surface text-muted hover:text-fg tooltip-trigger" title="Drain">
                  <Archive className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-danger/10 text-muted hover:text-danger tooltip-trigger" title="Destroy">
                  <Power className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="p-5 grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted flex items-center gap-1.5"><Cpu className="h-3 w-3" /> CPU</span>
                  <span className="font-mono text-[11px] text-fg">{worker.cpu}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-fg/10 overflow-hidden">
                  <div className={cn("h-full transition-all", worker.cpu > 80 ? "bg-danger" : worker.cpu > 50 ? "bg-warning" : "bg-success")} style={{ width: `${worker.cpu}%` }} />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted flex items-center gap-1.5"><HardDrive className="h-3 w-3" /> RAM</span>
                  <span className="font-mono text-[11px] text-fg">{worker.ram}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-fg/10 overflow-hidden">
                  <div className={cn("h-full transition-all", worker.ram > 80 ? "bg-danger" : worker.ram > 50 ? "bg-warning" : "bg-success")} style={{ width: `${worker.ram}%` }} />
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="px-5 py-3 border-t border-border bg-bg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-muted">Queue</span>
                <span className="font-mono text-[12px] font-bold text-fg">{worker.queueLength} tasks</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase font-bold text-muted">Latency</span>
                <span className={cn("font-mono text-[12px] font-bold", worker.latency > 50 ? "text-warning" : "text-success")}>{worker.latency} ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
