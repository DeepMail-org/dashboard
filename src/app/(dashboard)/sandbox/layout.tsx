"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Search, Server, Activity, Database, CloudRain, Bell, RefreshCw, PlayCircle, Workflow } from "lucide-react";

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Redirect /sandbox to /sandbox/overview
  useEffect(() => {
    if (pathname === "/sandbox") {
      router.replace("/sandbox/overview");
    }
  }, [pathname, router]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-bg">
      <div className="flex-1 flex flex-col min-w-0">
        {/* 1. HEADER */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-bg/80 backdrop-blur-xl shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input 
                type="text" 
                placeholder="Search tasks, hashes, IPs, or domains..." 
                className="w-full h-9 bg-surface border border-border rounded-lg pl-9 pr-4 text-sm text-fg focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted/60"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted/60 border border-border rounded px-1.5 py-0.5 bg-bg">
                ⌘K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Infrastructure Status */}
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 tooltip-trigger" title="Worker Pool: Healthy">
                 <Server className="h-3.5 w-3.5 text-muted" />
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
               </div>
               <div className="flex items-center gap-1.5 tooltip-trigger" title="Redis: Connected (2ms)">
                 <Database className="h-3.5 w-3.5 text-muted" />
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
               </div>
               <div className="flex items-center gap-1.5 tooltip-trigger" title="Jetstream: Subscribed">
                 <CloudRain className="h-3.5 w-3.5 text-muted" />
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
               </div>
               <div className="flex items-center gap-1.5 tooltip-trigger" title="WebSockets: Live">
                 <Activity className="h-3.5 w-3.5 text-muted" />
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
               </div>
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-fg transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-fg transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
              </button>
            </div>
            
            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
              <button className="h-8 flex items-center gap-2 px-3 rounded-lg border border-border bg-surface text-[12px] font-medium text-fg hover:bg-surface-hover transition-colors">
                Tenant: Global
              </button>
              <button className="h-8 flex items-center gap-2 px-3 rounded-lg bg-accent text-[12px] font-bold text-white shadow hover:bg-accent/90 transition-colors">
                <PlayCircle className="h-3.5 w-3.5" />
                New Sandbox
              </button>
            </div>
          </div>
        </header>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
      
      {/* 4. INSPECTOR PANEL (We can add this later or wrap children inside another grid if needed, but keeping it flexible) */}
    </div>
  );
}
