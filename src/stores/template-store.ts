import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage";
import type { BreakpointLayouts } from "@/lib/dashboard/types";
import {
  ADMIN_WIDGETS,
  ADMIN_LAYOUTS,
  ANALYST_WIDGETS,
  ANALYST_LAYOUTS,
} from "@/lib/dashboard/template-presets";
import { DEFAULT_WIDGETS, DEFAULT_LAYOUTS } from "@/lib/dashboard/presets";
import { saveCustomTemplate, deleteCustomTemplate } from "@/lib/data-access/templates";
import { toast } from "sonner";

export type TemplateId = "administrator" | "analyst" | "custom-1" | "custom-2";

export interface CustomTemplate {
  id: "custom-1" | "custom-2";
  name: string;
  description: string;
  widgets: string[];
  layouts: BreakpointLayouts;
  updatedAt: string;
}

interface BuiltinTemplate {
  id: "administrator" | "analyst";
  name: string;
  description: string;
  icon: string;
  widgets: string[];
  layouts: BreakpointLayouts;
  isLocked: true;
}

export const BUILTIN_TEMPLATES: BuiltinTemplate[] = [
  {
    id: "administrator",
    name: "Administrator",
    description: "High-level SOC overview: threat scoring, MITRE coverage, infrastructure health, pipeline status.",
    icon: "ShieldCheck",
    widgets: ADMIN_WIDGETS,
    layouts: ADMIN_LAYOUTS,
    isLocked: true,
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "Deep-dive analysis: IOC feeds, sandbox queues, attack vectors, email pattern analysis.",
    icon: "Search",
    widgets: ANALYST_WIDGETS,
    layouts: ANALYST_LAYOUTS,
    isLocked: true,
  },
];

interface TemplateState {
  activeTemplateId: TemplateId;
  customTemplates: [CustomTemplate | null, CustomTemplate | null];
  isHydrated: boolean;
  isSaving: boolean;

  getActiveWidgets: () => string[];
  getActiveLayouts: () => BreakpointLayouts;
  applyTemplate: (id: TemplateId) => void;
  saveCustomTemplate: (
    slot: 0 | 1,
    name: string,
    description: string,
    widgets: string[],
    layouts: BreakpointLayouts,
  ) => Promise<void>;
  deleteCustomTemplate: (slot: 0 | 1) => Promise<void>;
  setHydrated: () => void;
}

function getDefaultWidgetsForTemplate(
  id: TemplateId,
  customTemplates: [CustomTemplate | null, CustomTemplate | null],
): string[] {
  if (id === "administrator") return ADMIN_WIDGETS;
  if (id === "analyst") return ANALYST_WIDGETS;
  const slot = id === "custom-1" ? 0 : 1;
  return customTemplates[slot]?.widgets ?? DEFAULT_WIDGETS;
}

function getDefaultLayoutsForTemplate(
  id: TemplateId,
  customTemplates: [CustomTemplate | null, CustomTemplate | null],
): BreakpointLayouts {
  if (id === "administrator") return ADMIN_LAYOUTS;
  if (id === "analyst") return ANALYST_LAYOUTS;
  const slot = id === "custom-1" ? 0 : 1;
  return customTemplates[slot]?.layouts ?? DEFAULT_LAYOUTS;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      activeTemplateId: "administrator",
      customTemplates: [null, null],
      isHydrated: false,
      isSaving: false,

      getActiveWidgets: () => {
        const { activeTemplateId, customTemplates } = get();
        return getDefaultWidgetsForTemplate(activeTemplateId, customTemplates);
      },

      getActiveLayouts: () => {
        const { activeTemplateId, customTemplates } = get();
        return getDefaultLayoutsForTemplate(activeTemplateId, customTemplates);
      },

      applyTemplate: (id) => {
        set({ activeTemplateId: id });
        toast.success(`Template applied: ${id.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
      },

      saveCustomTemplate: async (slot, name, description, widgets, layouts) => {
        set({ isSaving: true });
        try {
          const slotId = slot === 0 ? "custom-1" : "custom-2";
          await saveCustomTemplate({ id: slotId, name, description, widgets, layouts });
          const updated: CustomTemplate = {
            id: slotId,
            name,
            description,
            widgets,
            layouts,
            updatedAt: new Date().toISOString(),
          };
          const prev = get().customTemplates;
          const next: [CustomTemplate | null, CustomTemplate | null] =
            slot === 0 ? [updated, prev[1]] : [prev[0], updated];
          set({ customTemplates: next, activeTemplateId: slotId });
          toast.success(`Custom template "${name}" saved`);
        } catch {
          toast.error("Failed to save template. Please try again.");
        } finally {
          set({ isSaving: false });
        }
      },

      deleteCustomTemplate: async (slot) => {
        set({ isSaving: true });
        try {
          const slotId = slot === 0 ? "custom-1" : "custom-2";
          await deleteCustomTemplate(slotId);
          const prev = get().customTemplates;
          const next: [CustomTemplate | null, CustomTemplate | null] =
            slot === 0 ? [null, prev[1]] : [prev[0], null];
          const { activeTemplateId } = get();
          const fallback: TemplateId =
            activeTemplateId === slotId ? "administrator" : activeTemplateId;
          set({ customTemplates: next, activeTemplateId: fallback });
          toast.success("Custom template deleted");
        } catch {
          toast.error("Failed to delete template.");
        } finally {
          set({ isSaving: false });
        }
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "deepmail_template_store_v1",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        activeTemplateId: state.activeTemplateId,
        customTemplates: state.customTemplates,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
