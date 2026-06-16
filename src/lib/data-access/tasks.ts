const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type TaskStatus = "pending" | "running" | "completed" | "failed";
export type TaskType = "scan" | "sandbox" | "report" | "sync" | "cleanup" | "train";

export interface Task {
  id: string;
  type: TaskType;
  name: string;
  description: string;
  status: TaskStatus;
  progress: number; // 0-100
  createdAt: string;
  completedAt?: string;
  triggeredBy: string;
  durationSec?: number;
  error?: string;
}

export const MOCK_TASKS: Task[] = [
  { id: "task-001", type: "sandbox", name: "Sandbox Analysis — macro_doc.xlsm", description: "Dynamic analysis of malicious macro document", status: "completed", progress: 100, createdAt: "2026-06-15T19:00:00Z", completedAt: "2026-06-15T19:08:22Z", triggeredBy: "alice.kim", durationSec: 502 },
  { id: "task-002", type: "scan", name: "Full Domain Threat Scan", description: "Deep scan all incoming email for threat indicators", status: "running", progress: 67, createdAt: "2026-06-15T19:10:00Z", triggeredBy: "system", },
  { id: "task-003", type: "sync", name: "MISP Feed Sync", description: "Pull latest IOCs from MISP threat sharing platform", status: "running", progress: 42, createdAt: "2026-06-15T19:12:00Z", triggeredBy: "system" },
  { id: "task-004", type: "report", name: "Weekly Executive Summary", description: "Generate PDF threat intelligence report for executives", status: "pending", progress: 0, createdAt: "2026-06-15T19:15:00Z", triggeredBy: "admin" },
  { id: "task-005", type: "train", name: "ML Model Retrain — NLP v3.2", description: "Retrain intent classification model with latest labeled data", status: "pending", progress: 0, createdAt: "2026-06-15T19:16:00Z", triggeredBy: "admin" },
  { id: "task-006", type: "cleanup", name: "Log Archive Rotation", description: "Archive logs older than 90 days to cold storage", status: "failed", progress: 22, createdAt: "2026-06-15T18:00:00Z", completedAt: "2026-06-15T18:04:10Z", triggeredBy: "system", error: "S3 bucket access denied: permission error on arn:aws:s3:::deepmail-archive" },
];

export async function getTasks(): Promise<Task[]> {
  await sleep(400);
  return MOCK_TASKS;
}

export async function cancelTask(id: string): Promise<void> {
  await sleep(200);
  void id;
}

export async function retryTask(id: string): Promise<void> {
  await sleep(200);
  void id;
}

export async function triggerTask(type: TaskType, params: Record<string, string>): Promise<Task> {
  await sleep(600);
  return {
    id: `task-${Date.now()}`,
    type,
    name: `Manual ${type} task`,
    description: "User-triggered task",
    status: "pending",
    progress: 0,
    createdAt: new Date().toISOString(),
    triggeredBy: "admin",
  };
}
