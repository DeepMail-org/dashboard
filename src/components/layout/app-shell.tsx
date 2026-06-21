"use client";

import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout-store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
	const collapsed = useLayoutStore((s) => s.sidebarCollapsed);

	return (
		<div className="flex h-screen w-full overflow-hidden">
			{/* Desktop sidebar */}
			<div className="hidden md:block">
				<Sidebar />
			</div>

			{/* Mobile nav overlay */}
			<MobileNav />

			{/* Main content area */}
			<div
				className={cn(
					"flex flex-1 flex-col min-h-0 overflow-hidden transition-[margin-left] duration-200 ease-out",
					"md:ml-[250px]",
					collapsed && "md:ml-[72px]",
				)}
			>
				<Topbar />
				<main className="flex flex-1 flex-col overflow-hidden min-h-0 bg-[#0a0c10]">
					{children}
				</main>
			</div>
		</div>
	);
}
