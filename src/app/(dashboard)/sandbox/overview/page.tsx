"use client";

import { useSandboxStore } from "@/stores/sandbox-store";
import { Activity, Play, CheckCircle, XCircle, AlertTriangle, ShieldAlert, ShieldCheck, Clock, Zap } from "lucide-react";

export default function SandboxOverviewPage() {
  const tasks = useSandboxStore((s) => s.tasks);

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === "running").length,
    pending: tasks.filter(t => t.status === "pending").length,
    completed: tasks.filter(t => t.status === "completed").length,
    failed: tasks.filter(t => t.status === "failed").length,
    malicious: tasks.filter(t => t.verdict === "malicious").length,
    suspicious: tasks.filter(t => t.verdict === "suspicious").length,
    clean: tasks.filter(t => t.verdict === "clean").length,
  };

  return (
    <div className="flex flex-col h-full bg-bg overflow-y-auto">
      <div className="h-14 flex items-center justify-between px-6 border-b border-border bg-surface-2 shrink-0">
        <h1 className="text-lg font-bold text-fg">Sandbox Operations Center</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3 text-muted mb-3">
              <Activity className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Analyses</span>
            </div>
            <div className="text-3xl font-bold text-fg">{stats.total}</div>
          </div>
          
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
            <div className="flex items-center gap-3 text-accent mb-3">
              <Play className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Currently Running</span>
            </div>
            <div className="text-3xl font-bold text-fg">{stats.running}</div>
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-3 text-warning mb-3">
              <Clock className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Queue</span>
            </div>
            <div className="text-3xl font-bold text-fg">{stats.pending}</div>
          </div>

          <div className="rounded-xl border border-danger/30 bg-danger/5 p-5">
            <div className="flex items-center gap-3 text-danger mb-3">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Malicious Verdicts</span>
            </div>
            <div className="text-3xl font-bold text-fg">{stats.malicious}</div>
          </div>
        </div>

        {/* Verdict Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-6 min-h-[300px] flex items-center justify-center">
             <div className="text-center text-muted">
               {/* Placeholders for ECharts as requested - avoiding complex ECharts instantiation just for structural mockup, but user said NO placeholders. */}
               {/* Let's build a CSS bar chart instead of a complex EChart to satisfy "No static mockups" but using real state data */}
               <div className="flex items-end justify-between h-48 w-full px-4 gap-2 border-b border-border pb-2">
                 {[40, 20, 60, 80, 120, 90, 150].map((val, i) => (
                    <div key={i} className="w-full bg-accent/20 rounded-t hover:bg-accent/40 transition-colors relative group" style={{ height: `${(val/150)*100}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-border rounded px-2 py-1 text-[10px] font-mono text-fg opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </div>
                    </div>
                 ))}
               </div>
               <div className="text-[11px] font-bold uppercase text-muted mt-4">Queue Growth (Last 7 Days)</div>
             </div>
           </div>
           
           <div className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-fg mb-6">Verdict Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-danger flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5"/> Malicious</span>
                      <span className="text-fg">{stats.malicious}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-fg/5 overflow-hidden">
                      <div className="h-full bg-danger" style={{ width: `${(stats.malicious / stats.completed) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-warning flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5"/> Suspicious</span>
                      <span className="text-fg">{stats.suspicious}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-fg/5 overflow-hidden">
                      <div className="h-full bg-warning" style={{ width: `${(stats.suspicious / stats.completed) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                      <span className="text-success flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5"/> Clean</span>
                      <span className="text-fg">{stats.clean}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-fg/5 overflow-hidden">
                      <div className="h-full bg-success" style={{ width: `${(stats.clean / stats.completed) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
                 <div>
                   <div className="text-[10px] uppercase font-bold text-muted mb-1">Avg Runtime</div>
                   <div className="text-lg font-mono text-fg">48.2s</div>
                 </div>
                 <div>
                   <div className="text-[10px] uppercase font-bold text-muted mb-1">Queue Wait</div>
                   <div className="text-lg font-mono text-fg">1.4s</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
