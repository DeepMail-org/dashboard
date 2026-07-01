"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import {
	SandboxTask,
	SandboxTaskStatus,
	useSandboxStore,
} from "@/stores/sandbox-store";
import { cn } from "@/lib/utils";
import {
	SandboxTaskDetail,
	TABS,
} from "@/components/sandbox/sandbox-task-detail";

interface SandboxTaskTableProps {
	title?: string;
	tasks?: SandboxTask[];
	onStatusChange?: (taskId: string, newStatus: SandboxTaskStatus) => void;
	className?: string;
}

export function SandboxTaskTable({
	title = "Sandbox Queue",
	tasks: initialTasks,
	onStatusChange,
	className = "",
}: SandboxTaskTableProps = {}) {
	// If no tasks passed, default to store
	const storeTasks = useSandboxStore((s) => s.tasks);
	const displayTasks = initialTasks || storeTasks;

	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const selectedTask = displayTasks.find((s) => s.id === selectedTaskId) || null;
	const [activeTab, setActiveTab] = useState("overview");

	const openTaskModal = (task: SandboxTask) => {
		setSelectedTaskId(task.id);
	};

	const closeTaskModal = () => {
		setSelectedTaskId(null);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && selectedTask) {
				closeTaskModal();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedTask]);

	const getOSIcon = (osType?: string) => {
		const os = (osType || "windows").toLowerCase();
		if (os.includes("win")) {
			return (
				<div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-1.5 border border-border/30 shadow-sm">
					<svg width="16" height="16" viewBox="0 0 32 32" fill="none">
						<path
							className="fill-white"
							d="M30,15H17c-0.6,0-1-0.4-1-1V3.3c0-0.5,0.4-0.9,0.8-1l13-2.3c0.3,0,0.6,0,0.8,0.2C30.9,0.4,31,0.7,31,1v13 C31,14.6,30.6,15,30,15z"
						/>
						<path
							className="fill-white"
							d="M13,15H1c-0.6,0-1-0.4-1-1V6c0-0.5,0.4-0.9,0.8-1l12-2c0.3,0,0.6,0,0.8,0.2C13.9,3.4,14,3.7,14,4v10 C14,14.6,13.6,15,13,15z"
						/>
						<path
							className="fill-white"
							d="M30,32c-0.1,0-0.1,0-0.2,0l-13-2.3c-0.5-0.1-0.8-0.5-0.8-1V18c0-0.6,0.4-1,1-1h13c0.6,0,1,0.4,1,1v13 c0,0.3-0.1,0.6-0.4,0.8C30.5,31.9,30.2,32,30,32z"
						/>
						<path
							className="fill-white"
							d="M13,29c-0.1,0-0.1,0-0.2,0l-12-2C0.4,26.9,0,26.5,0,26v-8c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v10 c0,0.3-0.1,0.6-0.4,0.8C13.5,28.9,13.2,29,13,29z"
						/>
					</svg>
				</div>
			);
		} else if (os.includes("ubuntu") || os.includes("debian")) {
			return (
				<div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-1.5 border border-border/30 shadow-sm">
					<svg
						width="16"
						height="16"
						viewBox="-5 0 32 32"
						fill="white"
					>
						<path d="M16.469 9.375c-1.063-0.594-1.406-1.938-0.813-3 0.406-0.719 1.156-1.094 1.906-1.094 0.375 0 0.75 0.094 1.094 0.281 1.063 0.625 1.406 1.969 0.813 3-0.406 0.719-1.156 1.094-1.906 1.094-0.375 0-0.75-0.094-1.094-0.281zM21.938 15.594h-3.625c-0.125-1.688-0.969-3.188-2.25-4.156-0.219-0.156-0.438-0.313-0.688-0.469-0.813-0.438-1.75-0.688-2.75-0.688-1.031 0-1.969 0.25-2.813 0.719l-2-3.031c1.406-0.844 3.031-1.313 4.813-1.313 0.688 0 1.375 0.063 2.063 0.219-0.25 1.219 0.281 2.5 1.406 3.156 0.438 0.25 0.938 0.375 1.469 0.375 0.719 0 1.406-0.25 1.938-0.719 1.438 1.563 2.344 3.625 2.438 5.906zM7.125 8.438l2 3.031c-1.25 0.969-2.094 2.438-2.188 4.125-0.031 0.125-0.031 0.25-0.031 0.406 0 0.125 0 0.281 0.031 0.406 0.125 1.781 1.063 3.313 2.438 4.281l-1.906 3.094c-1.813-1.188-3.188-3-3.813-5.125 0.875-0.5 1.5-1.469 1.5-2.563s-0.625-2.094-1.563-2.594c0.594-2.063 1.844-3.844 3.531-5.063zM2.188 13.906c1.219 0 2.219 0.969 2.219 2.188s-1 2.219-2.219 2.219-2.188-1-2.188-2.219 0.969-2.188 2.188-2.188zM8.188 24.219l1.906-3.125c0.75 0.375 1.625 0.594 2.531 0.594 1 0 1.938-0.25 2.781-0.719 0.25-0.125 0.469-0.281 0.688-0.469 1.25-0.938 2.094-2.406 2.219-4.094h3.625c-0.094 2.375-1.094 4.531-2.656 6.125-0.469-0.344-1.063-0.531-1.656-0.531-0.531 0-1.031 0.125-1.469 0.375-1 0.594-1.531 1.656-1.469 2.719-0.688 0.156-1.375 0.25-2.063 0.25-1.625 0-3.125-0.406-4.438-1.125zM17.625 22.75c0.75 0 1.5 0.375 1.906 1.094 0.594 1.063 0.219 2.438-0.813 3.031-0.344 0.188-0.719 0.281-1.094 0.281-0.781 0-1.5-0.375-1.906-1.094-0.625-1.063-0.25-2.406 0.813-3.031 0.344-0.188 0.719-0.281 1.094-0.281z" />
					</svg>
				</div>
			);
		}
		return (
			<div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border border-border/30 shadow-sm">
				<div className="text-white text-xs font-mono font-bold">L</div>
			</div>
		);
	};

	const getRiskBars = (risk: number, status: SandboxTaskStatus) => {
		const filledBars = Math.round((risk / 100) * 10);

		const getBarColor = (index: number) => {
			if (index >= filledBars)
				return "bg-muted/40 border border-border/30";
			if (risk > 75) return "bg-danger";
			if (risk > 40) return "bg-warning";
			if (risk > 0) return "bg-success";
			return "bg-muted-foreground/30";
		};

		return (
			<div className="flex items-center gap-3">
				<div className="flex gap-1">
					{Array.from({ length: 10 }).map((_, index) => (
						<div
							key={index}
							className={`w-1.5 h-4 rounded-full transition-all duration-500 ${getBarColor(index)}`}
						/>
					))}
				</div>
				<span
					className={cn(
						"text-xs font-mono font-medium min-w-[2rem]",
						risk > 75
							? "text-danger"
							: risk > 40
								? "text-warning"
								: "text-success",
					)}
				>
					{risk || 0}
				</span>
			</div>
		);
	};

	const getStatusBadge = (status: SandboxTaskStatus) => {
		switch (status) {
			case "running":
				return (
					<div className="px-3 py-1 rounded border border-accent/30 bg-accent/10 flex items-center justify-center">
						<span className="text-accent text-[11px] uppercase font-bold tracking-wider">
							Running
						</span>
					</div>
				);
			case "completed":
				return (
					<div className="px-3 py-1 rounded border border-success/30 bg-success/10 flex items-center justify-center">
						<span className="text-success text-[11px] uppercase font-bold tracking-wider">
							Completed
						</span>
					</div>
				);
			case "failed":
			case "cancelled":
				return (
					<div className="px-3 py-1 rounded border border-danger/30 bg-danger/10 flex items-center justify-center">
						<span className="text-danger text-[11px] uppercase font-bold tracking-wider">
							{status}
						</span>
					</div>
				);
			default:
				return (
					<div className="px-3 py-1 rounded border border-muted/30 bg-muted/10 flex items-center justify-center">
						<span className="text-muted-foreground text-[11px] uppercase font-bold tracking-wider">
							Pending
						</span>
					</div>
				);
		}
	};

	const getVerdictBadge = (verdict?: string) => {
		if (!verdict || verdict === "unknown")
			return <span className="text-muted">-</span>;
		switch (verdict) {
			case "malicious":
				return (
					<span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-danger/30 text-danger bg-danger/10">
						Malicious
					</span>
				);
			case "suspicious":
				return (
					<span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-warning/30 text-warning bg-warning/10">
						Suspicious
					</span>
				);
			case "clean":
				return (
					<span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-success/30 text-success bg-success/10">
						Clean
					</span>
				);
			default:
				return <span className="text-muted">-</span>;
		}
	};

	const getStatusGradient = (status: SandboxTaskStatus) => {
		switch (status) {
			case "running":
				return "from-accent/10 to-transparent";
			case "completed":
				return "from-success/5 to-transparent";
			case "failed":
				return "from-danger/10 to-transparent";
			default:
				return "from-transparent to-transparent";
		}
	};

	return (
		<div
			className={`flex flex-col min-h-0 overflow-hidden w-full relative bg-transparent ${className}`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-6 shrink-0 border-b border-border/10">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
						<h1 className="text-lg font-bold text-fg">{title}</h1>
					</div>
					<div className="text-sm font-medium text-muted">
						{
							displayTasks.filter((s) => s.status === "running")
								.length
						}{" "}
						Running • {displayTasks.length} Total
					</div>
				</div>
			</div>

			{/* Table Container */}
			<div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 pt-2">
				<motion.div
					className="space-y-2"
					variants={{
						visible: {
							transition: {
								staggerChildren: 0.05,
								delayChildren: 0.1,
							},
						},
					}}
					initial="hidden"
					animate="visible"
				>
					{/* Headers */}
					<div className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-medium text-muted uppercase tracking-wider bg-fg/2 border-b border-border">
						<div className="col-span-3">Sample</div>
						<div className="col-span-2">Verdict</div>
						<div className="col-span-2">Worker / Tenant</div>
						<div className="col-span-2">Submitted</div>
						<div className="col-span-2">Risk</div>
						<div className="col-span-1 text-right">Status</div>
					</div>

					{/* Rows */}
					{displayTasks.map((task) => (
						<motion.div
							key={task.id}
							variants={{
								hidden: {
									opacity: 0,
									y: 10,
									filter: "blur(4px)",
								},
								visible: {
									opacity: 1,
									y: 0,
									filter: "blur(0px)",
									transition: {
										type: "spring",
										stiffness: 400,
										damping: 28,
									},
								},
							}}
							className="relative cursor-pointer"
							onClick={() => openTaskModal(task)}
						>
							<motion.div
								className="relative bg-fg/5 border border-border/50 rounded-xl p-3 overflow-hidden"
								whileHover={{
									y: -1,
									transition: {
										type: "spring",
										stiffness: 400,
										damping: 25,
									},
								}}
							>
								{/* Status gradient overlay */}
								<div
									className={`absolute inset-0 bg-gradient-to-l ${getStatusGradient(task.status)} pointer-events-none`}
									style={{
										backgroundSize: "30% 100%",
										backgroundPosition: "right",
										backgroundRepeat: "no-repeat",
									}}
								/>

								{/* Grid Content */}
								<div className="relative grid grid-cols-12 gap-4 items-center">
									{/* Sample Name & Icon */}
									<div className="col-span-3 flex items-center gap-3">
										{getOSIcon(task.config.os)}
										<div className="flex flex-col min-w-0">
											<span className="text-fg font-semibold text-[13px] truncate">
												{task.name}
											</span>
											<span className="text-muted text-[10px] font-mono">
												{task.id}
											</span>
										</div>
									</div>

									{/* Verdict */}
									<div className="col-span-2">
										{getVerdictBadge(task.verdict)}
									</div>

									{/* Location & Tenant */}
									<div className="col-span-2 flex flex-col justify-center">
										<span className="text-fg text-[12px] font-medium">
											{task.worker || "Unassigned"}
										</span>
										<span className="text-muted text-[10px]">
											{task.tenant}
										</span>
									</div>

									{/* Due Date */}
									<div className="col-span-2 text-[12px] text-muted">
										{new Date(
											task.createdAt,
										).toLocaleString()}
									</div>

									{/* CPU / Risk */}
									<div className="col-span-2">
										{getRiskBars(
											task.risk || 0,
											task.status,
										)}
									</div>

									{/* Status */}
									<div className="col-span-1 flex justify-end">
										{getStatusBadge(task.status)}
									</div>
								</div>
							</motion.div>
						</motion.div>
					))}
				</motion.div>

				{/* Task Management Overlay - Inside Card */}
				<AnimatePresence>
					{selectedTask && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col rounded-2xl z-10 overflow-hidden"
						>
							{/* Header with Actions */}
							<div className="relative bg-surface p-5 border-b border-border flex items-start justify-between">
								<div className="flex items-center gap-4">
									{getOSIcon(selectedTask.config.os)}
									<div>
										<h3 className="text-lg font-bold text-fg">
											{selectedTask.name}
										</h3>
										<div className="flex items-center gap-2 mt-1">
											<span className="px-1.5 py-0.5 rounded bg-fg/10 text-secondary font-mono text-[10px]">
												{selectedTask.id}
											</span>
											<span className="text-sm text-muted">
												{selectedTask.worker ||
													"Unassigned"}
											</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<motion.button
										className="w-8 h-8 bg-fg/5 hover:bg-fg/10 rounded-full flex items-center justify-center border border-border transition-colors"
										onClick={(e) => {
											e.stopPropagation();
											closeTaskModal();
										}}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<X className="w-4 h-4 text-muted hover:text-fg" />
									</motion.button>
								</div>
							</div>

							{/* Content with Tabs */}
							<div className="flex-1 flex flex-col min-h-0 bg-bg">
								<div className="flex px-6 border-b border-border bg-surface overflow-x-auto custom-scrollbar shrink-0">
									{TABS.map((tab) => {
										const Icon = tab.icon;
										const isActive = activeTab === tab.id;
										return (
											<button
												key={tab.id}
												onClick={(e) => {
													e.stopPropagation();
													setActiveTab(tab.id);
												}}
												className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
													isActive
														? "border-accent text-accent"
														: "border-transparent text-muted hover:text-fg"
												}`}
											>
												<Icon className="w-4 h-4" />
												{tab.label}
											</button>
										);
									})}
								</div>
								<div className="flex-1 relative min-h-0 flex flex-col">
									<SandboxTaskDetail
										task={selectedTask}
										activeTab={activeTab}
									/>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
