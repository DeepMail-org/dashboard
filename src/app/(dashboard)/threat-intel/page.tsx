"use client";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { useState, useMemo } from "react";
import {
	Search,
	Plus,
	ExternalLink,
	Tag,
	Shield,
	Globe,
	Hash,
	Mail,
	Link,
} from "lucide-react";
import { MOCK_IOCS, MOCK_FEEDS } from "@/lib/data-access/threat-intel";
import { SeverityPill } from "@/components/ui/severity-pill";
import { StatusBadge } from "@/components/ui/status-badge";
import { ExportButton } from "@/components/ui/export-button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";

const IOC_ICON: Record<string, React.ElementType> = {
	ip: Globe,
	domain: Globe,
	hash: Hash,
	url: Link,
	email: Mail,
};

const IOC_COLOR: Record<string, string> = {
	ip: "text-info",
	domain: "text-accent",
	hash: "text-warning",
	url: "text-orange",
	email: "text-muted",
};

type Tab = "iocs" | "feeds";

function ConfidenceBar({ value }: { value: number }) {
	const color =
		value >= 90
			? "bg-danger"
			: value >= 75
				? "bg-orange"
				: value >= 60
					? "bg-warning"
					: "bg-muted";
	return (
		<div className="flex items-center gap-2">
			<div className="h-1.5 w-16 rounded-full bg-fg/10 overflow-hidden">
				<div
					className={cn("h-full rounded-full", color)}
					style={{ width: `${value}%` }}
				/>
			</div>
			<span className="font-mono text-[11px] text-muted">{value}%</span>
		</div>
	);
}

