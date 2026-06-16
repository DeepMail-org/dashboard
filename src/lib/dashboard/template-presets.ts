import type { BreakpointLayouts } from "./types";

// ── ADMINISTRATOR PRESET ───────────────────────────────────────────────────────
// Optimised for security operations center administrators:
// High-level threat visibility, infrastructure health, pipeline status.

export const ADMIN_WIDGETS = [
  "threat-score",
  "severity-breakdown",
  "email-volume",
  "mitre-heatmap",
  "recent-threats",
  "geo-threat-map",
  "api-usage",
  "infra-health",
  "pipeline-status",
  "incident-report",
];

export const ADMIN_LAYOUTS: BreakpointLayouts = {
  lg: [
    { i: "threat-score",       x: 0,  y: 0,  w: 3,  h: 2, minW: 2, minH: 2 },
    { i: "severity-breakdown", x: 3,  y: 0,  w: 4,  h: 2, minW: 2, minH: 2 },
    { i: "email-volume",       x: 7,  y: 0,  w: 5,  h: 2, minW: 3, minH: 2 },
    { i: "recent-threats",     x: 0,  y: 2,  w: 7,  h: 3, minW: 3, minH: 2 },
    { i: "mitre-heatmap",      x: 7,  y: 2,  w: 5,  h: 3, minW: 3, minH: 2 },
    { i: "geo-threat-map",     x: 0,  y: 5,  w: 5,  h: 3, minW: 3, minH: 2 },
    { i: "api-usage",          x: 5,  y: 5,  w: 4,  h: 3, minW: 3, minH: 3 },
    { i: "pipeline-status",    x: 9,  y: 5,  w: 3,  h: 3, minW: 2, minH: 2 },
    { i: "infra-health",       x: 0,  y: 8,  w: 6,  h: 3, minW: 3, minH: 2 },
    { i: "incident-report",    x: 6,  y: 8,  w: 6,  h: 3, minW: 4, minH: 3 },
  ],
  md: [
    { i: "threat-score",       x: 0, y: 0,  w: 4,  h: 2, minW: 2, minH: 2 },
    { i: "severity-breakdown", x: 4, y: 0,  w: 4,  h: 2, minW: 2, minH: 2 },
    { i: "email-volume",       x: 0, y: 2,  w: 8,  h: 2, minW: 3, minH: 2 },
    { i: "recent-threats",     x: 0, y: 4,  w: 8,  h: 3, minW: 3, minH: 2 },
    { i: "mitre-heatmap",      x: 0, y: 7,  w: 8,  h: 3, minW: 3, minH: 2 },
    { i: "geo-threat-map",     x: 0, y: 10, w: 4,  h: 3, minW: 3, minH: 2 },
    { i: "api-usage",          x: 4, y: 10, w: 4,  h: 3, minW: 3, minH: 3 },
    { i: "pipeline-status",    x: 0, y: 13, w: 4,  h: 3, minW: 2, minH: 2 },
    { i: "infra-health",       x: 4, y: 13, w: 4,  h: 3, minW: 3, minH: 2 },
    { i: "incident-report",    x: 0, y: 16, w: 8,  h: 3, minW: 4, minH: 3 },
  ],
  sm: [
    { i: "threat-score",       x: 0, y: 0,  w: 2, h: 2, minW: 2, minH: 2 },
    { i: "severity-breakdown", x: 2, y: 0,  w: 2, h: 2, minW: 2, minH: 2 },
    { i: "email-volume",       x: 0, y: 2,  w: 4, h: 2, minW: 2, minH: 2 },
    { i: "recent-threats",     x: 0, y: 4,  w: 4, h: 3, minW: 3, minH: 2 },
    { i: "mitre-heatmap",      x: 0, y: 7,  w: 4, h: 3, minW: 3, minH: 2 },
    { i: "geo-threat-map",     x: 0, y: 10, w: 4, h: 3, minW: 2, minH: 2 },
    { i: "api-usage",          x: 0, y: 13, w: 4, h: 3, minW: 3, minH: 3 },
    { i: "pipeline-status",    x: 0, y: 16, w: 4, h: 3, minW: 2, minH: 2 },
    { i: "infra-health",       x: 0, y: 19, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "incident-report",    x: 0, y: 22, w: 4, h: 3, minW: 4, minH: 3 },
  ],
  xs: [
    { i: "threat-score",       x: 0, y: 0,  w: 2, h: 2, minW: 2, minH: 2 },
    { i: "severity-breakdown", x: 0, y: 2,  w: 2, h: 2, minW: 2, minH: 2 },
    { i: "email-volume",       x: 0, y: 4,  w: 2, h: 2, minW: 2, minH: 2 },
    { i: "recent-threats",     x: 0, y: 6,  w: 2, h: 3, minW: 2, minH: 2 },
    { i: "mitre-heatmap",      x: 0, y: 9,  w: 2, h: 3, minW: 2, minH: 2 },
    { i: "geo-threat-map",     x: 0, y: 12, w: 2, h: 3, minW: 2, minH: 2 },
    { i: "api-usage",          x: 0, y: 15, w: 2, h: 3, minW: 2, minH: 3 },
    { i: "pipeline-status",    x: 0, y: 18, w: 2, h: 3, minW: 2, minH: 2 },
    { i: "infra-health",       x: 0, y: 21, w: 2, h: 3, minW: 2, minH: 2 },
    { i: "incident-report",    x: 0, y: 24, w: 2, h: 3, minW: 2, minH: 3 },
  ],
};

