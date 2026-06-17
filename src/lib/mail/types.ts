export type Severity = "critical" | "high" | "medium" | "clean";
export type ActionType = "quarantine" | "release" | "case" | "sandbox" | "rule" | "ioc" | "share" | "block_sender" | "block_domain";

export interface MailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  threat?: {
    isMalicious: boolean;
    family?: string;
    vtScore?: number;
  };
}

export interface MailThreat {
  classification: string;
  confidence: number; // 0-100
  originIp: string;
  originCountry: string;
  mitre: string[]; // e.g. ["T1566.001"]
  replyToMismatch?: string;
  similarCampaigns: number;
  mlExplainability: {
    feature: string;
    contribution: number; // percentage
  }[];
}

export interface MailItem {
  id: string;
  sender: string;
  senderEmail: string;
  initials: string;
  subject: string;
  preview: string;
  time: string; // "2m ago" or Date string
  timestamp: number;
  unread: boolean;
  severity: Severity;
  labels: string[]; // e.g. "Promotional", "Social", "Health", "BEC", "Phishing"
  threat?: MailThreat;
  auth: { spf: boolean; dkim: boolean; dmarc: boolean };
  to: string;
  date: string;
  body: string[];
  attachments: MailAttachment[];
  starred: boolean;
  folder: "inbox" | "sent" | "drafts" | "spam" | "trash" | "archive";
  status: "active" | "quarantined" | "released";
}

export interface MailFilters {
  folder: string;
  search: string;
  severity: string[];
  labels: string[];
  unreadOnly: boolean;
  hasAttachments: boolean;
  starred: boolean;
  important: boolean;
}

export interface MailListResponse {
  data: MailItem[];
  nextCursor: number | null;
  total: number;
}
