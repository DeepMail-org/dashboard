"use client";
import React from "react";
import { motion } from "framer-motion";
import { Hash, MessageSquare, AtSign, Code2, Search } from "lucide-react";

export function FeaturesAndBenefits() {
	return (
		<section className="relative w-full overflow-hidden py-20">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)",
				}}
			/>
			<div className="relative mx-auto max-w-6xl px-6">
				{/* Heading */}
				<header className="mb-12 text-center">
					<h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold tracking-tight text-white">
						Adopted by analysts. Loved by SOCs.
					</h2>
				</header>

				{/* Two columns */}
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
					<UserAdoptionCard />
					<TestimonialCard />
				</div>
			</div>
		</section>
	);
}

// ============================================================
// LEFT CARD — Major User Adoption
// ============================================================
function UserAdoptionCard() {
	const integrations = [
		{ Icon: MessageSquare, label: "Slack" },
		{ Icon: Hash, label: "Splunk" },
		{ Icon: AtSign, label: "Mailgun" },
		{ Icon: Search, label: "VirusTotal" },
		{ Icon: Code2, label: "GitHub" },
	];

	interface Contributor {
		id: number;
		login: string;
		avatar_url: string;
	}
	const [contributors, setContributors] = React.useState<Contributor[]>([]);

	React.useEffect(() => {
		fetch(
			"https://api.github.com/repos/DeepMail-org/dashboard/contributors",
		)
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setContributors(data.slice(0, 5));
				}
			})
			.catch(console.error);
	}, []);

	const avatars = [
		{ initials: "JS", tone: "from-rose-400 to-amber-400" },
		{ initials: "MA", tone: "from-cyan-400 to-violet-400" },
		{ initials: "EK", tone: "from-emerald-400 to-cyan-400" },
		{ initials: "TR", tone: "from-violet-400 to-pink-400" },
		{ initials: "AL", tone: "from-amber-400 to-rose-400" },
	];

	return (
		<div className="group/card relative overflow-hidden rounded-3xl border border-white/8 bg-white/2 p-7 transition-all duration-300 hover:border-white/15 hover:bg-white/4">
			{/* Top row: integrations + big number */}
			<div className="flex items-start justify-between gap-4">
				{/* Integrations strip */}
				<div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-2">
					{integrations.map(({ Icon, label }, i) => (
						<motion.div
							key={label}
							initial={{ opacity: 0, scale: 0.7 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.05, duration: 0.3 }}
							whileHover={{ y: -2 }}
							className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/4 transition-colors hover:border-white/20"
							title={label}
						>
							<Icon
								className="h-4 w-4 text-white/70"
								strokeWidth={1.6}
							/>
						</motion.div>
					))}
				</div>

				{/* Big number */}
				<div className="text-right">
					<div className="font-display text-3xl md:text-4xl font-semibold leading-none text-white">
						50,000+
					</div>
					<div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
						Security analysts onboarded
					</div>
				</div>
			</div>

			{/* Avatars row */}
			<div className="mt-7 flex -space-x-2">
				{contributors.length > 0
					? contributors.map((c, i) => (
							<motion.div
								key={c.id}
								initial={{ opacity: 0, x: -10 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3 + i * 0.05 }}
								className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-black ring-0 transition-all duration-200 hover:z-10 hover:scale-110 overflow-hidden"
								title={c.login}
							>
								<img
									src={c.avatar_url}
									alt={c.login}
									className="h-full w-full object-cover"
								/>
							</motion.div>
						))
					: avatars.map((a, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, x: -10 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3 + i * 0.05 }}
								className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-linear-to-br ${a.tone} text-[11px] font-semibold text-white/95 ring-0 transition-all duration-200 hover:z-10 hover:scale-110`}
							>
								{a.initials}
							</motion.div>
						))}
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 + 5 * 0.05 }}
					className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-linear-to-br from-white/30 to-white/10 text-[11px] font-semibold text-white/95 ring-0 transition-all duration-200 hover:z-10 hover:scale-110"
				>
					+
				</motion.div>
			</div>

			{/* Footer text */}
			<div className="mt-8 border-t border-white/6 pt-6">
				<h3 className="font-display text-2xl font-semibold leading-tight text-white">
					Major
					<br />
					User Adoption
				</h3>
				<p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">
					Join a community of analysts and IR teams who trust DeepMail
					to triage every suspicious email — in seconds, at scale,
					every shift.
				</p>
			</div>
		</div>
	);
}

// ============================================================
// RIGHT CARD — Creator & Testimonial
// ============================================================
function TestimonialCard() {
	return (
		<div className="group/card relative overflow-hidden rounded-3xl border border-white/8 bg-white/2 p-7 transition-all duration-300 hover:border-white/15 hover:bg-white/4 shadow-[0_8px_40px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)]">
			{/* Header */}
			<div>
				<h3 className="font-display text-3xl md:text-4xl font-semibold leading-[1.05] text-white">
					Designed by
					<br />
					practitioners
				</h3>
				<p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
					Built from the ground up to solve real email analysis
					challenges and speed up threat triaging.
				</p>
			</div>

			{/* Floating testimonial card */}
			<div className="relative mt-10">
				{/* Subtle background card (peeking) */}
				<div className="absolute -right-4 -top-4 hidden h-full w-full rounded-2xl border border-white/5 bg-white/2 md:block" />

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.45, ease: "easeOut" }}
					whileHover={{ y: -2 }}
					className="relative rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm"
				>
					{/* Avatar + name */}
					<div className="flex items-center gap-3">
						<img
							src="/me.jpg"
							alt="Vyom Jain"
							className="h-10 w-10 rounded-full object-cover border border-white/10 shrink-0"
						/>
						<div>
							<p className="text-sm font-medium text-white/90">
								Vyom Jain
							</p>
							<p className="text-[11px] text-white/35">
								Security Engineer & Creator of DeepMail
							</p>
						</div>
					</div>

					{/* Quote */}
					<p className="mt-4 text-sm leading-relaxed text-white/60">
						&ldquo;DeepMail was built out of frustration with slow,
						manual email analysis pipelines. My goal is to give
						security analysts immediate, rich threat intelligence
						without any overhead.&rdquo;
					</p>
				</motion.div>
			</div>
		</div>
	);
}
