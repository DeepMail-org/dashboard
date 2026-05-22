"use client";

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
	if (n >= 1_000) {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	return String(n);
}

const QUOTA_ITEMS = [
	{ label: "Emails Scanned", used: 42_847, total: 50_000, unit: "emails" },
	{ label: "Sandbox Analyses", used: 1_234, total: 2_000, unit: "analyses" },
	{ label: "API Calls", used: 89_200, total: 100_000, unit: "calls" },
	{ label: "Storage", used: 3.2, total: 5, unit: "GB" },
];

export default function BillingPage() {
	return (
		<div className="mx-auto w-full max-w-250 space-y-8 p-8">
			<div>
				<h1 className="font-display text-lg font-medium text-fg">
					Usage
				</h1>
				<p className="mt-1 text-xs text-muted">
					Monitor your platform resource consumption and billing
				</p>
			</div>

			{/* Resource Quotas + Credit Usage — side by side */}
			<div className="flex flex-col gap-6 xl:flex-row xl:items-start">
				{/* Resource Quotas */}
				<div className="shrink-0 xl:w-72">
					<div className="grid grid-cols-1 gap-3">
						{QUOTA_ITEMS.map((item) => {
							const pct = (item.used / item.total) * 100;
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
											{typeof item.used === "number"
												? formatNumber(item.used)
												: item.used}
										</span>
										<span className="text-[10px] text-dimmed">
											/{" "}
											{typeof item.total === "number"
												? formatNumber(item.total)
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

				{/* Credit Usage Card */}
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

			{/* Invoices */}
			<div>
				<h2 className="mb-3 text-sm font-medium text-fg">
					Recent Invoices
				</h2>
				<div className="overflow-hidden rounded-xl border border-border">
					<table className="w-full text-left">
						<thead>
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

			{/* Payment Method */}
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
	);
}
