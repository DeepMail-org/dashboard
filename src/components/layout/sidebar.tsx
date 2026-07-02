"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTree } from "@headless-tree/react";
import { syncDataLoaderFeature } from "@headless-tree/core";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import {
	LayoutDashboard,
	Mail,
	FolderOpen,
	Columns3,
	ShieldAlert,
	Box,
	FileText,
	Rss,
	Activity,
	Settings,
	ChevronLeft,
	ChevronRight,
	Shield,
	Grid3x3,
	Globe,
	List,
	Server,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout-store";

interface NavChild {
	label: string;
	href: string;
	icon: React.ElementType;
}

interface NavItem {
	label: string;
	href: string;
	icon: React.ElementType;
	badge?: string;
	children?: NavChild[];
}

interface NavGroup {
	id: string;
	title: string;
	items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
	{
		id: "general",
		title: "General",
		items: [
			{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
			{
				label: "Mail Inbox",
				href: "/mail-inbox",
				icon: Mail,
				badge: "12",
			},
		],
	},
	{
		id: "security",
		title: "Security",
		items: [
			{
				label: "Cases",
				href: "/cases",
				icon: FolderOpen,
				children: [
					{
						label: "Board View",
						href: "/cases/board",
						icon: Columns3,
					},
				],
			},
			{ label: "Detections", href: "/detections", icon: ShieldAlert },
			{
				label: "Vulnerabilities",
				href: "/vulnerabilities",
				icon: Shield,
			},
			{
				label: "Sandbox",
				href: "/sandbox",
				icon: Box,
				children: [
					{
						label: "Overview",
						href: "/sandbox/overview",
						icon: LayoutDashboard,
					},
					{ label: "Queue", href: "/sandbox/queue", icon: List },
					{
						label: "Workers",
						href: "/sandbox/workers",
						icon: Server,
					},
					{
						label: "Reports",
						href: "/sandbox/reports",
						icon: FileText,
					},
					{
						label: "Settings",
						href: "/sandbox/settings",
						icon: Settings,
					},
				],
			},
			{ label: "Tasks", href: "/tasks", icon: Activity },
		],
	},
	{
		id: "intelligence",
		title: "Intelligence",
		items: [
			{ label: "Log Explorer", href: "/log-explorer", icon: FileText },
			{ label: "Threat Intel", href: "/threat-intel", icon: Rss },
			{ label: "MITRE ATT&CK", href: "/mitre-attack", icon: Grid3x3 },
			{
				label: "Graph Analysis",
				href: "/graph-analysis",
				icon: Activity,
			},
			{ label: "Geo Map", href: "/map", icon: Globe },
		],
	},
	{
		id: "system",
		title: "System",
		items: [{ label: "Settings", href: "/settings", icon: Settings }],
	},
];

function isItemActive(pathname: string, href: string): boolean {
	if (href === "/dashboard") return pathname === "/dashboard";
	return pathname === href || pathname.startsWith(href + "/");
}

function NavTree({
	items,
	pathname,
	collapsed,
}: {
	items: NavItem[];
	pathname: string;
	collapsed: boolean;
}) {
	const tree = useTree<NavItem>({
		features: [syncDataLoaderFeature],
		rootItemId: "root",
		getItemName: (item) => item.getItemData().label,
		isItemFolder: (item) =>
			!!(item.getItemData() as NavItem).children &&
			((item.getItemData() as NavItem).children?.length ?? 0) > 0,
		dataLoader: {
			getItem: (itemId) => {
				if (itemId === "root")
					return {
						label: "Root",
						href: "root",
						icon: () => null,
					} as unknown as NavItem;
				for (const item of items) {
					if (item.href === itemId) return item;
					if (item.children) {
						for (const child of item.children) {
							if (child.href === itemId) return child as NavItem;
						}
					}
				}
				throw new Error("Item not found");
			},
			getChildren: (itemId) => {
				if (itemId === "root") return items.map((i) => i.href);
				for (const item of items) {
					if (item.href === itemId)
						return item.children?.map((c) => c.href) || [];
				}
				return [];
			},
		},
	});

	return (
		<Tree
			tree={tree}
			indent={collapsed ? 0 : 20}
			className="w-full space-y-0.5"
		>
			{tree.getItems().map((itemInstance) => {
				const navItem = itemInstance.getItemData();
				if (navItem.href === "root") return null;

				const Icon = navItem.icon;
				const isActive = isItemActive(pathname, navItem.href);
				const isFolder = itemInstance.isFolder();

				return (
					<TreeItem
						key={itemInstance.getId()}
						item={itemInstance}
						asChild
					>
						<Link
							href={navItem.href}
							title={collapsed ? navItem.label : undefined}
							className={cn(
								"group flex w-full items-center rounded-md text-[13px] transition-colors outline-none",
								isActive
									? "bg-fg/7 text-fg font-medium"
									: "text-muted hover:bg-fg/3 hover:text-secondary",
								collapsed
									? "justify-center px-2 py-1.5"
									: "py-1",
							)}
						>
							<TreeItemLabel
								item={itemInstance}
								className={cn(
									"w-full bg-transparent hover:bg-transparent px-2 py-1.5",
									isActive
										? "bg-transparent text-fg"
										: "text-muted",
									collapsed &&
										"justify-center !px-0 [&>.tree-item-chevron]:hidden",
								)}
							>
								<Icon
									className={cn(
										"shrink-0",
										collapsed ? "h-5 w-5" : "h-4 w-4 mr-2",
									)}
								/>
								{!collapsed && (
									<span className="truncate">
										{navItem.label}
									</span>
								)}
								{!collapsed &&
									"badge" in navItem &&
									navItem.badge && (
										<span className="ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent/20 px-1.5 text-[10px] font-semibold text-accent">
											{navItem.badge}
										</span>
									)}
							</TreeItemLabel>
						</Link>
					</TreeItem>
				);
			})}
		</Tree>
	);
}

export function Sidebar() {
	const pathname = usePathname();
	const collapsed = useLayoutStore((s) => s.sidebarCollapsed);
	const toggleCollapsed = useLayoutStore((s) => s.toggleCollapsed);
	const expandedGroups = useLayoutStore((s) => s.expandedGroups);
	const toggleGroup = useLayoutStore((s) => s.toggleGroup);

	return (
		<aside
			className={cn(
				"fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface",
				"transition-[width] duration-200 ease-out",
				collapsed ? "w-18" : "w-62.5",
			)}
		>
			{/* Brand */}
			<div
				className={cn(
					"flex items-center gap-3 px-5 py-5",
					collapsed && "justify-center px-0",
				)}
			>
				<img
					src="/logo.svg"
					alt="DeepMail"
					className="h-8 w-8 shrink-0"
				/>
				{!collapsed && (
					<span className="font-display text-lg font-semibold text-fg">
						DeepMail
					</span>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
				{NAV_GROUPS.map((group) => (
					<div key={group.id} className="mb-5">
						{!collapsed && (
							<button
								onClick={() => toggleGroup(group.id)}
								className="flex items-center gap-2 dm-caption mb-2 px-3 w-full justify-start hover:text-fg transition-colors"
							>
								<span>{group.title}</span>
								<ChevronRight
									className={cn(
										"h-3.5 w-3.5 shrink-0 ml-auto transition-transform",
										expandedGroups[group.id]
											? "rotate-90"
											: "",
									)}
								/>
							</button>
						)}
						<AnimatePresence initial={false}>
							{(collapsed || expandedGroups[group.id]) && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{
										duration: 0.2,
										ease: "easeOut",
									}}
									className="overflow-hidden"
								>
									<div className="space-y-0.5">
										<NavTree
											items={group.items}
											pathname={pathname}
											collapsed={collapsed}
										/>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				))}
			</nav>

			{/* User section */}
			{!collapsed && (
				<div className="border-t border-border px-4 py-3">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
							VJ
						</div>
						<div className="min-w-0 flex-1">
							<div className="truncate text-[13px] font-medium text-secondary">
								Vyom Jain
							</div>
							<div className="truncate text-[11px] text-muted">
								Admin
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Collapse toggle */}
			<div className="border-t border-border p-3">
				<button
					onClick={toggleCollapsed}
					className={cn(
						"flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted transition-colors hover:text-fg hover:bg-fg/3",
						collapsed && "justify-center px-2",
					)}
				>
					{collapsed ? (
						<ChevronRight className="h-4 w-4 shrink-0" />
					) : (
						<>
							<ChevronLeft className="h-4 w-4 shrink-0" />
							<span>Collapse</span>
						</>
					)}
				</button>
			</div>
		</aside>
	);
}
