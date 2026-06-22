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
    <div className="flex flex-col h-full w-full overflow-hidden bg-bg">
      <div className="flex-1 flex flex-col min-w-0 min-h-0">

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </main>
      </div>
      
      {/* 4. INSPECTOR PANEL (We can add this later or wrap children inside another grid if needed, but keeping it flexible) */}
    </div>
  );
}
