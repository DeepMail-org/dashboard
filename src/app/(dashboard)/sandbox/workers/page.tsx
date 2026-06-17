"use client";

import { useSandboxStore } from "@/stores/sandbox-store";
import { Server, Activity, Power, RefreshCw, Archive, Zap, Cpu, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SandboxWorkersPage() {
  const workers = useSandboxStore((s) => s.workers);

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] overflow-y-auto text-white">
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1115] shrink-0">
        <h1 className="text-lg font-bold text-white">Worker Node Infrastructure</h1>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all">
            <Zap className="h-3.5 w-3.5" /> Provision Node
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <div key={worker.id} className="rounded-2xl border border-white/5 bg-[#0f1115] overflow-hidden shadow-2xl group transition-colors">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
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
                  <h3 className="text-sm font-bold text-gray-200">{worker.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                      "text-[10px] uppercase font-bold",
                      worker.status === "healthy" ? "text-emerald-400" :
                      worker.status === "busy" ? "text-yellow-400" : "text-gray-500"
                    )}>
                      {worker.status}
                    </span>
                    <span className="text-[10px] text-gray-500">• {worker.region}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors" title="Restart">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors" title="Drain">
                  <Archive className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 transition-colors" title="Destroy">
                  <Power className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="p-5 grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5"><Cpu className="h-3 w-3" /> CPU</span>
                  <span className="font-mono text-[11px] text-gray-200">{worker.cpu}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div className={cn("h-full transition-all shadow-[0_0_10px_currentColor]", worker.cpu > 80 ? "bg-rose-500 text-rose-500" : worker.cpu > 50 ? "bg-yellow-400 text-yellow-400" : "bg-emerald-400 text-emerald-400")} style={{ width: `${worker.cpu}%` }} />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1.5"><HardDrive className="h-3 w-3" /> RAM</span>
                  <span className="font-mono text-[11px] text-gray-200">{worker.ram}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div className={cn("h-full transition-all shadow-[0_0_10px_currentColor]", worker.ram > 80 ? "bg-rose-500 text-rose-500" : worker.ram > 50 ? "bg-yellow-400 text-yellow-400" : "bg-emerald-400 text-emerald-400")} style={{ width: `${worker.ram}%` }} />
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="px-5 py-3 border-t border-white/5 bg-[#0a0c10]/50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-gray-500">Queue</span>
                <span className="font-mono text-[12px] font-bold text-gray-200">{worker.queueLength} tasks</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] uppercase font-bold text-gray-500">Latency</span>
                <span className={cn("font-mono text-[12px] font-bold", worker.latency > 50 ? "text-yellow-400" : "text-emerald-400")}>{worker.latency} ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
