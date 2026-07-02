"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	Settings,
	Bell,
	Key,
	Shield,
	Users,
	Palette,
	Box,
	Search,
	Download,
	Star,
	Check,
} from "lucide-react";
import { TemplateAppearanceTab } from "@/components/settings/template-appearance-tab";
import { CreditCard } from "lucide-react";
import { CreditUsageCard } from "@/components/ui/credit-usage-card";

const USAGE_HISTORY = [
	{
		date: "May 18",
		model: "Email Scanner",
		credits: "6,241",
		cost: "$412.00",
	},
	{ date: "May 17", model: "Sandbox Engine", credits: "182", cost: "$91.00" },
	{
		date: "May 16",
		model: "API Gateway",
		credits: "12,480",
		cost: "$124.80",
	},
	{
		date: "May 15",
		model: "Email Scanner",
		credits: "5,892",
		cost: "$389.00",
	},
	{
		date: "May 14",
		model: "Threat Intel",
		credits: "3,120",
		cost: "$156.00",
	},
];

const INVOICES = [
	{
		id: "INV-2026-05",
		date: "May 1, 2026",
		amount: "$2,499.00",
		status: "Paid",
	},
	{
		id: "INV-2026-04",
		date: "Apr 1, 2026",
		amount: "$2,499.00",
		status: "Paid",
	},
	{
		id: "INV-2026-03",
		date: "Mar 1, 2026",
		amount: "$2,499.00",
		status: "Paid",
	},
	{
		id: "INV-2026-02",
		date: "Feb 1, 2026",
		amount: "$2,499.00",
		status: "Paid",
	},
];

function formatNumber(n: number): string {
	if (n >= 1_000) return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return String(n);
}

const QUOTA_ITEMS = [
	{ label: "Emails Scanned", used: 42_847, total: 50_000, unit: "emails" },
	{ label: "Sandbox Analyses", used: 1_234, total: 2_000, unit: "analyses" },
	{ label: "API Calls", used: 89_200, total: 100_000, unit: "calls" },
	{ label: "Storage", used: 3.2, total: 5, unit: "GB" },
];

type SettingsTab =
	| "general"
	| "appearance"
	| "notifications"
	| "api"
	| "security"
	| "team"
	| "usage"
	| "marketplace";

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
	{ key: "general", label: "General", icon: Settings },
	{ key: "appearance", label: "Appearance", icon: Palette },
	{ key: "notifications", label: "Notifications", icon: Bell },
	{ key: "api", label: "API Keys", icon: Key },
	{ key: "security", label: "Security", icon: Shield },
	{ key: "team", label: "Team", icon: Users },
	{ key: "usage", label: "Usage & Billing", icon: CreditCard },
	{ key: "marketplace", label: "Marketplace", icon: Box },
];

const API_KEYS = [
	{
		name: "Production Scanner",
		key: "dm_live_a8f3...4f6a",
		created: "2026-03-15",
		lastUsed: "2 min ago",
		status: "active",
	},
	{
		name: "Staging Environment",
		key: "dm_test_b7c4...3d4e",
		created: "2026-04-20",
		lastUsed: "3h ago",
		status: "active",
	},
	{
		name: "CI/CD Pipeline",
		key: "dm_live_c9d2...5e7f",
		created: "2026-01-10",
		lastUsed: "1 day ago",
		status: "active",
	},
];

const TEAM_MEMBERS = [
	{
		name: "Admin User",
		email: "admin@deepmail.io",
		role: "Owner",
		lastActive: "Now",
	},
	{
		name: "Alice Kim",
		email: "alice@deepmail.io",
		role: "Analyst",
		lastActive: "5m ago",
	},
	{
		name: "James Rodriguez",
		email: "james@deepmail.io",
		role: "Analyst",
		lastActive: "2h ago",
	},
	{
		name: "Tara Singh",
		email: "tara@deepmail.io",
		role: "Viewer",
		lastActive: "1d ago",
	},
];

function ToggleRow({
	label,
	description,
	defaultOn = false,
}: {
	label: string;
	description: string;
	defaultOn?: boolean;
}) {
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
				<div
					className={`absolute top-0.5 h-4 w-4 rounded-full bg-fg transition-transform ${on ? "left-4.5" : "left-0.5"}`}
				/>
			</button>
		</div>
	);
}

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

