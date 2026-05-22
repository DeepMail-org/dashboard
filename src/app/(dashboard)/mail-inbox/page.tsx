"use client";

import { useState, useMemo } from "react";
import {
  Mail, Search, Shield, AlertTriangle, CheckCircle, XCircle,
  Clock, ChevronRight, Archive, Trash2, RotateCcw, Flag,
} from "lucide-react";

type Severity = "critical" | "high" | "medium" | "clean";
type Tab = "all" | "threats" | "quarantined" | "clean";

interface MailItem {
  id: string;
  sender: string;
  senderEmail: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  severity: Severity;
  badges: { label: string; severity: Severity }[];
  threat?: {
    classification: string;
    confidence: number;
    originIp: string;
    originCountry: string;
    mitre: string;
    replyToMismatch?: string;
    similarCampaigns: string;
  };
  auth: { spf: boolean; dkim: boolean; dmarc: boolean };
  to: string;
  date: string;
  body: string[];
}

const DEMO_MAILS: MailItem[] = [
  {
    id: "m-001",
    sender: "Bob Wilson (spoofed)",
    senderEmail: "bob.wilson@corp-finance.net",
    initials: "BW",
    subject: "Urgent: Wire Transfer Required - Invoice #8821",
    preview: "Hi, please process the attached wire transfer immediately for vendor payment...",
    time: "2m ago",
    unread: true,
    severity: "critical",
    badges: [
      { label: "BEC", severity: "critical" },
      { label: "Critical", severity: "critical" },
    ],
    threat: {
      classification: "Business Email Compromise (BEC)",
      confidence: 98.7,
      originIp: "185.234.72.19",
      originCountry: "RU",
      mitre: "T1566.001 - Spearphishing",
      replyToMismatch: "payments@ext-vendor.xyz",
      similarCampaigns: "12 seen in last 7 days",
    },
    auth: { spf: false, dkim: false, dmarc: false },
    to: "finance@company.com",
    date: "May 16, 2026 21:45 UTC",
    body: [
      "Hi,",
      "Please process the attached wire transfer immediately for vendor payment. The amount of $47,500 needs to be sent to the new account details in the attached PDF before end of business today.",
      "This is time-sensitive and has been approved by the CFO. Please do not reply to this email — call me directly if you have questions.",
      "Best regards,\nBob Wilson\nVP Finance",
    ],
  },
  {
    id: "m-002",
    sender: "Microsoft Security",
    senderEmail: "security@microsft-alert.com",
    initials: "MS",
    subject: "Your account has been compromised - Verify now",
    preview: "We detected unusual sign-in activity on your Microsoft account...",
    time: "14m ago",
    unread: true,
    severity: "high",
    badges: [{ label: "Phishing", severity: "high" }],
    threat: {
      classification: "Credential Phishing",
      confidence: 94.2,
      originIp: "103.45.67.89",
      originCountry: "CN",
      mitre: "T1566.002 - Spearphishing Link",
      similarCampaigns: "847 seen in last 30 days",
    },
    auth: { spf: false, dkim: false, dmarc: false },
    to: "admin@company.com",
    date: "May 16, 2026 21:31 UTC",
    body: [
      "Dear User,",
      "We detected unusual sign-in activity on your Microsoft account from an unrecognized location. To protect your account, we've temporarily limited some features.",
      "Please verify your identity by clicking the link below within 24 hours to restore full access to your account.",
      "Verify Your Account →",
      "If you did not attempt to sign in, please secure your account immediately.",
      "The Microsoft Security Team",
    ],
  },
  {
    id: "m-003",
    sender: "DHL Shipping",
    senderEmail: "noreply@dhl-tracking.info",
    initials: "DH",
    subject: "Package delivery failed - Update address",
    preview: "Your package could not be delivered. Please update your shipping address...",
    time: "28m ago",
    unread: true,
    severity: "medium",
    badges: [{ label: "Suspicious", severity: "medium" }],
    threat: {
      classification: "Brand Impersonation",
      confidence: 78.5,
      originIp: "91.234.56.78",
      originCountry: "RO",
      mitre: "T1566.001 - Spearphishing Attachment",
      similarCampaigns: "34 seen in last 7 days",
    },
    auth: { spf: true, dkim: false, dmarc: false },
    to: "user@company.com",
    date: "May 16, 2026 21:17 UTC",
    body: [
      "Dear Customer,",
      "Your package (Tracking #DHL-8847291) could not be delivered due to an incomplete address. Please update your shipping information to reschedule delivery.",
      "Update Delivery Address →",
      "If you do not update within 48 hours, the package will be returned to sender.",
      "DHL Express Customer Service",
    ],
  },
  {
    id: "m-004",
    sender: "Jane Davis",
    senderEmail: "jane.davis@company.com",
    initials: "JD",
    subject: "Q4 Security Report - Final Draft",
    preview: "Attached is the final draft of the Q4 security report for your review...",
    time: "1h ago",
    unread: false,
    severity: "clean",
    badges: [{ label: "Clean", severity: "clean" }],
    auth: { spf: true, dkim: true, dmarc: true },
    to: "security-team@company.com",
    date: "May 16, 2026 20:45 UTC",
    body: [
      "Hi team,",
      "Attached is the final draft of the Q4 security report for your review. Key highlights include a 23% reduction in phishing incidents and improved DMARC adoption across partner domains.",
      "Please review and provide any feedback by Friday. I'll present this to the board next Tuesday.",
      "Thanks,\nJane Davis\nSecurity Analyst",
    ],
  },
  {
    id: "m-005",
    sender: "HR Department",
    senderEmail: "hr@company.com",
    initials: "HR",
    subject: "Updated Employee Benefits - Action Required",
    preview: "Please review the updated benefits package and confirm your selections...",
    time: "2h ago",
    unread: false,
    severity: "clean",
    badges: [{ label: "Clean", severity: "clean" }],
    auth: { spf: true, dkim: true, dmarc: true },
    to: "all-staff@company.com",
    date: "May 16, 2026 19:45 UTC",
    body: [
      "Dear Team,",
      "We're pleased to announce updates to our employee benefits package for 2026. Please review the changes and confirm your selections in the HR portal by May 30th.",
      "Key changes include expanded mental health coverage, increased HSA contribution limits, and a new commuter benefits program.",
      "If you have questions, please reach out to the HR team.",
      "Best,\nHuman Resources",
    ],
  },
  {
    id: "m-006",
    sender: "Unknown Sender",
    senderEmail: "x4829@temp-mail.ru",
    initials: "??",
    subject: "invoice_march_2024.pdf.exe",
    preview: "Please find attached the invoice for March 2024 services rendered...",
    time: "3h ago",
    unread: true,
    severity: "critical",
    badges: [{ label: "Malware", severity: "critical" }],
    threat: {
      classification: "Malware Delivery (Trojan Dropper)",
      confidence: 99.1,
      originIp: "45.142.213.87",
      originCountry: "UA",
      mitre: "T1204.002 - User Execution: Malicious File",
      similarCampaigns: "6 seen in last 24 hours",
    },
    auth: { spf: false, dkim: false, dmarc: false },
    to: "accounts@company.com",
    date: "May 16, 2026 18:30 UTC",
    body: [
      "Dear Sir/Madam,",
      "Please find attached the invoice for March 2024 services rendered. Kindly process the payment at your earliest convenience.",
      "The attached file contains the detailed breakdown of charges.",
      "Regards,\nAccounts Department",
    ],
  },
];

