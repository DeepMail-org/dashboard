# DeepMail — Enterprise Email Threat Intelligence Platform

---

## The Problem

Email remains the **#1 attack vector** for cyberattacks. **91% of cyberattacks start with a phishing email**. Yet current email security tools are fragmented — you need one tool for threat detection, another for sandboxing, another for MITRE mapping, another for incident response. Security analysts waste hours context-switching between disconnected dashboards, and threats slip through the cracks.

> **DeepMail consolidates the entire email security operations center into a single, real-time dashboard.**

---

## What DeepMail Is

DeepMail is a **full-stack email threat intelligence platform** that ingests, analyzes, and visualizes email-based threats in real-time. Think of it as a **SOC (Security Operations Center) in your browser** — purpose-built for email security.

---

## The Tech Stack (and Why)

| Layer | Technology | Why This Choice |
|-------|-----------|-----------------|
| **Framework** | Next.js 16 (App Router, React 19) | Server-side rendering for marketing pages, client-side SPA for dashboard. React 19 concurrent features for smooth UI. |
| **Language** | TypeScript 5.9 (strict mode) | Type safety across 100+ components — prevents runtime errors in security-critical UI. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS for rapid UI development. Dark theme across the entire app. |
| **State** | Zustand 5 (persisted) | 7 Zustand stores for auth, dashboard, mail, sandbox, templates, layout — all persisted to localStorage. |
| **Server State** | TanStack React Query 5 | Polling + cache management for REST APIs. Automatic refetching for live threat data. |
| **Charts** | ECharts 6, Recharts 3, custom visx wrappers | ECharts for rich interactive charts (gauges, heatmaps). Recharts for simple charts. visx for custom animated visualizations. |
| **Grid Layout** | react-grid-layout | Drag-and-drop widget dashboard — users customize their own SOC view. |
| **Real-Time** | WebSocket manager (custom) | Singleton WebSocket with auto-reconnect, heartbeat, channel subscriptions — live threat feeds without page refresh. |
| **Maps** | MapLibre GL | Open-source vector maps for geo threat visualization. No vendor lock-in. |
| **3D** | Three.js, cobe | 3D globe visualization on the landing page — shows global threat distribution. |
| **Animation** | Framer Motion / GSAP | Scroll-driven reveals on marketing page, micro-interactions in dashboard. |
| **State Machines** | XState 5 | Sandbox task lifecycle: PENDING → RUNNING → COMPLETED/FAILED/CANCELLED. Formal state transitions prevent invalid states. |
| **Package Manager** | Bun | 10x faster installs than npm. Faster dev server startup. |

---

## The Pages — A Walkthrough

### Public Pages (Marketing)

#### `/` — Landing Page

- Cinematic dark-theme landing with **mouse-following spotlight effect**
- **Scroll-driven lazy loading** — each section loads as you scroll (IntersectionObserver)
- Sections: Hero, Stats, Perspective Marquee (3D rotating text), Features, How It Works, Bento Grid, FAQ with spiral animation, Cinematic Footer
- **Upload modal** — users can submit email samples directly from the landing page
- All heavy components are `next/dynamic` with `ssr: false` — zero JavaScript shipped for below-the-fold content until needed

#### `/login` — Login

- Email + password form with animated card and spotlight cursor effect
- Calls `/api/auth/login` — backend-first with 3s timeout, falls back to dev mock
- JWT token stored in httpOnly cookie + Zustand store

#### `/signup` — Registration

- Name, email, password form with validation
- Auto-redirects to `/verify` after signup

#### `/verify` — OTP Verification

- 6-digit OTP input (using `input-otp` component)
- Accepts any 6-digit code in dev mode

#### `/payments` — Subscription Plans

- Three tiers: **Starter ($0)**, **Pro ($79)**, **Enterprise ($499)**
- Monthly/yearly toggle with animated pricing
- Credit card form component
- Plan comparison table

#### `/contact` — Contact

- Contact form with company info, phone, email
- "Book a Call" CTA

---

### Dashboard Pages (Authenticated)

#### `/dashboard` — Widget Dashboard ⭐ Core Feature

- **20 widgets** across 5 categories: Core (7), Intelligence (7), Operational (2), Sandbox (1), Platform (4)
- **Drag-and-drop grid** — users resize and rearrange widgets
- **Widget Marketplace** — browse and add new widgets
- **Role-based templates**: Administrator template (all widgets), Analyst template (security-focused)
- **2 custom template slots** — users save their own layouts
- **Lock mode** — freeze layout to prevent accidental drags
- Each widget has its own **error boundary** — one crashing widget doesn't take down the whole dashboard

**Widgets include:**

