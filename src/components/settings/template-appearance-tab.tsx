"use client";

import { useState } from "react";
import { Lock, CheckCircle, Pencil, Trash2, Plus, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  useTemplateStore,
  BUILTIN_TEMPLATES,
  type TemplateId,
  type CustomTemplate,
} from "@/stores/template-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { CustomTemplateBuilder } from "./custom-template-builder";

// ── Mini Widget Grid Preview ──────────────────────────────────────────────────
const WIDGET_COLORS: Record<string, string> = {
  "threat-score":      "bg-danger/30",
  "severity-breakdown":"bg-orange/30",
  "email-volume":      "bg-accent/30",
  "mitre-heatmap":     "bg-warning/30",
  "recent-threats":    "bg-info/30",
  "geo-threat-map":    "bg-success/30",
  "api-usage":         "bg-accent/20",
  "infra-health":      "bg-muted/20",
  "pipeline-status":   "bg-success/20",
  "incident-report":   "bg-danger/20",
  "threat-intel-feed": "bg-info/30",
  "attack-vector":     "bg-warning/20",
  "sandbox-queue":     "bg-orange/20",
  "active-iocs":       "bg-danger/15",
  "top-senders":       "bg-accent/15",
  "threat-origins":    "bg-success/15",
  "top-alert-categories": "bg-info/20",
  "threat-radar":      "bg-danger/25",
};

function MiniWidgetGrid({ widgets }: { widgets: string[] }) {
  const preview = widgets.slice(0, 9);
  return (
    <div className="grid grid-cols-3 gap-1 rounded-md bg-bg/80 p-2">
      {preview.map((id, i) => (
        <div
          key={`${id}-${i}`}
          className={cn(
            "h-6 rounded-sm",
            WIDGET_COLORS[id] ?? "bg-fg/10",
          )}
        />
      ))}
      {Array.from({ length: Math.max(0, 9 - preview.length) }).map((_, i) => (
        <div key={`empty-${i}`} className="h-6 rounded-sm bg-fg/5 border border-dashed border-border" />
      ))}
    </div>
  );
}

