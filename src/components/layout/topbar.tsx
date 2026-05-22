"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Menu, Plus, Lock, Unlock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout-store";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/mail-inbox": "Mail Inbox",
  "/cases": "Cases",
  "/cases/board": "Case Board",
  "/detections": "Detections",
  "/sandbox": "Sandbox",
  "/log-explorer": "Log Explorer",
  "/graph-analysis": "Graph Analysis",
  "/marketplace": "Marketplace",
  "/billing": "Usage",
  "/settings": "Settings",
  "/reports": "Reports",
  "/threat-intel": "Threat Intel",
};

export function Topbar() {
  const pathname = usePathname();
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed);
  const setMobileOpen = useLayoutStore((s) => s.setMobileOpen);
  const title = ROUTE_TITLES[pathname] ?? "DeepMail";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border px-6",
        "dm-glass",
      )}
    >
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-fg hover:bg-white/[0.05] md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Page title */}
      <h1 className="dm-heading text-[15px] text-fg">{title}</h1>

      <div className="flex-1" />

      {/* Search trigger — opens command palette */}
      <button
        onClick={() => useLayoutStore.getState().setCommandOpen(true)}
        className="relative hidden h-8 w-64 items-center gap-2 rounded-md border border-border bg-surface-2 pl-9 pr-3 text-xs text-dimmed transition-colors hover:border-accent/40 hover:text-muted md:flex"
      >
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <span>Search... (⌘K)</span>
      </button>

      {/* Notification bell */}
      <button className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-fg hover:bg-white/[0.05]">
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
      </button>

      {/* User avatar */}
      <Avatar className="h-8 w-8 border border-border">
        <AvatarFallback className="bg-surface-2 text-xs font-medium text-muted">
          VJ
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