const SEVERITY_STYLES: Record<Severity, { badge: string; avatar: string }> = {
  critical: {
    badge: "text-danger bg-danger/10 border border-danger/20",
    avatar: "bg-danger/15 text-danger",
  },
  high: {
    badge: "text-orange bg-orange/10 border border-orange/20",
    avatar: "bg-orange/15 text-orange",
  },
  medium: {
    badge: "text-warning bg-warning/10 border border-warning/20",
    avatar: "bg-warning/15 text-warning",
  },
  clean: {
    badge: "text-success bg-success/10 border border-success/20",
    avatar: "bg-success/15 text-success",
  },
};

function AuthBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      <strong className="font-medium text-fg">{label}:</strong>
      <span className={pass ? "text-success" : "text-danger"}>
        {pass ? "PASS" : "FAIL"}
      </span>
    </span>
  );
}

export default function MailInboxPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedId, setSelectedId] = useState<string>("m-001");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let mails = DEMO_MAILS;
    if (activeTab === "threats") mails = mails.filter((m) => m.severity !== "clean");
    else if (activeTab === "quarantined") mails = mails.filter((m) => m.severity === "critical");
    else if (activeTab === "clean") mails = mails.filter((m) => m.severity === "clean");

    if (search) {
      const q = search.toLowerCase();
      mails = mails.filter(
        (m) =>
          m.sender.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q),
      );
    }
    return mails;
  }, [activeTab, search]);

  const selected = DEMO_MAILS.find((m) => m.id === selectedId) ?? DEMO_MAILS[0];

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "threats", label: "Threats" },
    { key: "quarantined", label: "Quarantined" },
    { key: "clean", label: "Clean" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Mail List Panel */}
      <div className="flex w-95 shrink-0 flex-col border-r border-border">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
                  activeTab === tab.key
                    ? "bg-fg/8 text-fg"
                    : "text-muted hover:text-fg"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] text-muted">{filtered.length} new</span>
        </div>

        <div className="border-b border-border px-5 py-2">
          <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Search emails..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-fg placeholder:text-muted outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((mail) => (
            <button
              key={mail.id}
              onClick={() => setSelectedId(mail.id)}
              className={`flex w-full gap-3 border-b border-fg/3 px-5 py-3.5 text-left transition-colors ${
                selectedId === mail.id
                  ? "border-l-2 border-l-accent bg-accent/8"
                  : "hover:bg-fg/3"
              }`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${SEVERITY_STYLES[mail.severity].avatar}`}
              >
                {mail.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${mail.unread ? "font-semibold text-fg" : "text-muted"}`}
                  >
                    {mail.sender}
                  </span>
                  <span className="font-mono text-[10px] text-muted">{mail.time}</span>
                </div>
                <div
                  className={`truncate text-xs ${mail.unread ? "text-fg" : "text-muted"}`}
                >
                  {mail.subject}
                </div>
                <div className="truncate text-[11px] text-fg/35">{mail.preview}</div>
                <div className="mt-1 flex gap-1">
                  {mail.badges.map((b) => (
                    <span
                      key={b.label}
                      className={`rounded-[3px] px-1.5 py-px text-[9px] font-semibold uppercase ${SEVERITY_STYLES[b.severity].badge}`}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mail Detail Panel */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Detail Header */}
        <div className="border-b border-border px-8 py-6">
          <div className="mb-3 flex items-start justify-between">
            <h2 className="text-base font-medium text-fg">{selected.subject}</h2>
            <div className="flex gap-2">
              <button className="rounded-md border border-border p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-fg">
                <Archive className="h-3.5 w-3.5" />
              </button>
              <button className="rounded-md border border-border p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-fg">
                <Flag className="h-3.5 w-3.5" />
              </button>
              <button className="rounded-md border border-danger/30 p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
            <span>
              <strong className="font-medium text-fg">From:</strong> {selected.senderEmail}
              {selected.severity !== "clean" && " (spoofed)"}
            </span>
            <span>
              <strong className="font-medium text-fg">To:</strong> {selected.to}
            </span>
            <span>
              <strong className="font-medium text-fg">Date:</strong> {selected.date}
            </span>
            <AuthBadge label="SPF" pass={selected.auth.spf} />
            <AuthBadge label="DKIM" pass={selected.auth.dkim} />
            <AuthBadge label="DMARC" pass={selected.auth.dmarc} />
          </div>
        </div>

        {/* Threat Intelligence Panel */}
        {selected.threat && (
          <div className="mx-8 mt-6 rounded-[10px] border border-danger/20 bg-danger/3 p-5">
            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-danger">
              <AlertTriangle className="h-3.5 w-3.5" />
              Threat Intelligence Report
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] text-muted">Classification</div>
                <div className="font-mono text-[11px] text-fg">{selected.threat.classification}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted">Confidence</div>
                <div className="font-mono text-[11px] text-danger">{selected.threat.confidence}%</div>
              </div>
              <div>
                <div className="text-[11px] text-muted">Origin IP</div>
                <div className="font-mono text-[11px] text-fg">
                  {selected.threat.originIp} ({selected.threat.originCountry})
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted">MITRE ATT&CK</div>
                <div className="font-mono text-[11px] text-fg">{selected.threat.mitre}</div>
              </div>
              {selected.threat.replyToMismatch && (
                <div>
                  <div className="text-[11px] text-muted">Reply-To Mismatch</div>
                  <div className="font-mono text-[11px] text-fg">{selected.threat.replyToMismatch}</div>
                </div>
              )}
              <div>
                <div className="text-[11px] text-muted">Similar Campaigns</div>
                <div className="font-mono text-[11px] text-fg">{selected.threat.similarCampaigns}</div>
              </div>
            </div>
          </div>
        )}

        {/* Clean indicator */}
        {!selected.threat && (
          <div className="mx-8 mt-6 rounded-[10px] border border-success/20 bg-success/3 p-5">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-success">No threats detected</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              Email authentication passed all checks (SPF, DKIM, DMARC). Content analysis found no
              malicious indicators.
            </p>
          </div>
        )}

        {/* Mail Body */}
        <div className="flex-1 px-8 py-8">
          {selected.body.map((paragraph, i) => (
            <p key={i} className="mb-4 text-[13px] leading-relaxed text-fg/80 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Action Bar */}
        {selected.severity !== "clean" && (
          <div className="sticky bottom-0 border-t border-border bg-bg/80 px-8 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-danger/15 px-4 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/25">
                <XCircle className="h-3.5 w-3.5" />
                Quarantine
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-hover hover:text-fg">
                <RotateCcw className="h-3.5 w-3.5" />
                Release
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-hover hover:text-fg">
                <Shield className="h-3.5 w-3.5" />
                Create Detection Rule
              </button>
              <span className="ml-auto text-[10px] text-dimmed">
                Auto-quarantined by ML engine at {selected.date}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