// ── Theme Switcher ────────────────────────────────────────────────────────────
const THEME_OPTIONS: { key: string; label: string; icon: typeof Moon; description: string }[] = [
  { key: "dark",   label: "Dark",   icon: Moon,    description: "Dark background with light text" },
  { key: "light",  label: "Light",  icon: Sun,     description: "Light background with dark text" },
  { key: "system", label: "System", icon: Monitor, description: "Follow your operating system" },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-fg">Theme</h2>
        <p className="mt-1 text-xs text-muted">
          Choose how DeepMail looks. Select a theme or sync with your system preferences.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map((opt) => {
          const isActive = theme === opt.key;
          const Icon = opt.icon;
          return (
            <button
              key={opt.key}
              onClick={() => setTheme(opt.key)}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200",
                isActive
                  ? "border-accent shadow-glow ring-1 ring-accent/30"
                  : "border-border hover:border-border-hover",
              )}
            >
              {/* Preview swatch */}
              <div
                className={cn(
                  "flex items-center justify-center py-6",
                  opt.key === "dark"
                    ? "bg-[oklch(15%_0.005_280)]"
                    : opt.key === "light"
                      ? "bg-[oklch(97%_0.005_280)]"
                      : "bg-gradient-to-r from-[oklch(15%_0.005_280)] to-[oklch(97%_0.005_280)]",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    opt.key === "dark"
                      ? "bg-[oklch(25%_0.01_280)] text-[oklch(98%_0_0)]"
                      : opt.key === "light"
                        ? "bg-[oklch(90%_0.005_280)] text-[oklch(15%_0.005_280)]"
                        : "bg-[oklch(50%_0.01_280)] text-[oklch(98%_0_0)]",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Label */}
              <div className="border-t border-border/50 bg-fg/2 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-fg">{opt.label}</span>
                  {isActive && <CheckCircle className="h-3 w-3 text-accent" />}
                </div>
                <p className="mt-0.5 text-[10px] text-muted">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Template Card ─────────────────────────────────────────────────────────────
interface TemplateCardProps {
  id: TemplateId;
  name: string;
  description: string;
  widgets: string[];
  isLocked: boolean;
  isActive: boolean;
  isEmpty?: boolean;
  onApply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function TemplateCard({
  id,
  name,
  description,
  widgets,
  isLocked,
  isActive,
  isEmpty,
  onApply,
  onEdit,
  onDelete,
}: TemplateCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200",
        isActive
          ? "border-accent shadow-glow ring-1 ring-accent/30"
          : "border-border hover:border-border-hover",
        "bg-linear-to-b from-fg/5 to-fg/1",
      )}
    >
      {/* Active badge */}
      {isActive && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">
          <CheckCircle className="h-2.5 w-2.5" />
          Active
        </div>
      )}

      {/* Locked badge */}
      {isLocked && !isActive && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-fg/8 px-2 py-0.5 text-[10px] font-medium text-muted">
          <Lock className="h-2.5 w-2.5" />
          Default
        </div>
      )}

      <div className="p-4">
        {/* Widget preview */}
        {isEmpty ? (
          <div
            className="flex h-[76px] items-center justify-center rounded-md border border-dashed border-border bg-bg/60 cursor-pointer transition-colors hover:border-accent/40 hover:bg-accent/5"
            onClick={onEdit}
          >
            <div className="flex flex-col items-center gap-1.5">
              <Plus className="h-5 w-5 text-muted" />
              <span className="text-[11px] text-muted">Create Template</span>
            </div>
          </div>
        ) : (
          <MiniWidgetGrid widgets={widgets} />
        )}

        {/* Info */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h3 className="dm-heading text-[13px] text-fg">{name}</h3>
            {isLocked && <Lock className="h-3 w-3 shrink-0 text-dimmed" />}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted line-clamp-2">
            {description}
          </p>
          {!isEmpty && (
            <p className="mt-1.5 text-[10px] text-dimmed">
              {widgets.length} widgets
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto border-t border-border/50 bg-fg/2 px-4 py-3 flex items-center gap-2">
        {isEmpty ? (
          <button
            onClick={onEdit}
            className="flex-1 rounded-md bg-accent/10 px-3 py-1.5 text-[12px] font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Create Custom Template
          </button>
        ) : (
          <>
            <button
              onClick={onApply}
              disabled={isActive}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
                isActive
                  ? "bg-accent/20 text-accent cursor-default"
                  : "bg-fg/8 text-fg hover:bg-fg/12",
              )}
            >
              {isActive ? "Applied" : "Apply Template"}
            </button>
            {!isLocked && onEdit && (
              <button
                onClick={onEdit}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-fg"
                title="Edit template"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {!isLocked && onDelete && (
              <button
                onClick={onDelete}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                title="Delete template"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function TemplateAppearanceTab() {
  const activeTemplateId = useTemplateStore((s) => s.activeTemplateId);
  const customTemplates = useTemplateStore((s) => s.customTemplates);
  const applyTemplate = useTemplateStore((s) => s.applyTemplate);
  const deleteCustomTemplate = useTemplateStore((s) => s.deleteCustomTemplate);
  const syncFromTemplate = useDashboardStore((s) => s.syncFromTemplate);

  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<0 | 1>(0);

  const handleApply = (id: TemplateId) => {
    applyTemplate(id);
    syncFromTemplate();
  };

  const handleEdit = (slot: 0 | 1) => {
    setEditingSlot(slot);
    setBuilderOpen(true);
  };

  const handleDelete = async (slot: 0 | 1) => {
    await deleteCustomTemplate(slot);
    if (activeTemplateId === (slot === 0 ? "custom-1" : "custom-2")) {
      syncFromTemplate();
    }
  };

  const customSlots: Array<{
    slot: 0 | 1;
    id: TemplateId;
    template: CustomTemplate | null;
  }> = [
    { slot: 0, id: "custom-1", template: customTemplates[0] },
    { slot: 1, id: "custom-2", template: customTemplates[1] },
  ];

  return (
    <div className="space-y-8">
      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Separator */}
      <div className="h-px bg-border" />

      {/* Dashboard Templates */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-fg">Dashboard Templates</h2>
          <p className="mt-1 text-xs text-muted">
            Choose a template to instantly rearrange your dashboard widgets. Custom
            templates are saved to your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {/* Built-in locked presets */}
          {BUILTIN_TEMPLATES.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              id={tmpl.id}
              name={tmpl.name}
              description={tmpl.description}
              widgets={tmpl.widgets}
              isLocked
              isActive={activeTemplateId === tmpl.id}
              onApply={() => handleApply(tmpl.id)}
            />
          ))}

          {/* Custom slots */}
          {customSlots.map(({ slot, id, template }) => (
            <TemplateCard
              key={id}
              id={id}
              name={template?.name ?? `Custom Slot ${slot + 1}`}
              description={
                template?.description ?? "Configure your own widget layout."
              }
              widgets={template?.widgets ?? []}
              isLocked={false}
              isActive={activeTemplateId === id}
              isEmpty={!template}
              onApply={() => handleApply(id)}
              onEdit={() => handleEdit(slot)}
              onDelete={template ? () => handleDelete(slot) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Custom Template Builder */}
      <CustomTemplateBuilder
        open={builderOpen}
        slot={editingSlot}
        existing={customTemplates[editingSlot]}
        onClose={() => setBuilderOpen(false)}
        onSaved={syncFromTemplate}
      />
    </div>
  );
}
