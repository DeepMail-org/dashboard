const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Severity = "critical" | "high" | "medium" | "low";
export type DetectionStatus = "new" | "in_progress" | "resolved" | "closed";

export interface Detection {
  id: string;
  severity: Severity;
  detectTime: string;
  name: string;
  category: string;
  mitreTactic: string;
  mitreId: string;
  triggeringFile?: string;
  hostname: string;
  username?: string;
  assignedTo: string;
  resolution: string;
  status: DetectionStatus;
  vendor: string;
  sourceProduct: string;
  description: string;
  relatedIocs: string[];
  adversary?: string;
}

export interface DetectionFilters {
  severity?: Severity[];
  status?: DetectionStatus[];
  assignedTo?: string;
  category?: string;
  adversary?: string;
  search?: string;
  timeRange?: "1h" | "6h" | "24h" | "7d" | "30d";
}

export const MOCK_DETECTIONS: Detection[] = [
  {
    id: "DET-2026-8841",
    severity: "critical",
    detectTime: "2026-06-15T19:22:48Z",
    name: "BEC Wire Transfer Pattern",
    category: "Phishing",
    mitreTactic: "Initial Access",
    mitreId: "T1566",
    triggeringFile: "invoice_Q4.pdf",
    hostname: "SE-ADM-RDP",
    username: "vultxane",
    assignedTo: "Administrator",
    resolution: "Unassigned",
    status: "new",
    vendor: "CrowdStrike",
    sourceProduct: "Falcon Insight",
    description: "Business Email Compromise pattern detected. Wire transfer instruction embedded in PDF with spoofed sender domain. Matches GRACEFUL_SPIDER campaign TTPs.",
    relatedIocs: ["185.220.101.34", "evil-cdn.ru", "a8f3c2d1..."],
    adversary: "GRACEFUL SPIDER",
  },
  {
    id: "DET-2026-8840",
    severity: "critical",
    detectTime: "2026-06-15T19:14:22Z",
    name: "Emotet Dropper Signature",
    category: "Malware",
    mitreTactic: "Execution",
    mitreId: "T1059",
    triggeringFile: "macro_doc.xlsm",
    hostname: "SE-KME-RDP",
    username: "alice_kim",
    assignedTo: "Unassigned",
    resolution: "—",
    status: "new",
    vendor: "DeepMail",
    sourceProduct: "Sandbox ML",
    description: "Emotet dropper detected via YARA signature DM-MAL-014. Document contains malicious VBA macros that download secondary payload from C2 infrastructure.",
    relatedIocs: ["103.45.67.89", "b7c4d2e1..."],
  },
  {
    id: "DET-2026-8839",
    severity: "high",
    detectTime: "2026-06-15T19:05:11Z",
    name: "Credential Harvest Login Clone",
    category: "Credential",
    mitreTactic: "Credential Access",
    mitreId: "T1056",
    hostname: "SE-YNA-RDP",
    username: "james_rod",
    assignedTo: "Alice Kim",
    resolution: "—",
    status: "in_progress",
    vendor: "DeepMail",
    sourceProduct: "NLP Classifier",
    description: "Login page clone detected mimicking Microsoft O365 authentication. URL redirects to attacker-controlled domain for credential capture.",
    relatedIocs: ["https://microsft-alert.com/verify"],
    adversary: "SCATTERED SPIDER",
  },
  {
    id: "DET-2026-8838",
    severity: "high",
    detectTime: "2026-06-15T18:32:44Z",
    name: "C2 Beacon DNS Pattern",
    category: "C2",
    mitreTactic: "Command and Control",
    mitreId: "T1071",
    triggeringFile: "beacon.exe",
    hostname: "SE-KTH-W2019-DT",
    username: "tara_s",
    assignedTo: "Unassigned",
    resolution: "—",
    status: "new",
    vendor: "DeepMail",
    sourceProduct: "Network ML",
    description: "DNS beaconing pattern consistent with Cobalt Strike implant. Periodic DNS requests to DGA domain with encoded payload in subdomain field.",
    relatedIocs: ["dhl-tracking.info"],
  },
  {
    id: "DET-2026-8837",
    severity: "medium",
    detectTime: "2026-06-15T17:55:30Z",
    name: "Impersonation Display Name",
    category: "Phishing",
    mitreTactic: "Initial Access",
    mitreId: "T1566.001",
    hostname: "SE-PME-RDP",
    username: "finance_user",
    assignedTo: "Unassigned",
    resolution: "—",
    status: "new",
    vendor: "DeepMail",
    sourceProduct: "Email Gateway",
    description: "Email display name impersonates CEO. Reply-to mismatch detected. Social engineering attack targeting finance department.",
    relatedIocs: ["payments@ext-vendor.xyz"],
  },
  {
    id: "DET-2026-8835",
    severity: "high",
    detectTime: "2026-06-15T16:41:05Z",
    name: "NLP Intent Classifier Alert",
    category: "ML Model",
    mitreTactic: "Initial Access",
    mitreId: "T1566",
    hostname: "SE-JDE-RDP",
    username: "hr_mgr",
    assignedTo: "Administrator",
    resolution: "True Positive",
    status: "resolved",
    vendor: "DeepMail",
    sourceProduct: "NLP Classifier v3",
    description: "ML model detected high-confidence phishing intent. Confidence score 0.94. Email contains urgency language and embedded malicious link.",
    relatedIocs: [],
  },
  {
    id: "DET-2026-8830",
    severity: "low",
    detectTime: "2026-06-15T14:10:22Z",
    name: "Bulk Sender Reputation Score",
    category: "Spam",
    mitreTactic: "Initial Access",
    mitreId: "T1566",
    hostname: "SE-FMA-RDP",
    username: "all_users",
    assignedTo: "Unassigned",
    resolution: "—",
    status: "closed",
    vendor: "DeepMail",
    sourceProduct: "Reputation Engine",
    description: "Bulk sender flagged due to low reputation score (12/100). Mass campaign targeting 312 mailboxes in organization.",
    relatedIocs: [],
  },
];

export async function getDetections(filters?: DetectionFilters): Promise<Detection[]> {
  await sleep(400);
  let results = [...MOCK_DETECTIONS];
  if (filters?.severity?.length) {
    results = results.filter((d) => filters.severity!.includes(d.severity));
  }
  if (filters?.status?.length) {
    results = results.filter((d) => filters.status!.includes(d.status));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.hostname.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.adversary?.toLowerCase().includes(q),
    );
  }
  return results;
}

export async function assignDetection(id: string, assignee: string): Promise<void> {
  await sleep(200);
  void id; void assignee;
}

export async function resolveDetection(id: string, resolution: string): Promise<void> {
  await sleep(200);
  void id; void resolution;
}

export async function createCaseFromDetection(detectionId: string): Promise<string> {
  await sleep(400);
  void detectionId;
  return `CASE-2026-${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`;
}
