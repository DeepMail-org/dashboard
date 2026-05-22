"use client";

import { useState } from "react";
import { Search, Download, Star, Check } from "lucide-react";

type Category = "all" | "security" | "analytics" | "integration" | "compliance";

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  author: string;
  rating: number;
  installs: string;
  installed: boolean;
}

const ITEMS: MarketplaceItem[] = [
  { id: "mi-1", name: "Advanced Threat Heatmap", description: "MITRE ATT&CK technique heatmap with drill-down analysis and weekly trend comparisons", category: "security", author: "DeepMail", rating: 4.8, installs: "12.3k", installed: true },
  { id: "mi-2", name: "Geo Threat Map", description: "Interactive geographic visualization of threat origins with MapLibre GL and real-time updates", category: "analytics", author: "DeepMail", rating: 4.7, installs: "10.1k", installed: true },
  { id: "mi-3", name: "Slack Integration", description: "Push critical alerts and case updates directly to Slack channels with rich formatting", category: "integration", author: "DeepMail", rating: 4.6, installs: "8.9k", installed: false },
  { id: "mi-4", name: "PagerDuty Bridge", description: "Trigger PagerDuty incidents for critical detections with automatic severity mapping", category: "integration", author: "Community", rating: 4.4, installs: "5.2k", installed: false },
  { id: "mi-5", name: "SOC 2 Compliance Pack", description: "Pre-built detection rules and reports for SOC 2 Type II audit requirements", category: "compliance", author: "DeepMail", rating: 4.9, installs: "7.8k", installed: false },
  { id: "mi-6", name: "Executive Dashboard", description: "High-level KPI widgets designed for C-suite reporting with export-ready charts", category: "analytics", author: "DeepMail", rating: 4.5, installs: "6.4k", installed: true },
  { id: "mi-7", name: "GDPR Data Scanner", description: "Scan email attachments for PII and flag potential GDPR compliance violations", category: "compliance", author: "Community", rating: 4.3, installs: "3.1k", installed: false },
  { id: "mi-8", name: "Jira Ticket Sync", description: "Bi-directional sync between DeepMail cases and Jira tickets with status mapping", category: "integration", author: "Community", rating: 4.2, installs: "4.6k", installed: false },
  { id: "mi-9", name: "Sandbox Deep Analyzer", description: "Extended sandbox analysis with behavioral trees, memory forensics, and network capture", category: "security", author: "DeepMail", rating: 4.8, installs: "9.3k", installed: true },
  { id: "mi-10", name: "Custom YARA Editor", description: "In-browser YARA rule editor with syntax highlighting, testing, and auto-deploy", category: "security", author: "DeepMail", rating: 4.7, installs: "7.1k", installed: false },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");

  const filtered = ITEMS.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All" },
    { key: "security", label: "Security" },
    { key: "analytics", label: "Analytics" },
    { key: "integration", label: "Integrations" },
    { key: "compliance", label: "Compliance" },
  ];

  return (
    <div className="mx-auto w-full max-w-350 p-8">
      <div className="mb-6">
        <h1 className="font-display text-lg font-medium text-fg">Marketplace</h1>
        <p className="mt-1 text-sm text-muted">Extend DeepMail with widgets, integrations, and compliance packs</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 bg-transparent text-xs text-fg placeholder:text-muted outline-none"
          />
        </div>
        <div className="flex gap-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                category === c.key ? "bg-fg/8 text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-hover"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-fg">{item.name}</h3>
                <span className="text-[10px] text-muted">by {item.author}</span>
              </div>
              {item.installed ? (
                <span className="flex items-center gap-1 rounded bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                  <Check className="h-3 w-3" />
                  Installed
                </span>
              ) : (
                <button className="flex items-center gap-1 rounded-md border border-accent/30 px-2.5 py-1 text-[11px] font-medium text-accent transition-colors hover:bg-accent/10">
                  <Download className="h-3 w-3" />
                  Install
                </button>
              )}
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted">{item.description}</p>
            <div className="flex items-center gap-4 text-[10px] text-dimmed">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                {item.rating}
              </span>
              <span>{item.installs} installs</span>
              <span className="rounded bg-fg/5 px-1.5 py-px capitalize">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
