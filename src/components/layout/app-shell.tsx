"use client";

import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout-store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile nav overlay */}
      <MobileNav />

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-[margin-left] duration-200 ease-out",
          "md:ml-[250px]",
          collapsed && "md:ml-[72px]",
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
