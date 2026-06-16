import { create } from "zustand";
import { persist, createJSONStorage, subscribeWithSelector } from "zustand/middleware";
import type { Breakpoint, BreakpointLayouts } from "@/lib/dashboard/types";
import { generateLayoutForAllBreakpoints, removeFromAllBreakpoints } from "@/lib/dashboard/breakpoints";
import { widgetRegistry } from "@/lib/dashboard/registry";
import { DEFAULT_WIDGETS, DEFAULT_LAYOUTS } from "@/lib/dashboard/presets";
import { useTemplateStore } from "@/stores/template-store";

interface DashboardState {
  activeWidgets: string[];
  layouts: BreakpointLayouts;
  isLocked: boolean;
  isHydrated: boolean;
  marketplaceOpen: boolean;

  addWidget: (widgetId: string) => void;
  removeWidget: (widgetId: string) => void;
  updateLayouts: (layouts: BreakpointLayouts) => void;
  updateBreakpointLayout: (breakpoint: Breakpoint, layout: import("@/lib/dashboard/types").LayoutItem[]) => void;
  resetToDefault: () => void;
  syncFromTemplate: () => void;
  setLocked: (locked: boolean) => void;
  toggleLocked: () => void;
  setMarketplaceOpen: (open: boolean) => void;
  setHydrated: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        activeWidgets: DEFAULT_WIDGETS,
        layouts: DEFAULT_LAYOUTS,
        isLocked: true,
        isHydrated: false,
        marketplaceOpen: false,

        addWidget: (widgetId: string) => {
          const { activeWidgets, layouts } = get();
          if (activeWidgets.includes(widgetId)) return;

          const definition = widgetRegistry.get(widgetId);
          if (!definition) return;

          const newLayouts = generateLayoutForAllBreakpoints(
            widgetId,
            definition.size,
            layouts,
          );

          set({
            activeWidgets: [...activeWidgets, widgetId],
            layouts: newLayouts,
          });
        },

        removeWidget: (widgetId: string) => {
          const { activeWidgets, layouts } = get();
          set({
            activeWidgets: activeWidgets.filter((id) => id !== widgetId),
            layouts: removeFromAllBreakpoints(widgetId, layouts),
          });
        },

        updateLayouts: (newLayouts: BreakpointLayouts) => {
          const { activeWidgets } = get();
          const filtered = {} as BreakpointLayouts;
          for (const bp of Object.keys(newLayouts) as Breakpoint[]) {
            filtered[bp] = newLayouts[bp].filter((item) =>
              activeWidgets.includes(item.i),
            );
          }
          set({ layouts: filtered });
        },

        updateBreakpointLayout: (breakpoint, layout) => {
          const { layouts, activeWidgets } = get();
          set({
            layouts: {
              ...layouts,
              [breakpoint]: layout.filter((item) => activeWidgets.includes(item.i)),
            },
          });
        },

        resetToDefault: () => {
          const templateStore = useTemplateStore.getState();
          set({
            activeWidgets: templateStore.getActiveWidgets(),
            layouts: templateStore.getActiveLayouts(),
          });
        },

        syncFromTemplate: () => {
          const templateStore = useTemplateStore.getState();
          set({
            activeWidgets: templateStore.getActiveWidgets(),
            layouts: templateStore.getActiveLayouts(),
            isLocked: true,
          });
        },

        setLocked: (locked) => set({ isLocked: locked }),
        toggleLocked: () => set((s) => ({ isLocked: !s.isLocked })),
        setMarketplaceOpen: (open) => set({ marketplaceOpen: open }),
        setHydrated: () => set({ isHydrated: true }),
      }),
      {
        name: "deepmail_dashboard_v4",
        storage: createJSONStorage(() => localStorage),
        version: 4,
        partialize: (state) => ({
          activeWidgets: state.activeWidgets,
          layouts: state.layouts,
          isLocked: state.isLocked,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated();
        },
        migrate: (_persisted: unknown, version: number) => {
          if (version < 4) {
            return {
              activeWidgets: DEFAULT_WIDGETS,
              layouts: DEFAULT_LAYOUTS,
              isLocked: true,
            };
          }
          return _persisted as Record<string, unknown>;
        },
      },
    ),
  ),
);
