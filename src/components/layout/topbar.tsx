"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  Plus,
  ChevronDown,
  Building2,
  CheckCircle,
  Zap,
  FolderOpen,
  Monitor,
  Shield,
  FileText,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout-store";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { AnimatePresence, motion } from "framer-motion";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard":         "Dashboard",
  "/mail-inbox":        "Mail Inbox",
  "/cases":             "Cases",
  "/cases/board":       "Case Board",
  "/detections":        "Detections",
  "/sandbox":           "Sandbox",
  "/log-explorer":      "Log Explorer",
  "/graph-analysis":    "Graph Analysis",
  "/marketplace":       "Marketplace",
  "/billing":           "Usage & Billing",
  "/settings":          "Settings",
  "/reports":           "Reports",
  "/threat-intel":      "Threat Intelligence",
  "/mitre-attack":      "MITRE ATT&CK",
  "/vulnerabilities":   "Vulnerabilities",
  "/tasks":             "Tasks",
  "/map":               "Geo Threat Map",
};

const ORGS = [
  { id: "org-1", name: "Acme Corporation", plan: "Enterprise" },
  { id: "org-2", name: "SecureOps Ltd",    plan: "Pro" },
];

const QUICK_ACTIONS = [
  { label: "New Case",          icon: FolderOpen, href: "/cases" },
  { label: "Submit to Sandbox", icon: Monitor,    href: "/sandbox" },
  { label: "New Detection Rule",icon: Shield,     href: "/detections" },
  { label: "New IOC Entry",     icon: FileText,   href: "/threat-intel" },
];

function OrgSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeOrg, setActiveOrg] = useState(ORGS[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden md:flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
      >
        <Building2 className="h-3.5 w-3.5" />
        <span className="max-w-28 truncate">{activeOrg.name}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
          >
            <div className="border-b border-border px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Organizations</p>
            </div>
            {ORGS.map((org) => (
              <button
                key={org.id}
                onClick={() => { setActiveOrg(org); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-[12px] transition-colors",
                  activeOrg.id === org.id ? "bg-accent/10 text-accent" : "text-secondary hover:bg-surface-hover hover:text-fg",
                )}
              >
                {activeOrg.id === org.id
                  ? <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  : <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />
                }
                <div className="min-w-0 text-left">
                  <div className="truncate">{org.name}</div>
                  <div className="text-[10px] text-dimmed">{org.plan}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickActionsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface-hover hover:text-fg"
        title="Quick Actions"
      >
        <Plus className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
          >
            <div className="border-b border-border px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Quick Actions</p>
            </div>
            {QUICK_ACTIONS.map((action) => (
              <a
                key={action.label}
                href={action.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <action.icon className="h-3.5 w-3.5 shrink-0 text-muted" />
                {action.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)}>
        <Avatar className="h-8 w-8 border border-border transition-shadow hover:shadow-glow cursor-pointer">
          <AvatarFallback className="bg-accent/20 text-xs font-semibold text-accent">
            VJ
          </AvatarFallback>
        </Avatar>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-[13px] font-medium text-fg">Vyom Jain</p>
              <p className="text-[11px] text-muted">admin@deepmail.io</p>
              <span className="mt-1.5 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                Administrator
              </span>
            </div>
            {[
              { label: "Profile", icon: User, href: "/settings" },
              { label: "Settings", icon: Settings, href: "/settings" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <item.icon className="h-3.5 w-3.5 text-muted" />
                {item.label}
              </a>
            ))}
            <div className="border-t border-border">
              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12px] text-danger transition-colors hover:bg-danger/5">
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const setMobileOpen = useLayoutStore((s) => s.setMobileOpen);
  const setCommandOpen = useLayoutStore((s) => s.setCommandOpen);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount] = useState(3);

  const title = ROUTE_TITLES[pathname] ?? "DeepMail";

  // Breadcrumb items for deep pages
  const breadcrumbItems = pathname.startsWith("/vulnerabilities/")
    ? [{ label: "Vulnerabilities", href: "/vulnerabilities" }, { label: pathname.split("/").pop() ?? "" }]
    : pathname.startsWith("/cases/")
      ? [{ label: "Cases", href: "/cases" }, { label: title }]
      : [];

  // Keyboard shortcut: Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border px-6",
          "dm-glass",
        )}
      >
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-fg hover:bg-fg/5 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Page title + breadcrumb */}
        <div className="flex flex-col justify-center">
          {breadcrumbItems.length > 0 ? (
            <>
              <BreadcrumbNav items={breadcrumbItems} />
              <h1 className="dm-heading text-[14px] text-fg leading-tight mt-0.5">{title}</h1>
            </>
          ) : (
            <h1 className="dm-heading text-[15px] text-fg">{title}</h1>
          )}
        </div>

        <div className="flex-1" />

        {/* Center: Search bar */}
        <button
          onClick={() => setCommandOpen(true)}
          className="relative hidden h-8 w-64 items-center gap-2 rounded-md border border-border bg-surface-2 pl-9 pr-3 text-xs text-dimmed transition-colors hover:border-accent/40 hover:text-muted md:flex"
        >
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <span>Search… </span>
          <span className="ml-auto flex items-center gap-0.5">
            <Zap className="h-2.5 w-2.5 text-accent" />
            <span className="text-[10px] text-accent">AI</span>
          </span>
          <kbd className="ml-1 rounded border border-border bg-fg/5 px-1 py-0.5 text-[10px]">⌘K</kbd>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Org switcher */}
          <OrgSwitcher />

          {/* Quick actions */}
          <QuickActionsMenu />

          {/* Notification bell */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-fg hover:bg-fg/5"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-0.5 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User avatar menu */}
          <UserMenu />
        </div>
      </header>

      {/* Global modals */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
