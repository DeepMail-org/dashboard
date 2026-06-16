"use client";

import { useState } from "react";
import { Bell, X, AlertTriangle, Info, CheckCircle, Settings } from "lucide-react";
import { DrawerPanel } from "@/components/ui/drawer-panel";
import { cn } from "@/lib/utils";

type NotifType = "critical" | "high" | "medium" | "info" | "success";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tab: "alerts" | "system" | "integrations";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "critical", title: "Critical Detection Fired", body: "BEC Wire Transfer Pattern matched on inbound email to finance@acme.com", time: "2m ago", read: false, tab: "alerts" },
  { id: "n2", type: "high",     title: "New Emotet Campaign Detected", body: "Emotet dropper signature triggered on 3 separate emails", time: "8m ago", read: false, tab: "alerts" },
  { id: "n3", type: "high",     title: "Sandbox Analysis Complete", body: "File analysis for attachment.doc returned MALICIOUS verdict", time: "15m ago", read: false, tab: "alerts" },
  { id: "n4", type: "medium",   title: "Threat Intel Feed Updated", body: "AlienVault OTX added 847 new malicious IPs", time: "32m ago", read: true, tab: "alerts" },
  { id: "n5", type: "info",     title: "Pipeline Health Warning", body: "ML classification service latency > 500ms for last 5 minutes", time: "1h ago", read: true, tab: "system" },
  { id: "n6", type: "success",  title: "Weekly Report Generated", body: "Your weekly threat summary report is ready to download", time: "3h ago", read: true, tab: "system" },
  { id: "n7", type: "info",     title: "VirusTotal Integration Active", body: "API connection established successfully", time: "2d ago", read: true, tab: "integrations" },
  { id: "n8", type: "info",     title: "MISP Feed Synced", body: "2,341 new IOCs ingested from MISP threat sharing platform", time: "4h ago", read: true, tab: "integrations" },
];

const TYPE_ICON: Record<NotifType, React.ElementType> = {
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const TYPE_COLOR: Record<NotifType, string> = {
  critical: "text-danger",
  high: "text-orange",
  medium: "text-warning",
  info: "text-info",
  success: "text-success",
};

type NotifTab = "alerts" | "system" | "integrations";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<NotifTab>("alerts");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filtered = notifications.filter((n) => n.tab === activeTab);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const tabs: Array<{ key: NotifTab; label: string }> = [
    { key: "alerts", label: "Alerts" },
    { key: "system", label: "System" },
    { key: "integrations", label: "Integrations" },
  ];

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      width={380}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted" />
            <h2 className="text-[14px] font-semibold text-fg">Notifications</h2>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger/15 px-1.5 text-[10px] font-semibold text-danger">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-accent hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const tabUnread = notifications.filter(
              (n) => n.tab === tab.key && !n.read,
            ).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative flex-1 py-2.5 text-[12px] transition-colors",
                  activeTab === tab.key
                    ? "text-fg border-b-2 border-accent"
                    : "text-muted hover:text-fg",
                )}
              >
                {tab.label}
                {tabUnread > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger/20 px-1 text-[9px] font-bold text-danger">
                    {tabUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle className="h-8 w-8 text-muted mb-3" />
              <p className="text-sm text-secondary">All caught up!</p>
              <p className="text-xs text-muted mt-1">No {activeTab} notifications</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const Icon = TYPE_ICON[notif.type];
              return (
                <div
                  key={notif.id}
                  className={cn(
                    "group relative flex gap-3 border-b border-fg/5 px-5 py-4 transition-colors hover:bg-fg/3",
                    !notif.read && "bg-accent/3",
                  )}
                >
                  {!notif.read && (
                    <div className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent" />
                  )}
                  <div className={cn("mt-0.5 shrink-0", TYPE_COLOR[notif.type])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] font-medium text-fg leading-snug">
                        {notif.title}
                      </p>
                      <button
                        onClick={() => dismiss(notif.id)}
                        className="shrink-0 text-dimmed opacity-0 transition-opacity hover:text-fg group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-muted leading-relaxed">
                      {notif.body}
                    </p>
                    <p className="mt-1.5 font-mono text-[10px] text-dimmed">{notif.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3">
          <button className="flex items-center gap-1.5 text-[11px] text-muted hover:text-fg transition-colors">
            <Settings className="h-3.5 w-3.5" />
            Notification Settings
          </button>
        </div>
      </div>
    </DrawerPanel>
  );
}
