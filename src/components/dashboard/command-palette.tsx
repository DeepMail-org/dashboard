"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Mail, FolderOpen, Columns3, ShieldAlert, Monitor,
  FileText, Activity, Store, CreditCard, Settings, Search, Plus, Trash2,
  Lock, Unlock, RotateCcw, Globe,
} from "lucide-react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandShortcut, CommandSeparator,
} from "@/components/ui/command";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useLayoutStore } from "@/stores/layout-store";
import { widgetRegistry } from "@/lib/dashboard/registry";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "⌘1" },
  { label: "Mail Inbox", href: "/mail-inbox", icon: Mail, shortcut: "⌘2" },
  { label: "Cases", href: "/cases", icon: FolderOpen, shortcut: "⌘3" },
  { label: "Case Board", href: "/cases/board", icon: Columns3 },
  { label: "Detections", href: "/detections", icon: ShieldAlert, shortcut: "⌘4" },
  { label: "Sandbox", href: "/sandbox", icon: Monitor },
  { label: "Log Explorer", href: "/log-explorer", icon: FileText, shortcut: "⌘5" },
  { label: "Graph Analysis", href: "/graph-analysis", icon: Activity },
  { label: "Geo Map", href: "/map", icon: Globe },
  { label: "Marketplace", href: "/settings?tab=marketplace", icon: Store },
  { label: "Billing", href: "/settings?tab=usage", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function CommandPalette() {
  const open = useLayoutStore((s) => s.commandOpen);
  const setOpen = useLayoutStore((s) => s.setCommandOpen);
  const router = useRouter();

  const activeWidgets = useDashboardStore((s) => s.activeWidgets);
  const isLocked = useDashboardStore((s) => s.isLocked);
  const addWidget = useDashboardStore((s) => s.addWidget);
  const removeWidget = useDashboardStore((s) => s.removeWidget);
  const toggleLocked = useDashboardStore((s) => s.toggleLocked);
  const resetToDefault = useDashboardStore((s) => s.resetToDefault);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen, open]);

  const runAction = useCallback(
    (fn: () => void) => {
      fn();
      setOpen(false);
    },
    [setOpen],
  );

  const allWidgets = widgetRegistry.getAll();
  const inactiveWidgets = allWidgets.filter((w) => !activeWidgets.includes(w.id));
  const activeWidgetDefs = activeWidgets
    .map((id) => widgetRegistry.get(id))
    .filter(Boolean);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions, widgets..." />
      <div className="flex items-center gap-1.5 border-b border-white/10 px-6 py-2">
        <span className="flex items-center gap-1 rounded-[6px] bg-[#3b7ddd]/20 px-2 py-0.5 text-[10px] font-medium text-[#3b7ddd]">
          <Globe className="h-3 w-3" />
          DeepMail Navigation
        </span>
        <span className="text-xs text-[#888888]">Quick actions and dashboard controls</span>
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                onSelect={() => runAction(() => router.push(item.href))}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Dashboard Actions">
          <CommandItem onSelect={() => runAction(toggleLocked)}>
            {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span>{isLocked ? "Unlock Dashboard" : "Lock Dashboard"}</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction(resetToDefault)}>
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Default Layout</span>
          </CommandItem>
        </CommandGroup>

        {inactiveWidgets.length > 0 && (
          <CommandGroup heading="Add Widget">
            {inactiveWidgets.map((w) => (
              <CommandItem
                key={w.id}
                onSelect={() => runAction(() => addWidget(w.id))}
              >
                <Plus className="h-4 w-4" />
                <span>{w.name}</span>
                <CommandShortcut>{w.category}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {activeWidgetDefs.length > 0 && (
          <CommandGroup heading="Remove Widget">
            {activeWidgetDefs.map((w) => (
              <CommandItem
                key={w!.id}
                onSelect={() => runAction(() => removeWidget(w!.id))}
              >
                <Trash2 className="h-4 w-4" />
                <span>{w!.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