// ── ANALYST PRESET ─────────────────────────────────────────────────────────────
// Optimised for threat analysts and researchers:
// IOC visibility, email patterns, sandbox activity, threat intel feeds.

export const ANALYST_WIDGETS = [
  "threat-intel-feed",
  "email-volume",
  "attack-vector",
  "sandbox-queue",
  "active-iocs",
  "top-senders",
  "threat-origins",
  "incident-report",
  "top-alert-categories",
  "threat-radar",
];

export const ANALYST_LAYOUTS: BreakpointLayouts = {
  lg: [
    { i: "threat-intel-feed",    x: 0,  y: 0,  w: 4,  h: 3, minW: 3, minH: 2 },
    { i: "email-volume",         x: 4,  y: 0,  w: 5,  h: 3, minW: 3, minH: 2 },
    { i: "attack-vector",        x: 9,  y: 0,  w: 3,  h: 3, minW: 2, minH: 2 },
    { i: "sandbox-queue",        x: 0,  y: 3,  w: 4,  h: 3, minW: 3, minH: 2 },
    { i: "active-iocs",          x: 4,  y: 3,  w: 4,  h: 3, minW: 2, minH: 2 },
    { i: "top-senders",          x: 8,  y: 3,  w: 4,  h: 3, minW: 2, minH: 2 },
    { i: "threat-origins",       x: 0,  y: 6,  w: 4,  h: 3, minW: 2, minH: 2 },
    { i: "incident-report",      x: 4,  y: 6,  w: 5,  h: 4, minW: 4, minH: 3 },
    { i: "top-alert-categories", x: 9,  y: 6,  w: 3,  h: 3, minW: 3, minH: 2 },
    { i: "threat-radar",         x: 0,  y: 9,  w: 4,  h: 3, minW: 3, minH: 3 },
  ],
  md: [
    { i: "threat-intel-feed",    x: 0, y: 0,  w: 4, h: 3, minW: 3, minH: 2 },
    { i: "email-volume",         x: 4, y: 0,  w: 4, h: 3, minW: 3, minH: 2 },
    { i: "attack-vector",        x: 0, y: 3,  w: 4, h: 3, minW: 2, minH: 2 },
    { i: "sandbox-queue",        x: 4, y: 3,  w: 4, h: 3, minW: 3, minH: 2 },
    { i: "active-iocs",          x: 0, y: 6,  w: 4, h: 3, minW: 2, minH: 2 },
    { i: "top-senders",          x: 4, y: 6,  w: 4, h: 3, minW: 2, minH: 2 },
    { i: "threat-origins",       x: 0, y: 9,  w: 4, h: 3, minW: 2, minH: 2 },
    { i: "incident-report",      x: 4, y: 9,  w: 4, h: 4, minW: 4, minH: 3 },
    { i: "top-alert-categories", x: 0, y: 12, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "threat-radar",         x: 4, y: 13, w: 4, h: 3, minW: 3, minH: 3 },
  ],
  sm: [
    { i: "threat-intel-feed",    x: 0, y: 0,  w: 4, h: 3, minW: 3, minH: 2 },
    { i: "email-volume",         x: 0, y: 3,  w: 4, h: 3, minW: 2, minH: 2 },
    { i: "attack-vector",        x: 0, y: 6,  w: 4, h: 3, minW: 2, minH: 2 },
    { i: "sandbox-queue",        x: 0, y: 9,  w: 4, h: 3, minW: 3, minH: 2 },
    { i: "active-iocs",          x: 0, y: 12, w: 4, h: 3, minW: 2, minH: 2 },
    { i: "top-senders",          x: 0, y: 15, w: 4, h: 3, minW: 2, minH: 2 },
    { i: "threat-origins",       x: 0, y: 18, w: 4, h: 3, minW: 2, minH: 2 },
    { i: "incident-report",      x: 0, y: 21, w: 4, h: 4, minW: 4, minH: 3 },
    { i: "top-alert-categories", x: 0, y: 25, w: 4, h: 3, minW: 3, minH: 2 },
    { i: "threat-radar",         x: 0, y: 28, w: 4, h: 3, minW: 3, minH: 3 },
  ],
  xs: [
    { i: "threat-intel-feed",    x: 0, y: 0,  w: 2, h: 3, minW: 2, minH: 2 },
    { i: "email-volume",         x: 0, y: 3,  w: 2, h: 3, minW: 2, minH: 2 },
    { i: "attack-vector",        x: 0, y: 6,  w: 2, h: 3, minW: 2, minH: 2 },
    { i: "sandbox-queue",        x: 0, y: 9,  w: 2, h: 3, minW: 2, minH: 2 },
    { i: "active-iocs",          x: 0, y: 12, w: 2, h: 3, minW: 2, minH: 2 },
    { i: "top-senders",          x: 0, y: 15, w: 2, h: 3, minW: 2, minH: 2 },
    { i: "threat-origins",       x: 0, y: 18, w: 2, h: 3, minW: 2, minH: 2 },
    { i: "incident-report",      x: 0, y: 21, w: 2, h: 4, minW: 2, minH: 3 },
    { i: "top-alert-categories", x: 0, y: 25, w: 2, h: 3, minW: 2, minH: 2 },
    { i: "threat-radar",         x: 0, y: 28, w: 2, h: 3, minW: 2, minH: 3 },
  ],
};
