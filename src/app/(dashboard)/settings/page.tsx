"use client";

import { useState } from "react";
import { Settings, Bell, Key, Shield, Users, Palette } from "lucide-react";
import { TemplateAppearanceTab } from "@/components/settings/template-appearance-tab";

type SettingsTab = "general" | "appearance" | "notifications" | "api" | "security" | "team";

const TABS: { key: SettingsTab; label: string; icon: typeof Settings }[] = [
  { key: "general",      label: "General",      icon: Settings },
  { key: "appearance",   label: "Appearance",   icon: Palette },
  { key: "notifications",label: "Notifications",icon: Bell },
  { key: "api",          label: "API Keys",     icon: Key },
  { key: "security",     label: "Security",     icon: Shield },
  { key: "team",         label: "Team",         icon: Users },
];

const API_KEYS = [
  { name: "Production Scanner", key: "dm_live_a8f3...4f6a", created: "2026-03-15", lastUsed: "2 min ago", status: "active" },
  { name: "Staging Environment", key: "dm_test_b7c4...3d4e", created: "2026-04-20", lastUsed: "3h ago", status: "active" },
  { name: "CI/CD Pipeline", key: "dm_live_c9d2...5e7f", created: "2026-01-10", lastUsed: "1 day ago", status: "active" },
];

const TEAM_MEMBERS = [
  { name: "Admin User", email: "admin@deepmail.io", role: "Owner", lastActive: "Now" },
  { name: "Alice Kim", email: "alice@deepmail.io", role: "Analyst", lastActive: "5m ago" },
  { name: "James Rodriguez", email: "james@deepmail.io", role: "Analyst", lastActive: "2h ago" },
  { name: "Tara Singh", email: "tara@deepmail.io", role: "Viewer", lastActive: "1d ago" },
];

function ToggleRow({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-3">
      <div>
        <div className="text-sm text-fg">{label}</div>
        <div className="text-[11px] text-muted">{description}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-accent" : "bg-border"}`}
      >
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-fg transition-transform ${on ? "left-4.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  return (
    <div className="mx-auto w-full max-w-250 p-8">
      <h1 className="mb-6 font-display text-lg font-medium text-fg">Settings</h1>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                activeTab === tab.key
                  ? "bg-fg/8 text-fg"
                  : "text-muted hover:bg-fg/3 hover:text-fg"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === "general" && (
            <>
              <h2 className="text-sm font-medium text-fg">General Settings</h2>
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-surface/50 px-4 py-3">
                  <label className="text-[11px] text-muted">Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Acme Corporation"
                    className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
                  />
                </div>
                <div className="rounded-lg border border-border bg-surface/50 px-4 py-3">
                  <label className="text-[11px] text-muted">Default Timezone</label>
                  <input
                    type="text"
                    defaultValue="UTC"
                    className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
                  />
                </div>
                <ToggleRow label="Dark Mode" description="Use dark theme across the application" defaultOn />
                <ToggleRow label="Compact View" description="Reduce spacing in tables and lists" />
              </div>
            </>
          )}

          {activeTab === "appearance" && <TemplateAppearanceTab />}

          {activeTab === "notifications" && (
            <>
              <h2 className="text-sm font-medium text-fg">Notification Preferences</h2>
              <div className="space-y-3">
                <ToggleRow label="Critical Threats" description="Immediate alerts for critical severity detections" defaultOn />
                <ToggleRow label="High Threats" description="Alerts for high severity detections" defaultOn />
                <ToggleRow label="New Cases" description="Notify when new cases are created" defaultOn />
                <ToggleRow label="Sandbox Results" description="Notify when sandbox analysis completes" />
                <ToggleRow label="Weekly Digest" description="Weekly summary report via email" defaultOn />
              </div>
            </>
          )}

          {activeTab === "api" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-fg">API Keys</h2>
                <button className="rounded-md bg-fg px-3 py-1.5 text-xs font-medium text-bg">Generate Key</button>
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      {["Name", "Key", "Created", "Last Used", ""].map((col) => (
                        <th key={col} className="border-b border-border bg-fg/2 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {API_KEYS.map((k) => (
                      <tr key={k.key} className="hover:bg-fg/3">
                        <td className="border-b border-fg/3 px-4 py-3 text-xs text-fg">{k.name}</td>
                        <td className="border-b border-fg/3 px-4 py-3 font-mono text-[11px] text-muted">{k.key}</td>
                        <td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">{k.created}</td>
                        <td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">{k.lastUsed}</td>
                        <td className="border-b border-fg/3 px-4 py-3 text-right">
                          <button className="text-[11px] text-danger hover:underline">Revoke</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <h2 className="text-sm font-medium text-fg">Security Settings</h2>
              <div className="space-y-3">
                <ToggleRow label="Two-Factor Authentication" description="Require 2FA for all team members" defaultOn />
                <ToggleRow label="IP Allowlist" description="Restrict API access to specific IP ranges" />
                <ToggleRow label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultOn />
                <ToggleRow label="Audit Logging" description="Log all administrative actions" defaultOn />
              </div>
            </>
          )}

          {activeTab === "team" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-fg">Team Members</h2>
                <button className="rounded-md bg-fg px-3 py-1.5 text-xs font-medium text-bg">Invite Member</button>
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      {["Name", "Email", "Role", "Last Active"].map((col) => (
                        <th key={col} className="border-b border-border bg-fg/2 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TEAM_MEMBERS.map((m) => (
                      <tr key={m.email} className="hover:bg-fg/3">
                        <td className="border-b border-fg/3 px-4 py-3 text-xs text-fg">{m.name}</td>
                        <td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">{m.email}</td>
                        <td className="border-b border-fg/3 px-4 py-3">
                          <span className="rounded bg-fg/5 px-2 py-0.5 text-[10px] text-muted">{m.role}</span>
                        </td>
                        <td className="border-b border-fg/3 px-4 py-3 font-mono text-[11px] text-muted">{m.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