| Widget | Category | Data Source |
|--------|----------|-------------|
| Threat Score Gauge | Core | REST (30s polling) |
| Email Volume Timeline | Core | REST (1min polling) |
| Severity Breakdown | Core | REST (1min polling) |
| Recent Threats Table | Core | **WebSocket (live)** |
| Pipeline Status | Core | **WebSocket (live)** |
| Threat Volume Timeline | Core | REST (5min polling) |
| Top Alert Categories | Core | REST (1min polling) |
| Geo Threat Map | Intelligence | REST (5min polling) |
| Threat Origins | Intelligence | REST (1min polling) |
| Attack Vector Radar | Intelligence | REST (5min polling) |
| Top Malicious Senders | Intelligence | REST (1min polling) |
| Active IOCs | Intelligence | REST (1min polling) |
| Threat Intel Feed | Intelligence | **WebSocket (live)** |
| MITRE ATT&CK Heatmap | Intelligence | REST (5min polling) |
| Threat Radar | Intelligence | **WebSocket (live)** |
| DKIM/SPF/DMARC Health | Operational | REST (5min polling) |
| Incident Report | Operational | REST (5min polling) |
| Sandbox Queue | Sandbox | **WebSocket (live)** |
| Infra Health | Platform | REST (1min polling) |
| Billing Usage | Platform | REST (5min polling) |

**Data Flow:**

```
Widget → useWidgetQuery(widgetId)
  → REST: TanStack Query (polling at configured interval)
  → WebSocket: WsManager → QueryClient cache update
```

---

#### `/mail-inbox` — Email Client ⭐ Core Feature

- **3-panel resizable layout** (sidebar, mail list, mail detail)
- Resizable panels with **persisted sizes** across sessions
- **Compose modal** — Gmail-style floating compose (bottom-right), minimizes on click-outside
- **Keyboard shortcuts** — navigate emails without mouse
- **Real-time updates** via WebSocket — new emails appear instantly
- Folders: Inbox, Sent, Drafts, Spam, Trash, Archive
- Severity badges on each email
- Threat details panel with MITRE mapping, ML explainability, origin IP

---

#### `/cases` — Security Case Management

- Table view with status filter tabs (All, New, In Progress, Pending, Resolved, Closed)
- **SLA countdown timers**
- Severity pills (critical/high/medium/low)
- Search and filter

#### `/cases/board` — Kanban Board

- **Drag-and-drop** between columns: New → In Progress → Pending → Resolved → Closed
- Case cards with severity, assignee, SLA status

---

#### `/detections` — Threat Detection Alerts

- **Expandable rows** with full detection details
- Filters: severity, status, category, adversary
- Date grouping (Today, Yesterday, Last 7 Days)
- **"Create Case"** action from any detection
- MITRE ATT&CK technique references

---

#### `/vulnerabilities` — CVE Management

- Vulnerability table with CVSS scores, exploit status badges
- Search by CVE ID, title, affected hosts

**CVE Detail Page** (`/vulnerabilities/[cveId]`):

- CVSS gauge visualization
- Tabs: Details, Remediations, ExPRT Rating, CVSS Attributes, Known Exploits
- Affected hosts table with patch status and days-open tracking

---

#### `/tasks` — Background Jobs

- Task queue with progress bars
- Status filters (Pending, Running, Completed, Failed)
- Cancel and retry actions
- Task type icons (sandbox, enrichment, notification)

---

### Sandbox System

#### `/sandbox/overview` — Sandbox Analytics

- 4 stat cards with charts (area, donut, bar)
- Recent high-risk submissions table
- Top target tenants (Wayne Ent, ACME Corp, Stark Ind...)
- **Glowing/neon chart aesthetic** — cyberpunk visual style

#### `/sandbox/queue` — Task Queue

- Full sandbox task table with **XState-driven lifecycle**
- Status transitions: `PENDING → RUNNING → COMPLETED/FAILED/CANCELLED`
- Task detail modal with terminal view

#### `/sandbox/workers` — Worker Infrastructure

- Worker node cards with CPU/RAM usage bars
- Queue length, latency, heartbeat monitoring
- Region distribution (us-east-1, eu-west-1, ap-south-1)

#### `/sandbox/reports` — Intelligence Reports

- ECharts volume chart
- Report archive table
- Storage usage metrics

#### `/sandbox/settings` — Integration Settings

- 4 tabs: Integrations API, Hypervisor Specs, Network Egress, Security
- API key management
- VirusTotal, GreyNoise integration toggles

---

### Intelligence & Investigation

#### `/threat-intel` — Threat Intelligence Hub

- **IOC (Indicator of Compromise)** library table
- Confidence scores (0-100%)
- Threat Feeds tab with provider status
- Feed health monitoring

#### `/mitre-attack` — MITRE ATT&CK Matrix

- **Interactive heatmap** showing technique coverage
- Stats: total techniques, coverage %, recent activity
- Click any technique to see related detections

