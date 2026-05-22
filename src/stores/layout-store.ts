import { create } from "zustand";

interface LayoutState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  expandedGroups: Record<string, boolean>;
  commandOpen: boolean;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  toggleGroup: (groupId: string) => void;
  setCommandOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  expandedGroups: { general: true, security: true, intelligence: true, system: true },
  commandOpen: false,
  toggleCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  toggleGroup: (groupId) =>
    set((s) => ({
      expandedGroups: { ...s.expandedGroups, [groupId]: !s.expandedGroups[groupId] },
    })),
  setCommandOpen: (open) => set({ commandOpen: open }),
}));
