const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type VulnSeverity = "critical" | "high" | "medium" | "low";
type VulnStatus = "open" | "in_remediation" | "resolved" | "suppressed";

export interface Vulnerability {
  cveId: string;
  title: string;
  severity: VulnSeverity;
  cvssScore: number;
  exPrtRating: "critical" | "high" | "medium" | "low";
  exploitStatus: "exploited" | "poc_available" | "no_known_exploit";
  description: string;
  affectedCount: number;
  publishDate: string;
  dataProviders: string[];
  utilityType: string;
  vulnerabilityType: string;
}

export interface AffectedHost {
  hostname: string;
  assetCriticality: "critical" | "high" | "medium" | "low";
  remediation: string;
  vulnerableVersion: string;
  patchVersion: string;
  status: VulnStatus;
  daysOpen: number;
}

const BASE_VULNERABILITIES: Vulnerability[] = [
  {
    cveId: "CVE-2024-55956",
    title: "Cleo Harmony/VLTrader/LexiCom Remote Code Execution",
    severity: "critical",
    cvssScore: 9.8,
    exPrtRating: "critical",
    exploitStatus: "exploited",
    description: "CVE-2024-55956 is a critical vulnerability in Cleo software versions prior to 5.8.0.24, where an unauthenticated user can import and execute arbitrary Bash or PowerShell commands on the host system by exploiting the default settings of the Autorun directory.",
    affectedCount: 287,
    publishDate: "2024-11-12",
    dataProviders: ["Falcon Sensor", "NVD"],
    utilityType: "—",
    vulnerabilityType: "Vulnerability",
  },
  {
    cveId: "CVE-2024-49113",
    title: "Windows LDAP Remote Code Execution Vulnerability",
    severity: "critical",
    cvssScore: 9.1,
    exPrtRating: "critical",
    exploitStatus: "poc_available",
    description: "A critical Windows LDAP vulnerability allowing remote code execution via specially crafted LDAP requests.",
    affectedCount: 142,
    publishDate: "2024-12-10",
    dataProviders: ["Falcon Sensor"],
    utilityType: "—",
    vulnerabilityType: "Vulnerability",
  },
  {
    cveId: "CVE-2024-38189",
    title: "Microsoft Project Remote Code Execution",
    severity: "high",
    cvssScore: 8.8,
    exPrtRating: "high",
    exploitStatus: "exploited",
    description: "A remote code execution vulnerability in Microsoft Project triggered by opening a specially crafted file.",
    affectedCount: 67,
    publishDate: "2024-08-13",
    dataProviders: ["Falcon Sensor"],
    utilityType: "—",
    vulnerabilityType: "Vulnerability",
  },
];

export const MOCK_VULNERABILITIES: Vulnerability[] = Array.from({ length: 15 }, (_, i) => 
  BASE_VULNERABILITIES.map(v => ({
    ...v,
    cveId: `${v.cveId}-${i}`,
  }))
).flat();

const MOCK_AFFECTED_HOSTS: AffectedHost[] = [
  { hostname: "SE-EMO-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 29 },
  { hostname: "SE-SMO-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 36 },
  { hostname: "FRUGAL-ANT-DC", assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 29 },
  { hostname: "SE-OSH-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 22 },
  { hostname: "SE-WSI-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 34 },
  { hostname: "EC2AMAZ-BH9GUA",assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 61 },
  { hostname: "SE-OBE-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 36 },
  { hostname: "SE-KBR-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 40 },
  { hostname: "SE-MCO-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 61 },
  { hostname: "SE-MAL-RDP",    assetCriticality: "critical", remediation: "Update", vulnerableVersion: "5.8.0.22", patchVersion: "5.8.0.24", status: "open", daysOpen: 4 },
];

export async function getCveDetail(cveId: string): Promise<Vulnerability | null> {
  await sleep(300);
  return MOCK_VULNERABILITIES.find((v) => v.cveId === cveId) ?? null;
}

export async function getAffectedHosts(_cveId: string): Promise<AffectedHost[]> {
  await sleep(400);
  return MOCK_AFFECTED_HOSTS;
}
