import { create } from "zustand";
import { persist, createJSONStorage, subscribeWithSelector } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage";
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
  updateBreakpointLayout: (breakpoint: Breakpoint, layout: import("@/lib/dashboard/types").LayoutItem[]) => void;
  resetToDefault: () => void;
  syncFromTemplate: () => void;
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

        toggleLocked: () => set((s) => ({ isLocked: !s.isLocked })),
        setMarketplaceOpen: (open) => set({ marketplaceOpen: open }),
        setHydrated: () => set({ isHydrated: true }),
      }),
      {
        name: "deepmail_dashboard_v4",
        storage: createJSONStorage(() => safeLocalStorage),
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
