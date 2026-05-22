"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Search, Plus, Check, Shield, Brain, Wrench, FlaskConical, Server,
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { widgetRegistry } from "@/lib/dashboard/registry";
import type { WidgetCategory } from "@/lib/dashboard/types";

const CATEGORY_CONFIG: Record<WidgetCategory, { label: string; icon: React.ElementType }> = {
  core: { label: "Core", icon: Shield },
  intelligence: { label: "Intelligence", icon: Brain },
  operational: { label: "Operational", icon: Wrench },
  sandbox: { label: "Sandbox", icon: FlaskConical },
  platform: { label: "Platform", icon: Server },
};

export function WidgetMarketplace() {
  const marketplaceOpen = useDashboardStore((s) => s.marketplaceOpen);
  const setMarketplaceOpen = useDashboardStore((s) => s.setMarketplaceOpen);
  const activeWidgets = useDashboardStore((s) => s.activeWidgets);
  const addWidget = useDashboardStore((s) => s.addWidget);
  const removeWidget = useDashboardStore((s) => s.removeWidget);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | "all">("all");

  const allWidgets = widgetRegistry.getAll();

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<WidgetCategory, number>> = {};
    for (const w of allWidgets) {
      counts[w.category] = (counts[w.category] || 0) + 1;
    }
    return counts;
  }, [allWidgets]);

  const categories = useMemo(() => {
    const cats = new Set(allWidgets.map((w) => w.category));
    return Array.from(cats) as WidgetCategory[];
  }, [allWidgets]);

  const filtered = useMemo(() => {
    return allWidgets.filter((w) => {
      if (selectedCategory !== "all" && w.category !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.tags.some((t) => t.includes(q))
        );
      }
      return true;
    });
  }, [allWidgets, selectedCategory, search]);

  return (
    <AnimatePresence>
      {marketplaceOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMarketplaceOpen(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative h-full w-full max-w-[28rem] overflow-y-auto border-l border-border bg-surface p-6"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-fg">Widget Marketplace</h2>
              <button
                onClick={() => setMarketplaceOpen(false)}
                className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-xs text-muted">Browse and add widgets to your dashboard</p>

            {/* Search */}
            <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 focus-within:ring-1 focus-within:ring-accent/40">
              <Search className="h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search widgets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded p-0.5 text-muted hover:text-fg"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors ${
                  selectedCategory === "all"
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-surface-hover"
                }`}
              >
                All
                <span className="text-[10px] opacity-60">{allWidgets.length}</span>
              </button>
              {categories.map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const CatIcon = config.icon;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors ${
                      selectedCategory === cat
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-surface-hover"
                    }`}
                  >
                    <CatIcon className="h-3 w-3" />
                    {config.label}
                    <span className="text-[10px] opacity-60">{categoryCounts[cat] || 0}</span>
                  </button>
                );
              })}
            </div>

            {/* Widget cards */}
            <div className="space-y-2">
              {filtered.length > 0 ? (
                filtered.map((widget) => {
                  const isActive = activeWidgets.includes(widget.id);
                  const catConfig = CATEGORY_CONFIG[widget.category];
                  return (
                    <motion.div
                      key={widget.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                        isActive
                          ? "border-accent/30 bg-accent/5"
                          : "border-border bg-surface hover:border-accent/30 hover:shadow-sm"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-fg">{widget.name}</div>
                        <div className="mt-0.5 text-xs text-muted">{widget.description}</div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-2 py-0.5 text-[10px] text-muted">
                            <catConfig.icon className="h-2.5 w-2.5" />
                            {catConfig.label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => (isActive ? removeWidget(widget.id) : addWidget(widget.id))}
                        className={`shrink-0 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-accent/15 border border-accent/30 text-accent"
                            : "border border-border text-secondary hover:border-accent/40 hover:text-accent"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <Search className="h-8 w-8 text-muted/40" />
                  <p className="text-sm text-muted">No widgets match your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
