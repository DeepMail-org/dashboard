import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SandboxTaskStatus = "pending" | "running" | "completed" | "failed";

export interface SandboxConfig {
  os: string;
  network: string;
  timeout: number;
}

export interface SandboxTask {
  id: string;
  name: string;
  type: "email" | "attachment";
  targetId: string; // The ID of the email or attachment
  size?: number; // In bytes
  status: SandboxTaskStatus;
  config: SandboxConfig;
  createdAt: number;
  completedAt?: number;
}

interface SandboxState {
  tasks: SandboxTask[];
  activeTaskId: string | null;
  addTask: (task: Omit<SandboxTask, "id" | "status" | "config" | "createdAt">) => string;
  updateTaskConfig: (id: string, config: Partial<SandboxConfig>) => void;
  updateTaskStatus: (id: string, status: SandboxTaskStatus) => void;
  removeTask: (id: string) => void;
  setActiveTask: (id: string | null) => void;
}

const DEFAULT_CONFIG: SandboxConfig = {
  os: "windows10",
  network: "isolated",
  timeout: 120,
};

export const useSandboxStore = create<SandboxState>()(
  persist(
    (set, get) => ({
      tasks: [
        // Let's prepopulate a pending mock task so the list isn't completely empty
        {
          id: "sbx-001",
          name: "invoice_q3.pdf.exe",
          type: "attachment",
          targetId: "att-123",
          size: 2400000,
          status: "pending",
          config: { ...DEFAULT_CONFIG },
          createdAt: Date.now() - 3600000,
        }
      ],
      activeTaskId: "sbx-001",
      addTask: (taskData) => {
        const id = `sbx-${Math.random().toString(36).substring(2, 9)}`;
        const newTask: SandboxTask = {
          ...taskData,
          id,
          status: "pending",
          config: { ...DEFAULT_CONFIG },
          createdAt: Date.now(),
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
          activeTaskId: id, // Automatically switch view to newly added task
        }));
        return id;
      },
      updateTaskConfig: (id, newConfig) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, config: { ...t.config, ...newConfig } } : t
          ),
        }));
      },
      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === id) {
              return {
                ...t,
                status,
                completedAt: status === "completed" || status === "failed" ? Date.now() : t.completedAt,
              };
            }
            return t;
          }),
        }));
      },
      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
        }));
      },
      setActiveTask: (id) => set({ activeTaskId: id }),
    }),
    {
      name: "deepmail-sandbox-storage",
    }
  )
);