#### `/graph-analysis` — Workflow Visualization ⭐ Unique Feature

- **n8n-style workflow graphs** — visual node-and-edge pipelines
- Two pre-built workflows:
  1. **Email Investigation**: Phishing Alert → Extract IOCs → Sandbox Verdict → Threat Intel → MITRE Mapping → Create Case
  2. **Lateral Movement**: RDP Brute Force → Auth Log Correlation → Behavior Score → Isolate Host
- Draggable nodes, IOC detail panel
- Color-coded node types: IP (red), Domain (blue), Hash (amber), Email (purple), Host (cyan)

#### `/map` — Geo Threat Map

- Full-page **MapLibre GL** map
- Client-side only rendering (no SSR)
- Threat origin visualization

---

### Platform

#### `/settings` — Platform Settings

- 8 tabs: General, Appearance, Notifications, API Keys, Security, Team, Usage & Billing, Marketplace
- Dashboard template builder
- Theme customization

---

## How It's Different From Competitors

| Aspect | Competitors (Proofpoint, Mimecast, etc.) | DeepMail |
|--------|------------------------------------------|----------|
| **Architecture** | Separate tools for detection, sandboxing, response | **Single unified platform** |
| **Real-time** | Batch processing, periodic scans | **WebSocket-first** — live threat feeds |
| **Customization** | Fixed dashboards | **Drag-and-drop widget grid** with role-based templates |
| **Visualization** | Basic tables and charts | **Interactive heatmaps, n8n-style workflow graphs, geo maps, 3D globe** |
| **Workflow** | Manual triage across tools | **Automated investigation pipelines** (graph analysis) |
| **UX** | Enterprise-ugly, complex navigation | **Modern dark theme, command palette (Cmd+K), keyboard shortcuts** |
| **Open Architecture** | Vendor lock-in | **Widget marketplace**, custom templates, API-first |

---

## Challenges I Faced Building This

### 1. Widget System Architecture
Designing a registry pattern that supports 20+ widget types with lazy loading, error boundaries, and role-based templates. The hardest part was making the grid layout responsive across breakpoints while persisting user customizations.

### 2. Real-Time Data Flow
Building a WebSocket manager with auto-reconnect, heartbeat, and channel subscriptions that feeds into TanStack Query's cache. The dual REST + WebSocket path for each widget required careful cache invalidation.

### 3. XState Integration
Modeling the sandbox task lifecycle as a formal state machine. Getting the XState actor to work with Zustand's persist middleware took significant debugging.

### 4. TypeScript Strict Mode with Radix UI
Radix UI's `Slot` component has CSS custom property types (`--radix-${string}`) that clash with React 19's `@types/react`. Had to split every `asChild` component into separate Slot and native element branches.

### 5. Three-Panel Email Client
Building a resizable panel layout that persists sizes across sessions, handles hydration mismatches (SSR vs client), and manages a floating compose modal with minimize/close states.

### 6. Chart Library Sprawl
Needed ECharts for gauges and heatmaps, Recharts for simple charts, and visx for custom animated visualizations. Each has different APIs and rendering approaches.

### 7. Landing Page Performance
Every section is dynamically imported with IntersectionObserver-based lazy loading. Balancing animation quality (Framer Motion) with bundle size required careful code splitting.

---

## What I Learned

- **Widget architecture patterns** — Registry + lazy loading + error boundaries = resilient dashboards
- **Real-time data strategies** — WebSocket + REST dual paths with cache invalidation
- **State machine thinking** — XState prevents impossible states in complex workflows
- **TypeScript as documentation** — Strict mode forces you to think about every data flow
- **Performance budgets** — Dynamic imports + IntersectionObserver = instant page loads
- **Enterprise UX patterns** — Command palette, keyboard shortcuts, role-based views

---

## The Business Opportunity

- **$10B+ email security market** growing at 15% CAGR
- **Every company with email** is a potential customer
- **SOC analyst shortage** — 3.5M unfilled cybersecurity jobs globally
- DeepMail reduces analyst triage time by consolidating tools into one dashboard
- **Widget marketplace** creates a platform ecosystem — third-party developers can build and sell widgets
- **SaaS model** — Starter (free), Pro ($79/mo), Enterprise ($499/mo)

---

## Summary

DeepMail is not just another email security tool — it's a **unified threat intelligence operating system** for email security. It combines real-time monitoring, automated analysis, interactive visualization, and workflow automation into a single, customizable platform built on a modern tech stack.

The codebase is **production-grade**: 100+ components, 7 Zustand stores, 20 widgets, 3-panel email client, XState-driven sandbox, n8n-style workflow graphs, and a cinematic landing page — all in TypeScript strict mode with real-time WebSocket support.
