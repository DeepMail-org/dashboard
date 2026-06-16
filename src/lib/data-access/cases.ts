const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type CaseStatus = "new" | "in_progress" | "pending" | "resolved" | "closed";
export type CaseSeverity = "critical" | "high" | "medium" | "low";

export interface Case {
  id: string;
  title: string;
  severity: CaseSeverity;
  status: CaseStatus;
  assignee: string;
  assigneeInitials: string;
  source: "email" | "sandbox" | "detection_rule" | "manual";
  createdAt: string;
  slaDeadlineHours: number;
  tags: string[];
}

export const MOCK_CASES: Case[] = [
  { id: "CASE-2026-0891", title: "BEC Attack — CEO Impersonation to Finance", severity: "critical", status: "new", assignee: "Unassigned", assigneeInitials: "?", source: "email", createdAt: "2026-06-15T18:00:00Z", slaDeadlineHours: 2, tags: ["BEC", "Finance"] },
  { id: "CASE-2026-0890", title: "Emotet Campaign — Bulk Phishing Wave", severity: "critical", status: "in_progress", assignee: "Alice Kim", assigneeInitials: "AK", source: "detection_rule", createdAt: "2026-06-15T15:30:00Z", slaDeadlineHours: 4, tags: ["Emotet", "Malware"] },
  { id: "CASE-2026-0889", title: "Credential Harvest via Fake Login Page", severity: "high", status: "in_progress", assignee: "James Rodriguez", assigneeInitials: "JR", source: "sandbox", createdAt: "2026-06-15T12:00:00Z", slaDeadlineHours: 8, tags: ["Phishing", "Credential"] },
  { id: "CASE-2026-0888", title: "C2 DNS Beaconing Detected on SE-KTH", severity: "high", status: "pending", assignee: "Tara Singh", assigneeInitials: "TS", source: "detection_rule", createdAt: "2026-06-14T20:00:00Z", slaDeadlineHours: 24, tags: ["C2", "Network"] },
  { id: "CASE-2026-0887", title: "Macro-Enabled Doc Drop — HR Mailbox", severity: "medium", status: "pending", assignee: "Alice Kim", assigneeInitials: "AK", source: "sandbox", createdAt: "2026-06-14T10:00:00Z", slaDeadlineHours: 48, tags: ["Macro", "HR"] },
  { id: "CASE-2026-0885", title: "APT28 IOC Match — GRACEFUL SPIDER", severity: "critical", status: "resolved", assignee: "James Rodriguez", assigneeInitials: "JR", source: "detection_rule", createdAt: "2026-06-13T08:00:00Z", slaDeadlineHours: 1, tags: ["APT28", "Nation-State"] },
  { id: "CASE-2026-0884", title: "Domain Impersonation — Microsoft Clone", severity: "high", status: "resolved", assignee: "Alice Kim", assigneeInitials: "AK", source: "email", createdAt: "2026-06-12T14:00:00Z", slaDeadlineHours: 6, tags: ["Phishing", "Brand Abuse"] },
  { id: "CASE-2026-0880", title: "Spam Campaign — 312 Mailboxes", severity: "low", status: "closed", assignee: "Admin", assigneeInitials: "AD", source: "email", createdAt: "2026-06-10T09:00:00Z", slaDeadlineHours: 72, tags: ["Spam"] },
];

export async function getCases(): Promise<Case[]> {
  await sleep(400);
  return MOCK_CASES;
}

export async function updateCaseStatus(id: string, status: CaseStatus): Promise<void> {
  await sleep(200);
  void id; void status;
}

export async function createCase(data: Partial<Case>): Promise<Case> {
  await sleep(400);
  return {
    id: `CASE-2026-${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`,
    title: data.title ?? "Untitled Case",
    severity: data.severity ?? "medium",
    status: "new",
    assignee: "Unassigned",
    assigneeInitials: "?",
    source: data.source ?? "manual",
    createdAt: new Date().toISOString(),
    slaDeadlineHours: 24,
    tags: data.tags ?? [],
  };
}
