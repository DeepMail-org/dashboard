const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface MitreTechnique {
  id: string;
  name: string;
  count: number;
  subtechniques?: MitreTechnique[];
}

export interface MitreTactic {
  id: string;
  name: string;
  techniques: MitreTechnique[];
}

export interface MitreMatrix {
  totalEvents: number;
  maxCount: number;
  tactics: MitreTactic[];
}

export const MITRE_MATRIX_DATA: MitreMatrix = {
  totalEvents: 192,
  maxCount: 192,
  tactics: [
    {
      id: "TA0001", name: "Initial Access",
      techniques: [
        { id: "T1566",   name: "Phishing",                     count: 192 },
        { id: "T1190",   name: "Exploit Public-Facing App",     count: 12 },
        { id: "T1192",   name: "Spearphishing Link",            count: 10 },
        { id: "T1078",   name: "Valid Accounts",                count: 8 },
        { id: "T1193",   name: "Spearphishing Attachment",      count: 6 },
        { id: "T1189",   name: "Drive-by Compromise",           count: 4 },
        { id: "T1195",   name: "Supply Chain Compromise",       count: 4 },
        { id: "T1133",   name: "External Remote Services",      count: 2 },
        { id: "T1199",   name: "Trusted Relationship",          count: 2 },
      ],
    },
    {
      id: "TA0002", name: "Execution",
      techniques: [
        { id: "T1059",   name: "Command and Scripting Interpreter", count: 46 },
        { id: "T1204",   name: "User Execution",                    count: 33 },
        { id: "T1053",   name: "Scheduled Task/Job",                count: 9 },
        { id: "T1106",   name: "Native API",                        count: 7 },
        { id: "T1047",   name: "Windows Management Instrumentation", count: 7 },
        { id: "T1203",   name: "Exploitation for Client Execution",  count: 6 },
        { id: "T1129",   name: "Shared Modules",                    count: 4 },
        { id: "T1170",   name: "Mshta",                             count: 1 },
        { id: "T1064",   name: "Scripting",                         count: 1 },
        { id: "T1569",   name: "System Services",                   count: 1 },
      ],
    },
    {
      id: "TA0003", name: "Persistence",
      techniques: [
        { id: "T1547",   name: "Boot or Logon Autostart Execution", count: 13 },
        { id: "T1053",   name: "Scheduled Task/Job",                count: 9 },
        { id: "T1078",   name: "Valid Accounts",                    count: 8 },
        { id: "T1112",   name: "Modify Registry",                   count: 3 },
        { id: "T1543",   name: "Create or Modify System Process",   count: 3 },
        { id: "T1133",   name: "External Remote Services",          count: 2 },
        { id: "T1505",   name: "Server Software Component",         count: 2 },
        { id: "T1574",   name: "Hijack Execution Flow",             count: 2 },
        { id: "T1197",   name: "BITS Jobs",                         count: 1 },
        { id: "T1136",   name: "Create Account",                    count: 1 },
        { id: "T1036",   name: "DLL Search Order Hijacking",        count: 1 },
        { id: "T1546",   name: "Event Triggered Execution",         count: 1 },
        { id: "T1215",   name: "Kernel Modules and Extensions",     count: 1 },
      ],
    },
    {
      id: "TA0004", name: "Privilege Escalation",
      techniques: [
        { id: "T1055",   name: "Process Injection",                 count: 16 },
        { id: "T1547",   name: "Boot or Logon Autostart",           count: 13 },
        { id: "T1547.001",name: "Registry Run Keys",                count: 9 },
        { id: "T1053",   name: "Scheduled Task/Job",                count: 9 },
        { id: "T1078",   name: "Valid Accounts",                    count: 8 },
        { id: "T1068",   name: "Exploitation for Privilege Esc",    count: 4 },
        { id: "T1134",   name: "Access Token Manipulation",         count: 4 },
        { id: "T1543",   name: "Create or Modify System Process",   count: 3 },
        { id: "T1548",   name: "Abuse Elevation Control Mechanism", count: 2 },
        { id: "T1574",   name: "Hijack Execution Flow",             count: 2 },
        { id: "T1038",   name: "DLL Search Order Hijacking",        count: 1 },
      ],
    },
    {
      id: "TA0006", name: "Credential Access",
      techniques: [
        { id: "T1056",   name: "Input Capture",                     count: 146 },
        { id: "T1555",   name: "Credentials from Password Stores",  count: 12 },
        { id: "T1552",   name: "Unsecured Credentials",             count: 2 },
        { id: "T1110",   name: "Brute Force",                       count: 1 },
        { id: "T1503",   name: "Credentials from Web Browsers",     count: 1 },
        { id: "T1081",   name: "Credentials in Files",              count: 1 },
        { id: "T1556",   name: "Modify Authentication Process",     count: 1 },
        { id: "T1003",   name: "OS Credential Dumping",             count: 1 },
        { id: "T1145",   name: "Private Keys",                      count: 1 },
        { id: "T1539",   name: "Steal Web Session Cookie",          count: 1 },
      ],
    },
    {
      id: "TA0007", name: "Discovery",
      techniques: [
        { id: "T1082",   name: "System Information Discovery",      count: 22 },
        { id: "T1057",   name: "Process Discovery",                 count: 16 },
        { id: "T1497",   name: "Virtualization/Sandbox Evasion",    count: 16 },
        { id: "T1083",   name: "File and Directory Discovery",      count: 15 },
        { id: "T1012",   name: "Query Registry",                    count: 13 },
        { id: "T1087",   name: "Account Discovery",                 count: 12 },
        { id: "T1033",   name: "System Owner/User Discovery",       count: 8 },
        { id: "T1518",   name: "Software Discovery",                count: 8 },
        { id: "T1016",   name: "System Network Configuration",      count: 7 },
        { id: "T1614",   name: "System Location Discovery",         count: 5 },
        { id: "T1010",   name: "Application Window Discovery",      count: 4 },
        { id: "T1063",   name: "Security Software Discovery",       count: 3 },
        { id: "T1007",   name: "System Service Discovery",          count: 3 },
      ],
    },
    {
      id: "TA0008", name: "Lateral Movement",
      techniques: [
        { id: "T1021",   name: "Remote Services",                   count: 9 },
        { id: "T1210",   name: "Exploitation of Remote Services",   count: 5 },
        { id: "T1570",   name: "Lateral Tool Transfer",             count: 4 },
        { id: "T1550",   name: "Use Alternate Authentication",      count: 2 },
      ],
    },
  ],
};

export async function getTechniqueDetections(techniqueId: string): Promise<Array<{ id: string; name: string; severity: string; time: string }>> {
  await sleep(300);
  void techniqueId;
  return [
    { id: "DET-2026-8841", name: "BEC Wire Transfer Pattern", severity: "critical", time: "2026-06-15T19:22:48Z" },
    { id: "DET-2026-8839", name: "Credential Harvest Login Clone", severity: "high", time: "2026-06-15T19:05:11Z" },
    { id: "DET-2026-8835", name: "NLP Intent Classifier Alert", severity: "high", time: "2026-06-15T16:41:05Z" },
  ];
}
