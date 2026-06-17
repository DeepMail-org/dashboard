import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MailFilters } from "@/lib/mail/types";

interface MailState {
  filters: MailFilters;
  setFilters: (filters: Partial<MailFilters>) => void;
  selectedMailId: string | null;
  setSelectedMailId: (id: string | null) => void;
  layout: number[];
  setLayout: (layout: number[]) => void;
  composeState: "closed" | "open" | "minimized";
  setComposeState: (state: "closed" | "open" | "minimized") => void;
  composeData: { to: string; subject: string; body: string };
  setComposeData: (data: Partial<{ to: string; subject: string; body: string }>) => void;
}

const DEFAULT_FILTERS: MailFilters = {
  folder: "inbox",
  search: "",
  severity: [],
  labels: [],
  unreadOnly: false,
  hasAttachments: false,
  starred: false,
  important: false,
};

export const useMailStore = create<MailState>()(
  persist(
    (set) => ({
      filters: DEFAULT_FILTERS,
      selectedMailId: null,
      layout: [15, 35, 50],
      composeState: "closed",
      composeData: { to: "", subject: "", body: "" },
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      setSelectedMailId: (id) => set({ selectedMailId: id }),
      setLayout: (layout) => set({ layout }),
      setComposeState: (state) => set({ composeState: state }),
      setComposeData: (data) => set((state) => ({ composeData: { ...state.composeData, ...data } })),
    }),
    {
      name: "deepmail-mail-storage",
    }
  )
);
