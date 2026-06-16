# DeepMail Dashboard

The frontend application for the [DeepMail](../README.md) email threat intelligence platform. Built with Next.js 16, React 19, and TypeScript — provides real-time threat monitoring, analysis dashboards, and security operations tooling.

> **Architecture Context:** This dashboard communicates with the DeepMail backend services via REST (`http://localhost:8000/api/v1`) and WebSocket (`ws://localhost:8000/ws`). All backend services (auth, parser, header, geo, intel, ioc, scoring, graph, report, billing, notify) run on the internal network behind `deepmail-gateway`. See the [root README](../README.md) for the full system architecture.

---

## Tech Stack

| Layer              | Technology                                |
| ------------------ | ----------------------------------------- |
| Framework          | Next.js 16.2 (App Router, React 19)       |
| Language           | TypeScript 5.9 (strict mode)              |
| Styling            | Tailwind CSS v4, PostCSS                  |
| State Management   | Zustand 5 (persisted stores)              |
| Server State       | TanStack React Query 5                    |
| Charts             | ECharts 6, Recharts 3                     |
| Data Grid          | AG Grid 35, TanStack Table 8              |
| Grid Layout        | react-grid-layout (drag/resize widgets)   |
| Icons              | Lucide, Tabler, Carbon, React Icons       |
| Animation          | Framer Motion / Motion 12, GSAP           |
| 3D / Globe         | Three.js, cobe, deck.gl                   |
| Maps               | Leaflet, MapLibre GL                      |
| Forms / Input      | Radix UI, cmdk, input-otp                 |
| Notifications      | Sonner                                    |
| Validation         | Zod                                       |
| Package Manager    | Bun                                       |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended 20 LTS)
- **Bun** (package manager) — `curl -fsSL https://bun.sh/install | bash`
- **Backend running** — see [root README Quick Start](../README.md#quick-start)

### 1. Install dependencies

```bash
cd deepmail-dashboard
bun install
```

### 2. Configure environment

Create `.env.local`:

```bash
# Backend API (required)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# WebSocket endpoint (required for real-time widgets)
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### 3. Start development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
bun run build
bun start
```

---

## Project Structure

```
deepmail-dashboard/
├── src/
│   ├── app/                          # Next.js App Router routes
│   │   ├── layout.tsx                # Root layout (fonts, providers)
│   │   ├── globals.css               # Global styles, Tailwind theme
│   │   ├── (marketing)/              # Public pages (landing, auth, payments)
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── payments/page.tsx
│   │   └── (dashboard)/              # Authenticated app pages
│   │       ├── layout.tsx            # Dashboard shell (auth gate, sidebar)
│   │       ├── dashboard/page.tsx    # Main widget dashboard
│   │       ├── mail-inbox/page.tsx
│   │       ├── detections/page.tsx
│   │       ├── cases/page.tsx
│   │       ├── cases/board/page.tsx
│   │       ├── sandbox/page.tsx
│   │       ├── log-explorer/page.tsx
│   │       ├── threat-intel/page.tsx
│   │       ├── graph-analysis/page.tsx
│   │       ├── reports/page.tsx
│   │       ├── marketplace/page.tsx
│   │       ├── settings/page.tsx
│   │       └── billing/page.tsx
│   │
│   ├── components/
│   │   ├── layout/                   # App shell, sidebar, topbar, mobile nav
│   │   ├── dashboard/                # Widget grid, drag/resize, marketplace, command palette
│   │   ├── widgets/                  # Individual widget components (22 widgets)
│   │   ├── ui/                       # Reusable UI primitives (shadcn/ui-based)
│   │   ├── charts/                   # ECharts wrapper, theme config
│   │   ├── tables/                   # AG Grid theme
│   │   ├── marketing/                # Landing page sections
│   │   └── providers/                # React Query, Tooltip, Toast providers
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── auth-store.ts             # JWT token persistence
│   │   ├── dashboard-store.ts        # Widget layout, active widgets, lock state
│   │   └── layout-store.ts           # Sidebar collapse, nav group expansion
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-widget-query.ts       # REST/WS data fetching for widgets
│   │   ├── use-ws-subscription.ts    # WebSocket channel subscription
│   │   ├── use-mounted.ts            # SSR-safe mount detection
│   │   ├── use-container-size.ts     # Container width/height tracking
│   │   └── use-breakpoint.ts         # Responsive breakpoint detection
│   │
│   ├── lib/                          # Utilities and core logic
│   │   ├── api/                      # API client, endpoints, type definitions
│   │   │   ├── client.ts             # fetch wrapper with auth, error handling
│   │   │   ├── endpoints.ts          # Endpoint constants
│   │   │   └── types.ts              # API response types
│   │   ├── ws/                       # WebSocket manager
│   │   │   ├── ws-manager.ts         # Singleton WS connection with reconnect
│   │   │   └── types.ts              # WS message types
│   │   ├── dashboard/                # Dashboard grid system
│   │   │   ├── registry.ts           # Widget registry (register, lookup, categories)
│   │   │   ├── types.ts              # Widget definitions, layout types
│   │   │   ├── breakpoints.ts        # Responsive breakpoints, layout generation
│   │   │   └── presets.ts            # Default widget layout configs
│   │   ├── graph/                    # Neo4j client (for graph analysis)
│   │   ├── demo-data.ts              # Fallback demo data for widgets
│   │   └── utils.ts                  # cn() helper, general utilities
│   │
│   └── ...
│
├── public/                           # Static assets
├── components.json                   # shadcn/ui config
├── next.config.ts                    # Next.js config (security headers, image patterns)
├── tsconfig.json                     # TypeScript config (strict, path aliases)
├── tailwind.config.ts                # Tailwind theme tokens
└── package.json
```

---

## Dashboard Architecture

### Widget System

The dashboard is built around a **widget registry pattern**. Each widget is a self-contained component registered with metadata:

```typescript
widgetRegistry.register({
  id: "threat-score",
  name: "Threat Score Gauge",
  icon: "ShieldCheck",
  category: "core",
  size: { default: { w: 3, h: 2 }, min: { w: 2, h: 2 }, max: { w: 6, h: 4 } },
  dataSource: { type: "rest", endpoint: "/dashboard", pollInterval: 60_000 },
  loader: () => import("@/components/widgets/threat-score-gauge"),
  isDefault: true,
});
```

Widgets are **lazy-loaded** via dynamic imports and rendered inside a **responsive grid** (react-grid-layout) that supports drag-to-rearrange and resize.

### Data Flow

```
Widget Component
  └─ useWidgetQuery(widgetId, dataSource)
       ├─ REST → TanStack Query (polling)
       └─ WebSocket → WsManager → QueryClient cache update
```

- **REST widgets** poll their endpoint at configured intervals
- **WebSocket widgets** receive real-time pushes and update the React Query cache
- The `WsManager` handles connection lifecycle, heartbeat, exponential backoff reconnect, and channel subscriptions

### State Management

| Store              | Purpose                                      | Persistence |
| ------------------ | -------------------------------------------- | ----------- |
| `auth-store`       | JWT token, hydration state                   | localStorage |
| `dashboard-store`  | Active widgets, grid layouts, lock state     | localStorage (v4) |
| `layout-store`     | Sidebar collapsed, nav group expansion       | — |

### Available Widgets

| Widget | Category | Data Source | Description |
|--------|----------|-------------|-------------|
| Threat Score Gauge | Core | REST (poll 60s) | Aggregate threat detection score |
| Email Volume Timeline | Core | REST (poll 30s) | Inbound email volume over time |
| Severity Breakdown | Core | REST (poll 60s) | Threat severity distribution (donut) |
| Recent Threats | Core | WebSocket | Live threat feed with severity indicators |
| Pipeline Status | Core | WebSocket | Real-time analysis pipeline health |
| Threat Volume Timeline | Core | REST (poll 60s) | Grouped bar chart of threat volume |
| Top Alert Categories | Core | REST (poll 60s) | Horizontal bar breakdown by volume |
| Geo Threat Map | Intelligence | WebSocket | Geographic threat origin visualization |
| Threat Origins | Intelligence | REST (poll 60s) | Top source countries by volume |
| Attack Vector Radar | Intelligence | REST (poll 60s) | Attack type distribution radar |
| Top Malicious Senders | Intelligence | REST (poll 60s) | Most frequent malicious senders |
| Active IOCs | Intelligence | REST (poll 60s) | Top indicators of compromise |
| Threat Intel Feed | Intelligence | WebSocket | Aggregated threat intelligence feed |
| MITRE ATT&CK Heatmap | Intelligence | REST (poll 5min) | MITRE framework coverage heatmap |
| Threat Radar | Intelligence | WebSocket | Live animated radar by severity |
| DKIM/SPF/DMARC Health | Operational | REST (poll 2min) | Email authentication protocol status |
| Incident Report | Operational | REST (poll 60s) | Latest critical incident timeline |
| Sandbox Queue | Sandbox | WebSocket | File analysis job queue status |
| Infrastructure Health | Platform | REST (poll 30s) | Service health and uptime monitoring |
| Billing Usage | Platform | REST (poll 5min) | Plan usage and quota overview |
| Platform Stats | Platform | REST (poll 60s) | Key performance metrics at a glance |
| Processing Metrics | Platform | REST (poll 30s) | API usage and processing volume |

### Widget Categories

| Category | Widgets | Description |
|----------|---------|-------------|
| **Core** | 7 | Essential threat overview and pipeline monitoring |
| **Intelligence** | 6 | Threat analysis, geo-mapping, IOCs, intel feeds |
| **Operational** | 2 | Email auth health, incident tracking |
| **Sandbox** | 1 | File/URL analysis job monitoring |
| **Platform** | 4 | System health, billing, processing metrics |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/login` | Email + OTP authentication |
| `/signup` | Account registration |
| `/verify` | OTP verification |
| `/dashboard` | Main widget dashboard (customizable grid) |
| `/mail-inbox` | Email inbox with analysis status |
| `/cases` | Security case management |
| `/cases/board` | Kanban board view for cases |
| `/detections` | Threat detection alerts |
| `/sandbox` | Sandbox analysis queue and results |
| `/log-explorer` | Log search and exploration |
| `/threat-intel` | Threat intelligence feeds |
| `/graph-analysis` | Neo4j relationship graph visualization |
| `/reports` | Generated threat reports |
| `/marketplace` | Widget marketplace (add/remove widgets) |
| `/settings` | User and tenant settings |
| `/billing` | Usage and billing management |

---

## Development Commands

```bash
# Development
bun dev                  # Start dev server with HMR

# Build & Deploy
bun run build            # Production build
bun start                # Start production server

# Code Quality
bun run lint             # ESLint (core-web-vitals + typescript)
bunx tsc --noEmit        # TypeScript type checking
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8000/api/v1` | Backend REST API base URL |
| `NEXT_PUBLIC_WS_URL` | Yes | `ws://localhost:8000/ws` | Backend WebSocket endpoint |

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never commit `.env.local`.

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub/GitLab
2. Import repository on [vercel.com/new](https://vercel.com/new)
3. Set environment variables in the Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN corepack enable && corepack prepare bun@latest --activate
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Self-Hosted

Ensure the backend is reachable at the configured `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`.

---

## Contributing

1. Follow the existing code style (ESLint + TypeScript strict)
2. Components go in `src/components/` organized by domain
3. New widgets must be registered in `src/lib/dashboard/registry.ts`
4. Use the `@/` path alias for imports from `src/`
5. Test your changes against the backend — run the full stack locally

---