export default function ThreatIntelPage() {
	const [tab, setTab] = useState<Tab>("iocs");
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<string>("all");

	const filteredIOCs = useMemo(() => {
		let d = [...MOCK_IOCS];
		if (typeFilter !== "all") d = d.filter((i) => i.type === typeFilter);
		if (search) {
			const q = search.toLowerCase();
			d = d.filter(
				(i) =>
					i.value.toLowerCase().includes(q) ||
					i.tags.some((t) => t.toLowerCase().includes(q)),
			);
		}
		return d;
	}, [search, typeFilter]);

	return (
		<PageWrapper
			header={
				<div className="flex items-end justify-between gap-4">
					<div>
						<h1 className="dm-heading text-xl text-fg">
							Threat Intelligence
						</h1>
						<p className="mt-1 text-xs text-muted">
							{MOCK_IOCS.length} IOCs ·{" "}
							{
								MOCK_FEEDS.filter((f) => f.status === "active")
									.length
							}{" "}
							active feeds
						</p>
					</div>
					<div className="flex items-center gap-2">
						<ExportButton
							onExport={(fmt) => {
								void fmt;
								return new Promise((r) => setTimeout(r, 600));
							}}
						/>
						<button className="flex items-center gap-2 rounded-md bg-fg px-3.5 py-1.5 text-xs font-medium text-bg hover:opacity-90">
							<Plus className="h-3.5 w-3.5" />
							Add IOC
						</button>
					</div>
				</div>
			}
		>
			{/* Stats */}
			<div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
				{[
					{
						label: "Total IOCs",
						value: MOCK_IOCS.length.toString(),
						color: "text-fg",
					},
					{
						label: "Critical IOCs",
						value: MOCK_IOCS.filter(
							(i) => i.severity === "critical",
						).length.toString(),
						color: "text-danger",
					},
					{
						label: "Active Feeds",
						value: MOCK_FEEDS.filter(
							(f) => f.status === "active",
						).length.toString(),
						color: "text-success",
					},
					{
						label: "Total Feed IOCs",
						value: MOCK_FEEDS.reduce(
							(s, f) => s + f.count,
							0,
						).toLocaleString(),
						color: "text-accent",
					},
				].map((s) => (
					<div
						key={s.label}
						className="rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-4 py-3 shadow-card"
					>
						<div
							className={cn(
								"font-display text-2xl font-bold",
								s.color,
							)}
						>
							{s.value}
						</div>
						<div className="mt-0.5 text-[11px] text-muted">
							{s.label}
						</div>
					</div>
				))}
			</div>

			{/* Tabs */}
			<div className="mb-5 flex border-b border-border">
				{[
					{ key: "iocs" as Tab, label: "IOC Library" },
					{ key: "feeds" as Tab, label: "Threat Feeds" },
				].map((t) => (
					<button
						key={t.key}
						onClick={() => setTab(t.key)}
						className={cn(
							"px-4 py-2.5 text-[13px] transition-colors",
							tab === t.key
								? "border-b-2 border-accent text-fg font-medium"
								: "text-muted hover:text-fg",
						)}
					>
						{t.label}
					</button>
				))}
			</div>

			{tab === "iocs" && (
				<>
					{/* IOC Filters */}
					<div className="mb-4 flex items-center gap-3 flex-wrap">
						<div className="flex items-center gap-2 rounded-md border border-border bg-fg/2 px-3 py-1.5">
							<Search className="h-3.5 w-3.5 text-muted" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search IOCs…"
								className="w-48 bg-transparent text-xs text-fg outline-none placeholder:text-dimmed"
							/>
						</div>
						<div className="flex gap-1">
							{[
								"all",
								"ip",
								"domain",
								"hash",
								"url",
								"email",
							].map((type) => (
								<button
									key={type}
									onClick={() => setTypeFilter(type)}
									className={cn(
										"rounded-full px-3 py-1 text-[11px] capitalize transition-colors",
										typeFilter === type
											? "bg-accent/15 text-accent"
											: "text-muted hover:text-fg",
									)}
								>
									{type === "all"
										? "All Types"
										: type.toUpperCase()}
								</button>
							))}
						</div>
					</div>

					{/* IOC Table */}
					<div className="overflow-hidden rounded-xl border border-border shadow-card">
						<table className="w-full text-left">
							<thead>
								<tr>
									{[
										"Type",
										"Value",
										"Severity",
										"Confidence",
										"Source",
										"Tags",
										"Last Seen",
										"Related",
									].map((col) => (
										<th
											key={col}
											className="border-b border-border bg-fg/2 px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-muted"
										>
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{filteredIOCs.map((ioc) => {
									const Icon = IOC_ICON[ioc.type];
									return (
										<tr
											key={ioc.id}
											className="border-b border-fg/5 transition-colors hover:bg-fg/4"
										>
											<td className="px-4 py-3.5">
												<div
													className={cn(
														"flex items-center gap-1.5",
														IOC_COLOR[ioc.type],
													)}
												>
													<Icon className="h-3.5 w-3.5" />
													<span className="text-[10px] font-medium uppercase">
														{ioc.type}
													</span>
												</div>
											</td>
											<td className="px-4 py-3.5 max-w-xs">
												<div className="flex items-center gap-1.5">
													<span className="font-mono text-[11px] text-fg truncate">
														{ioc.value}
													</span>
													<button className="shrink-0 text-dimmed hover:text-accent">
														<ExternalLink className="h-3 w-3" />
													</button>
												</div>
												{ioc.adversary && (
													<div className="mt-0.5 text-[10px] text-danger">
														{ioc.adversary}
													</div>
												)}
											</td>
											<td className="px-4 py-3.5">
												<SeverityPill
													severity={ioc.severity}
													size="xs"
												/>
											</td>
											<td className="px-4 py-3.5">
												<ConfidenceBar
													value={ioc.confidence}
												/>
											</td>
											<td className="px-4 py-3.5">
												<span className="text-[11px] text-muted">
													{ioc.source}
												</span>
											</td>
											<td className="px-4 py-3.5">
												<div className="flex flex-wrap gap-1">
													{ioc.tags
														.slice(0, 2)
														.map((tag) => (
															<span
																key={tag}
																className="flex items-center gap-0.5 rounded bg-fg/5 px-1.5 py-px text-[9px] text-dimmed"
															>
																<Tag className="h-2 w-2" />
																{tag}
															</span>
														))}
												</div>
											</td>
											<td className="px-4 py-3.5">
												<span className="text-[11px] text-muted">
													{formatDistanceToNow(
														parseISO(ioc.lastSeen),
														{ addSuffix: true },
													)}
												</span>
											</td>
											<td className="px-4 py-3.5">
												<span
													className={cn(
														"rounded-full px-2 py-0.5 text-[10px] font-medium",
														ioc.relatedCount > 0
															? "bg-accent/10 text-accent"
															: "text-dimmed",
													)}
												>
													{ioc.relatedCount}
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</>
			)}

			{tab === "feeds" && (
				<div className="space-y-3">
					{MOCK_FEEDS.map((feed) => (
						<div
							key={feed.id}
							className="flex items-center gap-4 rounded-xl border border-border bg-linear-to-b from-fg/5 to-fg/1 px-5 py-4"
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
								<Shield className="h-5 w-5 text-muted" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<p className="text-[13px] font-medium text-fg">
										{feed.name}
									</p>
									<StatusBadge
										status={
											feed.status as
												| "active"
												| "disabled"
												| "testing"
										}
									/>
								</div>
								<p className="text-[11px] text-muted">
									{feed.provider} · {feed.type.toUpperCase()}
								</p>
							</div>
							<div className="text-right">
								<p className="font-mono text-[13px] font-bold text-fg">
									{feed.count.toLocaleString()}
								</p>
								<p className="text-[10px] text-dimmed">
									Updated {feed.lastUpdated}
								</p>
							</div>
							<button className="h-7 w-7 flex items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-fg transition-colors">
								<ExternalLink className="h-3.5 w-3.5" />
							</button>
						</div>
					))}
				</div>
			)}
		</PageWrapper>
	);
}
