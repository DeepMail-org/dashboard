const fs = require('fs');

const statuses = ["pending", "running", "completed", "failed"];
const osOpts = ["windows10", "windows11", "ubuntu22"];
const networks = ["isolated", "internet", "proxy"];
const tenants = ["ACME Corp", "Stark Ind", "Wayne Ent", "Globex", "Initech"];
const owners = ["j.doe", "a.smith", "m.scott", "b.wayne", "t.stark"];
const verdicts = ["clean", "suspicious", "malicious"];
const families = ["Emotet", "AgentTesla", "Qakbot", "CobaltStrike", "TrickBot", "None"];

const tasks = [];
for (let i = 0; i < 150; i++) {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const isMalicious = Math.random() > 0.5 && status === "completed";
  const verdict = status === "completed" ? (isMalicious ? "malicious" : (Math.random() > 0.5 ? "suspicious" : "clean")) : "unknown";
  
  tasks.push({
    id: `sbx-${1000 + i}`,
    name: `sample_${i}_${Math.random().toString(36).substring(7)}.exe`,
    type: Math.random() > 0.8 ? "email" : "attachment",
    targetId: `att-${i}`,
    size: Math.floor(Math.random() * 5000000) + 10000,
    status: status,
    config: {
      os: osOpts[Math.floor(Math.random() * osOpts.length)],
      network: networks[Math.floor(Math.random() * networks.length)],
      timeout: [30, 60, 120, 300][Math.floor(Math.random() * 4)],
    },
    createdAt: Date.now() - Math.floor(Math.random() * 100000000),
    completedAt: status === "completed" || status === "failed" ? Date.now() - Math.floor(Math.random() * 10000000) : undefined,
    tenant: tenants[Math.floor(Math.random() * tenants.length)],
    owner: owners[Math.floor(Math.random() * owners.length)],
    worker: status === "running" ? `sandbox-0${Math.floor(Math.random() * 5) + 1}` : undefined,
    risk: isMalicious ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40),
    verdict: verdict,
    campaign: isMalicious && Math.random() > 0.5 ? families[Math.floor(Math.random() * (families.length - 1))] : undefined,
    iocCount: status === "completed" ? Math.floor(Math.random() * 50) : 0,
    confidence: status === "completed" ? Math.floor(Math.random() * 20) + 80 : 0
  });
}

console.log(JSON.stringify(tasks, null, 2));