const MARKETPLACE_ITEMS: MarketplaceItem[] = [
	{
		id: "mi-1",
		name: "Advanced Threat Heatmap",
		description:
			"MITRE ATT&CK technique heatmap with drill-down analysis and weekly trend comparisons",
		category: "security",
		author: "DeepMail",
		rating: 4.8,
		installs: "12.3k",
		installed: true,
	},
	{
		id: "mi-2",
		name: "Geo Threat Map",
		description:
			"Interactive geographic visualization of threat origins with MapLibre GL and real-time updates",
		category: "analytics",
		author: "DeepMail",
		rating: 4.7,
		installs: "10.1k",
		installed: true,
	},
	{
		id: "mi-3",
		name: "Slack Integration",
		description:
			"Push critical alerts and case updates directly to Slack channels with rich formatting",
		category: "integration",
		author: "DeepMail",
		rating: 4.6,
		installs: "8.9k",
		installed: false,
	},
	{
		id: "mi-4",
		name: "PagerDuty Bridge",
		description:
			"Trigger PagerDuty incidents for critical detections with automatic severity mapping",
		category: "integration",
		author: "Community",
		rating: 4.4,
		installs: "5.2k",
		installed: false,
	},
	{
		id: "mi-5",
		name: "SOC 2 Compliance Pack",
		description:
			"Pre-built detection rules and reports for SOC 2 Type II audit requirements",
		category: "compliance",
		author: "DeepMail",
		rating: 4.9,
		installs: "7.8k",
		installed: false,
	},
	{
		id: "mi-6",
		name: "Executive Dashboard",
		description:
			"High-level KPI widgets designed for C-suite reporting with export-ready charts",
		category: "analytics",
		author: "DeepMail",
		rating: 4.5,
		installs: "6.4k",
		installed: true,
	},
	{
		id: "mi-7",
		name: "GDPR Data Scanner",
		description:
			"Scan email attachments for PII and flag potential GDPR compliance violations",
		category: "compliance",
		author: "Community",
		rating: 4.3,
		installs: "3.1k",
		installed: false,
	},
	{
		id: "mi-8",
		name: "Jira Ticket Sync",
		description:
			"Bi-directional sync between DeepMail cases and Jira tickets with status mapping",
		category: "integration",
		author: "Community",
		rating: 4.2,
		installs: "4.6k",
		installed: false,
	},
	{
		id: "mi-9",
		name: "Sandbox Deep Analyzer",
		description:
			"Extended sandbox analysis with behavioral trees, memory forensics, and network capture",
		category: "security",
		author: "DeepMail",
		rating: 4.8,
		installs: "9.3k",
		installed: true,
	},
	{
		id: "mi-10",
		name: "Custom YARA Editor",
		description:
			"In-browser YARA rule editor with syntax highlighting, testing, and auto-deploy",
		category: "security",
		author: "DeepMail",
		rating: 4.7,
		installs: "7.1k",
		installed: false,
	},
];

