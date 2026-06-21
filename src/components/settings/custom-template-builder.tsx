"use client";

import { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import { widgetRegistry } from "@/lib/dashboard/registry";
import type { WidgetDefinition } from "@/lib/dashboard/types";
import { useTemplateStore, type CustomTemplate } from "@/stores/template-store";
import { DEFAULT_LAYOUTS } from "@/lib/dashboard/presets";
import { generateLayoutForAllBreakpoints } from "@/lib/dashboard/breakpoints";
import type { BreakpointLayouts } from "@/lib/dashboard/types";
import { DrawerPanel } from "@/components/ui/drawer-panel";
import { cn } from "@/lib/utils";

interface CustomTemplateBuilderProps {
  open: boolean;
  slot: 0 | 1;
  existing: CustomTemplate | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  core: "Core",
  intelligence: "Intelligence",
  operational: "Operational",
  sandbox: "Sandbox",
  platform: "Platform",
};

export function CustomTemplateBuilder({
  open,
  slot,
  existing,
  onClose,
  onSaved,
}: CustomTemplateBuilderProps) {
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(
    existing?.widgets ?? [],
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const isSaving = useTemplateStore((s) => s.isSaving);
  const save = useTemplateStore((s) => s.saveCustomTemplate);

  // Reset when re-opening for a different slot
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(existing?.name ?? "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDescription(existing?.description ?? "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedWidgets(existing?.widgets ?? []);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch("");
      setActiveCategory("all");
    }
  }, [open, existing]);

  const allWidgets = widgetRegistry.getAll();
  const categories = ["all", ...Object.keys(CATEGORY_LABELS)];

  const filtered = allWidgets.filter((w) => {
    const matchCategory = activeCategory === "all" || w.category === activeCategory;
    const matchSearch =
      !search ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.tags.some((t) => t.includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const toggleWidget = (id: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    // Build layouts from selected widgets
    let layouts: BreakpointLayouts = {
      lg: [], md: [], sm: [], xs: [],
    };
    for (const id of selectedWidgets) {
      const def = widgetRegistry.get(id);
      if (def) {
        layouts = generateLayoutForAllBreakpoints(id, def.size, layouts);
      }
    }
    await save(slot, name.trim(), description.trim(), selectedWidgets, layouts);
    onSaved();
    onClose();
  };

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      title={existing ? `Edit: ${existing.name}` : "Create Custom Template"}
      subtitle="Select widgets and save as a named template"
      width={480}
    >
      <div className="flex flex-col gap-0 h-full">
        {/* Name & Description */}
        <div className="border-b border-border px-6 py-4 space-y-3">
          <div>
            <label className="text-[11px] text-muted">Template Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My SOC View"
              className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-dimmed focus:border-accent"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this template"
              className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-dimmed focus:border-accent"
            />
          </div>
        </div>

        {/* Selected count */}
        <div className="border-b border-border bg-fg/2 px-6 py-2 flex items-center justify-between">
          <span className="text-[11px] text-muted">
            {selectedWidgets.length} widget{selectedWidgets.length !== 1 ? "s" : ""} selected
          </span>
          {selectedWidgets.length > 0 && (
            <button
              onClick={() => setSelectedWidgets([])}
              className="text-[11px] text-danger hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search + Category filter */}
        <div className="border-b border-border px-6 py-3 space-y-2">
          <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search widgets…"
              className="flex-1 bg-transparent text-xs text-fg outline-none placeholder:text-dimmed"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X className="h-3 w-3 text-muted hover:text-fg" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded px-2.5 py-1 text-[10px] capitalize transition-colors",
                  activeCategory === cat
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-fg",
                )}
              >
                {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Widget list */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-1">
          {filtered.map((widget: WidgetDefinition) => {
            const selected = selectedWidgets.includes(widget.id);
            return (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={cn(
                  "w-full flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
                  selected
                    ? "border-accent/30 bg-accent/8"
                    : "border-border bg-surface hover:border-border-hover hover:bg-surface-hover",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                    selected
                      ? "border-accent bg-accent"
                      : "border-border",
                  )}
                >
                  {selected && <Check className="h-2.5 w-2.5 text-bg" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-fg">{widget.name}</div>
                  <div className="text-[11px] text-muted mt-0.5">{widget.description}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {widget.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-fg/5 px-1.5 py-px text-[9px] text-dimmed">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Save footer */}
        <div className="border-t border-border px-6 py-4 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-fg hover:border-border-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || selectedWidgets.length === 0 || isSaving}
            className={cn(
              "flex-1 rounded-md bg-accent px-4 py-2 text-sm font-medium text-fg transition-all",
              (!name.trim() || selectedWidgets.length === 0)
                ? "opacity-40 cursor-not-allowed"
                : "hover:opacity-90",
            )}
          >
            {isSaving ? "Saving…" : "Save Template"}
          </button>
        </div>
      </div>
    </DrawerPanel>
  );
}
