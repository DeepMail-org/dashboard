import { MailItem, Severity } from "./types";

const FIRST_NAMES = ["James", "Maria", "David", "Mary", "Michael", "Linda", "Robert", "Barbara", "John", "Elizabeth", "William", "Jennifer", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const DOMAINS = ["corp-finance.net", "company.com", "microsft-alert.com", "dhl-tracking.info", "temp-mail.ru", "gmail.com", "yahoo.com", "outlook.com", "startup.io", "tech-solutions.biz"];

const TOPICS = [
  "Kindly check this latest updated",
  "Literature from 45 BC",
  "Latin professor at Hampden-Sydney",
  "the cites of the word in classical",
  "All the Lorem Ipsum generators on the",
  "Latin words, combined with a handful",
  "Urgent: Wire Transfer Required",
  "Your account has been compromised",
  "Package delivery failed",
  "Q4 Security Report",
  "Updated Employee Benefits"
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockMails(count: number): MailItem[] {
  const mails: MailItem[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const fn = randomElement(FIRST_NAMES);
    const ln = randomElement(LAST_NAMES);
    const domain = randomElement(DOMAINS);
    const isThreat = Math.random() > 0.7; // 30% are threats
    const severity: Severity = isThreat 
      ? (Math.random() > 0.5 ? "critical" : (Math.random() > 0.5 ? "high" : "medium"))
      : "clean";
      
    const status = severity === "critical" && Math.random() > 0.5 ? "quarantined" : "active";
    const folder = status === "quarantined" ? "spam" : "inbox";
    const timestamp = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // within last 7 days
    
    // Add realistic labels
    const labels = [];
    if (Math.random() > 0.8) labels.push("Promotional");
    if (Math.random() > 0.8) labels.push("Social");
    if (isThreat && severity === "critical") labels.push("BEC");

    mails.push({
      id: `m-${1000 + i}`,
      sender: `${fn} ${ln}`,
      senderEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`,
      initials: `${fn[0]}${ln[0]}`,
      subject: randomElement(TOPICS),
      preview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum hendrerit lobortis. Nullam ut lacus eros. Sed at luctus urna, eu fermentum diam. In et tristique mauris.",
      time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp,
      unread: Math.random() > 0.5,
      severity,
      labels,
      threat: isThreat ? {
        classification: severity === "critical" ? "Business Email Compromise (BEC)" : "Credential Phishing",
        confidence: 75 + Math.random() * 24, // 75-99
        originIp: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        originCountry: randomElement(["RU", "CN", "RO", "UA", "BR", "NG"]),
        mitre: ["T1566.001", "T1566.002"],
        similarCampaigns: Math.floor(Math.random() * 100),
        mlExplainability: [
          { feature: "Reply-To Mismatch", contribution: 45 },
          { feature: "Suspicious Domain Age", contribution: 25 },
          { feature: "Urgency Language", contribution: 30 }
        ]
      } : undefined,
      auth: {
        spf: !isThreat || Math.random() > 0.5,
        dkim: !isThreat || Math.random() > 0.5,
        dmarc: !isThreat || Math.random() > 0.5,
      },
      to: "andrew@company.com",
      date: new Date(timestamp).toUTCString(),
      body: [
        `Hello Andrew,`,
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum hendrerit lobortis. Nullam ut lacus eros. Sed at luctus urna, eu fermentum diam. In et tristique mauris.`,
        `Ut id ornare metus, sed auctor enim. Pellentesque nisi magna, laoreet a augue eget, tempor volutpat diam.`,
        `Regards,\n${fn} ${ln}`
      ],
      attachments: Math.random() > 0.7 ? [
        { id: `att-${i}-1`, name: "invoice.pdf", size: 2048576, type: "application/pdf", threat: isThreat ? { isMalicious: true, vtScore: 45, family: "Emotet" } : undefined },
      ] : [],
      starred: Math.random() > 0.9,
      folder,
      status
    });
  }

  // Sort descending by default
  return mails.sort((a, b) => b.timestamp - a.timestamp);
}

export const DEMO_MAILS = generateMockMails(200);
