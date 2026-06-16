"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Mail,
  FolderOpen,
  Columns3,
  ShieldAlert,
  Monitor,
  FileText,
  Rss,
  Activity,
  Store,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Grid3x3,
  Globe,
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
      { label: "Mail Inbox", href: "/mail-inbox", icon: Mail, badge: "12" },
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
        children: [{ label: "Board View", href: "/cases/board", icon: Columns3 }],
      },
      { label: "Detections", href: "/detections", icon: ShieldAlert },
      { label: "Vulnerabilities", href: "/vulnerabilities", icon: Shield },
      { label: "Sandbox", href: "/sandbox", icon: Monitor },
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
      { label: "Graph Analysis", href: "/graph-analysis", icon: Activity },
      { label: "Geo Map", href: "/map", icon: Globe },
    ],
  },
  {
    id: "system",
    title: "System",
    items: [
      { label: "Marketplace", href: "/marketplace", icon: Store },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Usage", href: "/billing", icon: CreditCard },
    ],
  },
];

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  item,
  pathname,
  collapsed,
  indent = false,
  isLastChild = false,
  isChild = false,
}: {
  item: NavItem | NavChild;
  pathname: string;
  collapsed: boolean;
  indent?: boolean;
  isLastChild?: boolean;
  isChild?: boolean;
}) {
  const isActive = isItemActive(pathname, item.href);
  const Icon = item.icon;
  const badge = "badge" in item ? item.badge : undefined;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-md py-1.5 text-[13px] transition-all duration-150",
        collapsed ? "justify-center px-2" : indent ? "pl-11 pr-3" : "px-3",
        isActive
          ? "text-fg bg-white/7"
          : "text-muted hover:text-secondary hover:bg-white/3",
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 h-[60%] w-0.5 -translate-y-1/2 rounded-r-sm bg-accent" />
      )}

      {/* Tree connector for child items */}
      {isChild && !collapsed && (
        <div className="absolute left-5.5 top-0 flex h-full w-4">
          <div
            className={cn(
              "absolute left-0 w-px",
              isLastChild ? "top-0 h-1/2" : "top-0 h-full",
            )}
            style={{ borderLeft: "1px dashed oklch(0.45 0 0 / 0.35)" }}
          />
          <div
            className="absolute left-0 top-1/2 h-px w-3.5"
            style={{ borderTop: "1px dashed oklch(0.45 0 0 / 0.35)" }}
          />
        </div>
      )}

      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {badge && (
            <span className="ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent/20 px-1.5 text-[10px] font-semibold text-accent">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function NavParentItem({
  item,
  pathname,
  collapsed,
  isLast,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  isLast: boolean;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = isItemActive(pathname, item.href);
  const childActive = hasChildren && item.children!.some((c) => isItemActive(pathname, c.href));

  return (
    <div className="relative">
      {/* Tree connector line from parent to children */}
      {hasChildren && !collapsed && (
        <div
          className="absolute left-5.5 top-7.5 bottom-0 w-px"
          style={{ borderLeft: "1px dashed oklch(0.45 0 0 / 0.35)" }}
        />
      )}

      <NavLink item={item} pathname={pathname} collapsed={collapsed} />

      {hasChildren && !collapsed && (
        <div className="relative mt-0.5">
          {item.children!.map((child, idx) => (
            <NavLink
              key={child.href}
              item={child}
              pathname={pathname}
              collapsed={collapsed}
              indent
              isChild
              isLastChild={idx === item.children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#a855f7] to-[#6366f1] shadow-glow">
          <Shield className="h-4 w-4 text-fg" />
        </div>
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
                    expandedGroups[group.id] ? "rotate-90" : ""
                  )}
                />
              </button>
            )}
            <AnimatePresence initial={false}>
              {expandedGroups[group.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5">
                    {group.items.map((item, idx) => (
                      <NavParentItem
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        collapsed={collapsed}
                        isLast={idx === group.items.length - 1}
                      />
                    ))}
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
              <div className="truncate text-[11px] text-muted">Admin</div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={toggleCollapsed}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted transition-colors hover:text-fg hover:bg-white/3",
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