function MarketplaceTabContent() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<Category>("all");

	const filtered = MARKETPLACE_ITEMS.filter((item) => {
		if (category !== "all" && item.category !== category) return false;
		if (
			search &&
			!item.name.toLowerCase().includes(search.toLowerCase()) &&
			!item.description.toLowerCase().includes(search.toLowerCase())
		)
			return false;
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
		<div className="space-y-6">
			<div>
				<h2 className="text-sm font-medium text-fg">Marketplace</h2>
				<p className="mt-1 text-xs text-muted">
					Extend DeepMail with widgets, integrations, and compliance
					packs
				</p>
			</div>
			<div className="mb-6 flex flex-col xl:flex-row xl:items-center gap-4">
				<div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
					<Search className="h-3.5 w-3.5 text-muted" />
					<input
						type="text"
						placeholder="Search marketplace..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-56 bg-transparent text-xs text-fg placeholder:text-muted outline-none"
					/>
				</div>
				<div className="flex gap-1 flex-wrap">
					{categories.map((c) => (
						<button
							key={c.key}
							onClick={() => setCategory(c.key)}
							className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
								category === c.key
									? "bg-fg/8 text-fg"
									: "text-muted hover:text-fg"
							}`}
						>
							{c.label}
						</button>
					))}
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{filtered.map((item) => (
					<div
						key={item.id}
						className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-hover"
					>
						<div className="mb-2 flex items-start justify-between">
							<div>
								<h3 className="text-sm font-medium text-fg">
									{item.name}
								</h3>
								<span className="text-[10px] text-muted">
									by {item.author}
								</span>
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
						<p className="mb-3 text-xs leading-relaxed text-muted">
							{item.description}
						</p>
						<div className="flex items-center gap-4 text-[10px] text-dimmed">
							<span className="flex items-center gap-1">
								<Star className="h-3 w-3 fill-warning text-warning" />
								{item.rating}
							</span>
							<span>{item.installs} installs</span>
							<span className="rounded bg-fg/5 px-1.5 py-px capitalize">
								{item.category}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function SettingsTabsContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const tabParam = searchParams.get("tab") as SettingsTab | null;
	const [activeTab, setActiveTab] = useState<SettingsTab>("general");

	useEffect(() => {
		if (tabParam && TABS.some((t) => t.key === tabParam)) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setActiveTab(tabParam);
		}
	}, [tabParam]);

	const handleTabClick = (key: SettingsTab) => {
		setActiveTab(key);
		router.push(`?tab=${key}`, { scroll: false });
	};

	return (
		<div className="flex gap-8">
			{/* Sidebar */}
			<div className="w-48 shrink-0 space-y-1">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						onClick={() => handleTabClick(tab.key)}
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
						<h2 className="text-sm font-medium text-fg">
							General Settings
						</h2>
						<div className="space-y-3">
							<div className="rounded-lg border border-border bg-surface/50 px-4 py-3">
								<label className="text-[11px] text-muted">
									Organization Name
								</label>
								<input
									type="text"
									defaultValue="Acme Corporation"
									className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
								/>
							</div>
							<div className="rounded-lg border border-border bg-surface/50 px-4 py-3">
								<label className="text-[11px] text-muted">
									Default Timezone
								</label>
								<input
									type="text"
									defaultValue="UTC"
									className="mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
								/>
							</div>

							<ToggleRow
								label="Compact View"
								description="Reduce spacing in tables and lists"
							/>
						</div>
					</>
				)}

				{activeTab === "appearance" && <TemplateAppearanceTab />}

				{activeTab === "notifications" && (
					<>
						<h2 className="text-sm font-medium text-fg">
							Notification Preferences
						</h2>
						<div className="space-y-3">
							<ToggleRow
								label="Critical Threats"
								description="Immediate alerts for critical severity detections"
								defaultOn
							/>
							<ToggleRow
								label="High Threats"
								description="Alerts for high severity detections"
								defaultOn
							/>
							<ToggleRow
								label="New Cases"
								description="Notify when new cases are created"
								defaultOn
							/>
							<ToggleRow
								label="Sandbox Results"
								description="Notify when sandbox analysis completes"
							/>
							<ToggleRow
								label="Weekly Digest"
								description="Weekly summary report via email"
								defaultOn
							/>
						</div>
					</>
				)}

				{activeTab === "api" && (
					<>
						<div className="flex items-center justify-between">
							<h2 className="text-sm font-medium text-fg">
								API Keys
							</h2>
							<button className="rounded-md bg-fg px-3 py-1.5 text-xs font-medium text-bg">
								Generate Key
							</button>
						</div>
						<div className="overflow-hidden rounded-xl border border-border">
							<table className="w-full text-left">
								<thead className="sticky top-0 z-10 bg-surface">
									<tr>
										{[
											"Name",
											"Key",
											"Created",
											"Last Used",
											"",
										].map((col) => (
											<th
												key={col}
												className="border-b border-border bg-fg/2 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted"
											>
												{col}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{API_KEYS.map((k) => (
										<tr
											key={k.key}
											className="hover:bg-fg/3"
										>
											<td className="border-b border-fg/3 px-4 py-3 text-xs text-fg">
												{k.name}
											</td>
											<td className="border-b border-fg/3 px-4 py-3 font-mono text-[11px] text-muted">
												{k.key}
											</td>
											<td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">
												{k.created}
											</td>
											<td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">
												{k.lastUsed}
											</td>
											<td className="border-b border-fg/3 px-4 py-3 text-right">
												<button className="text-[11px] text-danger hover:underline">
													Revoke
												</button>
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
						<h2 className="text-sm font-medium text-fg">
							Security Settings
						</h2>
						<div className="space-y-3">
							<ToggleRow
								label="Two-Factor Authentication"
								description="Require 2FA for all team members"
								defaultOn
							/>
							<ToggleRow
								label="IP Allowlist"
								description="Restrict API access to specific IP ranges"
							/>
							<ToggleRow
								label="Session Timeout"
								description="Auto-logout after 30 minutes of inactivity"
								defaultOn
							/>
							<ToggleRow
								label="Audit Logging"
								description="Log all administrative actions"
								defaultOn
							/>
						</div>
					</>
				)}

				{activeTab === "usage" && (
					<div className="space-y-8">
						<div className="flex flex-col gap-6 xl:flex-row xl:items-start">
							<div className="shrink-0 xl:w-72">
								<div className="grid grid-cols-1 gap-3">
									{QUOTA_ITEMS.map((item) => {
										const pct =
											(item.used / item.total) * 100;
										const isHigh = pct > 80;
										return (
											<div
												key={item.label}
												className="rounded-xl border border-border bg-surface p-4.5"
											>
												<div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
													{item.label}
												</div>
												<div className="mb-2 flex items-baseline gap-1.5">
													<span className="font-display text-base font-bold text-fg">
														{typeof item.used ===
														"number"
															? formatNumber(
																	item.used,
																)
															: item.used}
													</span>
													<span className="text-[10px] text-dimmed">
														/{" "}
														{typeof item.total ===
														"number"
															? formatNumber(
																	item.total,
																)
															: item.total}{" "}
														{item.unit}
													</span>
												</div>
												<div className="h-1.5 w-full overflow-hidden rounded-full bg-fg/5">
													<div
														className="h-full rounded-full transition-all duration-500"
														style={{
															width: `${Math.min(pct, 100)}%`,
															background: isHigh
																? "linear-gradient(90deg, #f97316, #ef4444)"
																: "linear-gradient(90deg, rgba(168,85,247,0.5), rgba(168,85,247,0.9))",
														}}
													/>
												</div>
												<div className="mt-1 text-right text-[10px] font-mono text-dimmed">
													{pct.toFixed(1)}%
												</div>
											</div>
										);
									})}
								</div>
							</div>
							<div className="min-w-0 flex-1">
								<CreditUsageCard
									usedCreditsPercent={85.7}
									totalCreditsLabel="50K EMAILS"
									creditsUsedLabel="42.8K"
									creditsLeftLabel="7.2K"
									usageHistory={USAGE_HISTORY}
									onManagePlan={() => {}}
									onViewAll={() => {}}
									wrapperClassName="flex w-full flex-col font-sans"
								/>
							</div>
						</div>

						<div>
							<h2 className="mb-3 text-sm font-medium text-fg">
								Recent Invoices
							</h2>
							<div className="overflow-hidden rounded-xl border border-border">
								<table className="w-full text-left">
									<thead className="sticky top-0 z-10 bg-surface">
										<tr>
											{[
												"Invoice",
												"Date",
												"Amount",
												"Status",
												"",
											].map((col) => (
												<th
													key={col}
													className="border-b border-border bg-fg/2 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted"
												>
													{col}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{INVOICES.map((inv) => (
											<tr
												key={inv.id}
												className="hover:bg-fg/3 transition-colors"
											>
												<td className="border-b border-fg/3 px-4 py-3 font-mono text-xs text-accent">
													{inv.id}
												</td>
												<td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">
													{inv.date}
												</td>
												<td className="border-b border-fg/3 px-4 py-3 font-mono text-xs text-fg">
													{inv.amount}
												</td>
												<td className="border-b border-fg/3 px-4 py-3">
													<span className="rounded bg-success/10 px-2 py-0.5 text-[10px] text-success">
														{inv.status}
													</span>
												</td>
												<td className="border-b border-fg/3 px-4 py-3 text-right">
													<button className="text-[11px] text-muted hover:text-fg transition-colors">
														Download
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="rounded-xl border border-border bg-surface p-4">
							<h2 className="mb-3 text-sm font-medium text-fg">
								Payment Method
							</h2>
							<div className="flex items-center gap-3">
								<CreditCard className="h-5 w-5 text-muted" />
								<div>
									<div className="text-xs text-fg">
										Visa ending in 4242
									</div>
									<div className="text-[11px] text-muted">
										Expires 12/2027
									</div>
								</div>
								<button className="ml-auto text-[11px] text-accent hover:underline">
									Update
								</button>
							</div>
						</div>
					</div>
				)}

				{activeTab === "team" && (
					<>
						<div className="flex items-center justify-between">
							<h2 className="text-sm font-medium text-fg">
								Team Members
							</h2>
							<button className="rounded-md bg-fg px-3 py-1.5 text-xs font-medium text-bg">
								Invite Member
							</button>
						</div>
						<div className="overflow-hidden rounded-xl border border-border">
							<table className="w-full text-left">
								<thead className="sticky top-0 z-10 bg-surface">
									<tr>
										{[
											"Name",
											"Email",
											"Role",
											"Last Active",
										].map((col) => (
											<th
												key={col}
												className="border-b border-border bg-fg/2 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted"
											>
												{col}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{TEAM_MEMBERS.map((m) => (
										<tr
											key={m.email}
											className="hover:bg-fg/3"
										>
											<td className="border-b border-fg/3 px-4 py-3 text-xs text-fg">
												{m.name}
											</td>
											<td className="border-b border-fg/3 px-4 py-3 text-xs text-muted">
												{m.email}
											</td>
											<td className="border-b border-fg/3 px-4 py-3">
												<span className="rounded bg-fg/5 px-2 py-0.5 text-[10px] text-muted">
													{m.role}
												</span>
											</td>
											<td className="border-b border-fg/3 px-4 py-3 font-mono text-[11px] text-muted">
												{m.lastActive}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}
				{activeTab === "marketplace" && <MarketplaceTabContent />}
			</div>
		</div>
	);
}

export default function SettingsPage() {
	return (
		<PageWrapper
			header={
				<h1 className="font-display text-lg font-medium text-fg">
					Settings
				</h1>
			}
		>
			<Suspense
				fallback={
					<div className="text-sm text-muted">
						Loading settings...
					</div>
				}
			>
				<SettingsTabsContent />
			</Suspense>
		</PageWrapper>
	);
}
