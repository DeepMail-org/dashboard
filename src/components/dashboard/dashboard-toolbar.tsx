"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, Unlock, Plus, RotateCcw, LayoutTemplate, ChevronDown, CheckCircle } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useTemplateStore, BUILTIN_TEMPLATES, type TemplateId } from "@/stores/template-store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const ALL_TEMPLATE_LABELS: Record<TemplateId, string> = {
  administrator: "Administrator",
  analyst: "Analyst",
  "custom-1": "Custom 1",
  "custom-2": "Custom 2",
};

function TemplateSwitcherDropdown({ onClose }: { onClose: () => void }) {
  const activeTemplateId = useTemplateStore((s) => s.activeTemplateId);
  const customTemplates = useTemplateStore((s) => s.customTemplates);
  const applyTemplate = useTemplateStore((s) => s.applyTemplate);
  const syncFromTemplate = useDashboardStore((s) => s.syncFromTemplate);

  const handleApply = (id: TemplateId) => {
    applyTemplate(id);
    syncFromTemplate();
    onClose();
  };

  const templateItems: Array<{ id: TemplateId; label: string; available: boolean }> = [
    ...BUILTIN_TEMPLATES.map((t) => ({ id: t.id, label: t.name, available: true })),
    {
      id: "custom-1",
      label: customTemplates[0]?.name ?? "Custom Slot 1",
      available: !!customTemplates[0],
    },
    {
      id: "custom-2",
      label: customTemplates[1]?.name ?? "Custom Slot 2",
      available: !!customTemplates[1],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
    >
      <div className="border-b border-border px-3 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Dashboard Templates</p>
      </div>
      {templateItems.map((item) => {
        const isActive = activeTemplateId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => item.available && handleApply(item.id)}
            className={cn(
              "flex w-full items-center gap-2.5 px-3 py-2.5 text-[12px] transition-colors",
              isActive ? "bg-accent/10 text-accent" : "text-secondary hover:bg-surface-hover hover:text-fg",
              !item.available && "opacity-40 cursor-not-allowed",
            )}
          >
            {isActive ? (
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />
            )}
            {item.label}
            {!item.available && (
              <span className="ml-auto text-[10px] text-dimmed">Empty</span>
            )}
          </button>
        );
      })}
      <div className="border-t border-border px-3 py-2">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-accent"
        >
          <LayoutTemplate className="h-3 w-3" />
          Manage Templates →
        </Link>
      </div>
    </motion.div>
  );
}

export function DashboardToolbar() {
  const isLocked = useDashboardStore((s) => s.isLocked);
  const toggleLocked = useDashboardStore((s) => s.toggleLocked);
  const setMarketplaceOpen = useDashboardStore((s) => s.setMarketplaceOpen);
  const resetToDefault = useDashboardStore((s) => s.resetToDefault);
  const activeTemplateId = useTemplateStore((s) => s.activeTemplateId);
  const customTemplates = useTemplateStore((s) => s.customTemplates);

  const [templateOpen, setTemplateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!templateOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setTemplateOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [templateOpen]);

  const activeLabel =
    activeTemplateId === "custom-1"
      ? (customTemplates[0]?.name ?? "Custom 1")
      : activeTemplateId === "custom-2"
        ? (customTemplates[1]?.name ?? "Custom 2")
        : ALL_TEMPLATE_LABELS[activeTemplateId];

  return (
    <div className="flex items-center gap-2">
      {/* Template switcher pill */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setTemplateOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-hover hover:text-fg"
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          {activeLabel}
          <ChevronDown className={cn("h-3 w-3 transition-transform", templateOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {templateOpen && (
            <TemplateSwitcherDropdown onClose={() => setTemplateOpen(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Lock toggle */}
      <button
        onClick={toggleLocked}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
          isLocked
            ? "text-muted hover:text-secondary hover:bg-surface-hover"
            : "bg-accent-soft text-accent",
        )}
        title={isLocked ? "Unlock dashboard to edit" : "Lock dashboard"}
      >
        {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
        {isLocked ? "Locked" : "Editing"}
      </button>

      {/* Add widget + Reset (only when unlocked) */}
      {!isLocked && (
        <>
          <button
            onClick={() => setMarketplaceOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1.5 text-xs text-secondary transition-colors hover:bg-surface-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Widget
          </button>

          <button
            onClick={resetToDefault}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-secondary"
            title="Reset to active template layout"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
