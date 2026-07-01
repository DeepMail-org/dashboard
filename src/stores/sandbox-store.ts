import { create } from "zustand";
import { persist } from "zustand/middleware";
import mockTasks from "../data/mock-tasks.json";
import { sandboxTaskMachine } from "./sandbox-machine";
import { createActor } from "xstate";

export type SandboxTaskStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface SandboxConfig {
  os: string;
  network: string;
  timeout: number;
}

export interface SandboxTask {
  id: string;
  name: string;
  type: "email" | "attachment";
  targetId: string;
  size?: number;
  status: SandboxTaskStatus;
  config: SandboxConfig;
  createdAt: number;
  completedAt?: number;
  
  // Enterprise fields
  tenant?: string;
  owner?: string;
  worker?: string;
  risk?: number;
  verdict?: "malicious" | "suspicious" | "clean" | "unknown";
  campaign?: string;
  iocCount?: number;
  confidence?: number;
}

interface SandboxWorker {
  id: string;
  name: string;
  status: "healthy" | "busy" | "offline";
  cpu: number;
  ram: number;
  queueLength: number;
  region: string;
  latency: number;
  lastHeartbeat: number;
}

interface SandboxState {
  tasks: SandboxTask[];
  workers: SandboxWorker[];
  addTask: (task: Omit<SandboxTask, "id" | "status" | "config" | "createdAt" | "iocCount" | "confidence" | "verdict">) => string;
  updateTaskConfig: (id: string, config: Partial<SandboxConfig>) => void;
  updateTaskStatus: (id: string, event: "LAUNCH" | "COMPLETE" | "FAIL" | "RETRY" | "CANCEL") => void;
}

const DEFAULT_CONFIG: SandboxConfig = {
  os: "windows10",
  network: "isolated",
  timeout: 120,
};

const INITIAL_WORKERS: SandboxWorker[] = [
  { id: "w-01", name: "sandbox-01", status: "busy", cpu: 84, ram: 70, queueLength: 3, region: "us-east-1", latency: 12, lastHeartbeat: Date.now() },
  { id: "w-02", name: "sandbox-02", status: "healthy", cpu: 12, ram: 24, queueLength: 0, region: "us-east-2", latency: 15, lastHeartbeat: Date.now() },
  { id: "w-03", name: "sandbox-03", status: "healthy", cpu: 5, ram: 18, queueLength: 0, region: "eu-west-1", latency: 89, lastHeartbeat: Date.now() },
  { id: "w-04", name: "sandbox-04", status: "offline", cpu: 0, ram: 0, queueLength: 0, region: "ap-south-1", latency: 0, lastHeartbeat: Date.now() - 3600000 },
  { id: "w-05", name: "sandbox-05", status: "healthy", cpu: 22, ram: 45, queueLength: 1, region: "us-west-2", latency: 45, lastHeartbeat: Date.now() },
];

export const useSandboxStore = create<SandboxState>()(
  persist(
    (set) => ({
      tasks: mockTasks as SandboxTask[],
      workers: INITIAL_WORKERS,
      
      addTask: (taskData) => {
        const id = `sbx-${Math.random().toString(36).substring(2, 9)}`;
        const newTask: SandboxTask = {
          ...taskData,
          id,
          status: "pending",
          config: { ...DEFAULT_CONFIG },
          createdAt: Date.now(),
          tenant: "Current Tenant",
          owner: "current.user",
          verdict: "unknown",
          iocCount: 0,
          confidence: 0
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
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
      
      updateTaskStatus: (id, event) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === id);
          if (!task) return state;

          // XState evaluation strictly dictates next state
          const actor = createActor(sandboxTaskMachine, {
            state: sandboxTaskMachine.resolveState({ value: task.status, context: { id } })
          });
          actor.start();
          actor.send({ type: event });
          
          const nextStateValue = actor.getSnapshot().value as SandboxTaskStatus;
          
          if (nextStateValue === task.status) {
            // Invalid transition attempted
            console.warn(`[XState] Invalid transition: ${task.status} -> ${event}`);
            return state;
          }

          return {
            tasks: state.tasks.map((t) => {
              if (t.id === id) {
                return {
                  ...t,
                  status: nextStateValue,
                  worker: nextStateValue === "running" ? "sandbox-01" : t.worker,
                  completedAt: (nextStateValue === "completed" || nextStateValue === "failed" || nextStateValue === "cancelled") ? Date.now() : t.completedAt,
                  // If completed mock some random stats
                  verdict: nextStateValue === "completed" ? (Math.random() > 0.5 ? "malicious" : "clean") : t.verdict,
                  iocCount: nextStateValue === "completed" ? Math.floor(Math.random() * 20) : t.iocCount,
                  confidence: nextStateValue === "completed" ? 90 + Math.floor(Math.random() * 10) : t.confidence,
                };
              }
              return t;
            }),
          };
        });
      },
    }),
    {
      name: "deepmail-sandbox-operations",
    }
  )
);
