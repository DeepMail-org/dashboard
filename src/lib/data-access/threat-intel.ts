interface ThreatFeed {
  id: string;
  name: string;
  provider: string;
  type: "ip" | "domain" | "hash" | "url" | "email";
  count: number;
  lastUpdated: string;
  status: "active" | "disabled" | "testing";
}

interface IOC {
  id: string;
  value: string;
  type: "ip" | "domain" | "hash" | "url" | "email";
  severity: "critical" | "high" | "medium" | "low";
  confidence: number; // 0-100
  tags: string[];
  source: string;
  firstSeen: string;
  lastSeen: string;
  expiresAt?: string;
  malwareFamily?: string;
  adversary?: string;
  description: string;
  relatedCount: number;
}

const BASE_FEEDS: ThreatFeed[] = [
  { id: "feed-1", name: "AlienVault OTX", provider: "AlienVault", type: "ip", count: 42891, lastUpdated: "2m ago", status: "active" },
  { id: "feed-2", name: "VirusTotal Public", provider: "VirusTotal", type: "hash", count: 1284930, lastUpdated: "5m ago", status: "active" },
  { id: "feed-3", name: "MISP Community", provider: "MISP", count: 8241, lastUpdated: "1h ago", status: "active", type: "domain" },
  { id: "feed-4", name: "Abuse.ch URLhaus", provider: "Abuse.ch", type: "url", count: 93212, lastUpdated: "30m ago", status: "active" },
  { id: "feed-5", name: "Shodan Threat", provider: "Shodan", type: "ip", count: 7823, lastUpdated: "2h ago", status: "testing" },
];

export const MOCK_FEEDS: ThreatFeed[] = Array.from({ length: 5 }, (_, i) =>
  BASE_FEEDS.map(feed => ({ ...feed, id: `${feed.id}-${i}` }))
).flat();

const BASE_IOCS: IOC[] = [
  { id: "ioc-1", value: "185.220.101.34", type: "ip", severity: "critical", confidence: 97, tags: ["C2", "Emotet", "APT28"], source: "AlienVault OTX", firstSeen: "2026-06-10T08:00:00Z", lastSeen: "2026-06-15T19:00:00Z", malwareFamily: "Emotet", adversary: "TA542", description: "Known Emotet C2 server. Linked to multiple active campaigns.", relatedCount: 14 },
  { id: "ioc-2", value: "evil-cdn.ru", type: "domain", severity: "critical", confidence: 94, tags: ["Malware Hosting", "C2"], source: "MISP", firstSeen: "2026-06-08T12:00:00Z", lastSeen: "2026-06-15T18:45:00Z", malwareFamily: "Cobalt Strike", description: "Attacker-controlled CDN domain used to host malicious payloads.", relatedCount: 8 },
  { id: "ioc-3", value: "https://microsft-alert.com/verify", type: "url", severity: "high", confidence: 91, tags: ["Phishing", "Brand Abuse", "SCATTERED SPIDER"], source: "DeepMail ML", firstSeen: "2026-06-14T16:00:00Z", lastSeen: "2026-06-15T17:00:00Z", adversary: "SCATTERED SPIDER", description: "Phishing URL impersonating Microsoft authentication flow.", relatedCount: 3 },
  { id: "ioc-4", value: "a8f3c2d1e5b6f7a2c9d0e1f4b8c7d2e3", type: "hash", severity: "high", confidence: 88, tags: ["Ransomware", "LockBit"], source: "VirusTotal", firstSeen: "2026-06-01T00:00:00Z", lastSeen: "2026-06-15T12:00:00Z", malwareFamily: "LockBit 3.0", description: "LockBit ransomware binary. SHA-256 matches known encryptor variant.", relatedCount: 22 },
  { id: "ioc-5", value: "payments@ext-vendor.xyz", type: "email", severity: "medium", confidence: 74, tags: ["BEC", "Finance"], source: "DeepMail Email Gateway", firstSeen: "2026-06-15T10:00:00Z", lastSeen: "2026-06-15T10:00:00Z", description: "BEC sender email attempting financial fraud targeting finance department.", relatedCount: 1 },
  { id: "ioc-6", value: "103.45.67.89", type: "ip", severity: "high", confidence: 85, tags: ["Dropper", "Emotet"], source: "Abuse.ch", firstSeen: "2026-06-12T14:00:00Z", lastSeen: "2026-06-15T16:30:00Z", malwareFamily: "Emotet", description: "Secondary Emotet download server distributing updated dropper payloads.", relatedCount: 6 },
  { id: "ioc-7", value: "dhl-tracking.info", type: "domain", severity: "medium", confidence: 79, tags: ["DGA", "C2", "Cobalt Strike"], source: "AlienVault OTX", firstSeen: "2026-06-13T09:00:00Z", lastSeen: "2026-06-15T15:00:00Z", malwareFamily: "Cobalt Strike", description: "DGA-generated domain used for DNS beaconing by Cobalt Strike implant.", relatedCount: 4 },
];

export const MOCK_IOCS: IOC[] = Array.from({ length: 6 }, (_, i) =>
  BASE_IOCS.map(ioc => ({ ...ioc, id: `${ioc.id}-${i}` }))
).flat();
