import { MailFilters, MailItem, MailListResponse } from "./types";
import { DEMO_MAILS } from "./mock-data";

// In-memory "database" to support optimistic updates and persistent modifications
// during the lifetime of the dashboard
const mockDatabase: MailItem[] = [...DEMO_MAILS];

// Utility to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mailApi = {
  // Fetch a paginated list of emails
  async getMails(filters: MailFilters, cursor: number = 0, limit: number = 20): Promise<MailListResponse> {
    await delay(300); // simulate network latency
    
    let filtered = mockDatabase.filter((mail) => {
      // 1. Folder match
      if (filters.folder !== "all" && mail.folder !== filters.folder) return false;
      
      // 2. Unread match
      if (filters.unreadOnly && !mail.unread) return false;

      // 3. Search text match
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesSearch = 
          mail.subject.toLowerCase().includes(q) ||
          mail.sender.toLowerCase().includes(q) ||
          mail.senderEmail.toLowerCase().includes(q) ||
          mail.preview.toLowerCase().includes(q) ||
          mail.body.some(b => b.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // 4. Severity match
      if (filters.severity.length > 0 && !filters.severity.includes(mail.severity)) {
        return false;
      }

      // 5. Labels match
      if (filters.labels.length > 0) {
        const hasLabel = mail.labels.some(l => filters.labels.includes(l.toLowerCase()));
        if (!hasLabel) return false;
      }

      // 6. Has Attachments match
      if (filters.hasAttachments && mail.attachments.length === 0) return false;

      // 7. Starred match
      if (filters.starred && !mail.starred) return false;

      // 8. Important match (Custom rule: critical/high severity or from specific domains/VIPs, let's simplify to starred or high/critical severity)
      if (filters.important && !mail.starred && mail.severity !== "critical" && mail.severity !== "high") return false;

      return true;
    });

    // Sort by timestamp descending
    filtered = filtered.sort((a, b) => b.timestamp - a.timestamp);

    const data = filtered.slice(cursor, cursor + limit);
    const nextCursor = cursor + limit < filtered.length ? cursor + limit : null;

    return {
      data,
      nextCursor,
      total: filtered.length,
    };
  },

  // Perform an action on an email (Quarantine, Release, Archive, etc)
  async performAction(mailId: string, action: string, metadata?: unknown): Promise<{ success: boolean; message: string }> {
    await delay(400); // simulate network

    const index = mockDatabase.findIndex(m => m.id === mailId);
    if (index === -1) throw new Error("Mail not found");

    const mail = mockDatabase[index];

    switch (action) {
      case "quarantine":
        mockDatabase[index] = { ...mail, status: "quarantined", folder: "spam" };
        return { success: true, message: "Email moved to quarantine." };
      case "release":
        mockDatabase[index] = { ...mail, status: "released", folder: "inbox" };
        return { success: true, message: "Email released to inbox." };
      case "archive":
        mockDatabase[index] = { ...mail, folder: "archive" };
        return { success: true, message: "Email archived." };
      case "trash":
        mockDatabase[index] = { ...mail, folder: "trash" };
        return { success: true, message: "Email moved to trash." };
      case "star":
        mockDatabase[index] = { ...mail, starred: !mail.starred };
        return { success: true, message: mail.starred ? "Removed star." : "Starred email." };
      case "read":
        mockDatabase[index] = { ...mail, unread: false };
        return { success: true, message: "Marked as read." };
      case "unread":
        mockDatabase[index] = { ...mail, unread: true };
        return { success: true, message: "Marked as unread." };
      case "case":
        return { success: true, message: `Created Case #${Math.floor(Math.random() * 10000)} for this threat.` };
      case "sandbox":
        return { success: true, message: `Submitted ${(metadata as { attachmentId?: string })?.attachmentId || "email"} to Sandbox.` };
      case "rule":
        return { success: true, message: "Detection rule generated successfully." };
      case "ioc":
        return { success: true, message: "IOC extracted and sent to threat feed." };
      case "share":
        return { success: true, message: "Case shared with team." };
      case "block_sender":
        return { success: true, message: `Blocked sender ${mail.senderEmail}.` };
      case "block_domain":
        const domain = mail.senderEmail.split("@")[1];
        return { success: true, message: `Blocked domain @${domain}.` };
      default:
        return { success: true, message: "Action completed." };
    }
  },

  // Simulate pushing a new email via WebSocket
  simulateNewEmail(email: MailItem) {
    mockDatabase.unshift(email);
  }
};
