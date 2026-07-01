import { cn } from "@/lib/utils";
import {
	IconShieldLock,
	IconWorldWww,
	IconHash,
	IconLink,
	IconBolt,
	IconChartRadar,
	IconCode,
	IconBoxMultiple,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
	const features = [
		{
			title: "IOC Extraction",
			description:
				"Pull every IP, domain, URL and hash out of raw .eml — including MIME-encoded payloads, base64 attachments and obfuscated headers. Nothing slips through.",
			icon: <IconShieldLock />,
		},
		{
			title: "Geo-Intelligence",
			description:
				"MaxMind-powered enrichment maps every signal to a country, ASN and risk tier — hostile, watchlist or trusted — in milliseconds.",
			icon: <IconWorldWww />,
		},
		{
			title: "Hash Lookups",
			description:
				"Cross-check MD5, SHA1 and SHA256 hashes against VirusTotal, MalwareBazaar and our private corpus. Known malware never hides twice.",
			icon: <IconHash />,
		},
		{
			title: "URL Reputation",
			description:
				"Resolve, fingerprint and score every link — homoglyphs, multi-hop redirects and freshly-registered zero-day domains included.",
			icon: <IconLink />,
		},
		{
			title: "Streaming Pipeline",
			description:
				"Redis Streams + WebSockets push live PARSE → SCORE stage updates as they complete. Your dashboard updates before you blink.",
			icon: <IconBolt />,
		},
		{
			title: "Threat Scoring",
			description:
				"Six weighted pipeline stages collapse into a single 0–100 confidence score, calibrated against MITRE ATT&CK TTP patterns.",
			icon: <IconChartRadar />,
		},
		{
			title: "Developer API",
			description:
				"Full OpenAPI spec with REST + WebSocket endpoints for every UI feature. Webhook support for SIEM integration. Bring your own stack.",
			icon: <IconCode />,
		},
		{
			title: "Isolated Sandbox",
			description:
				"Every attachment detonates inside a network-segmented, ephemeral worker container. Zero raw payload retention after analysis completes.",
			icon: <IconBoxMultiple />,
		},
	];
	return (
		<div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
			{features.map((feature, index) => (
				<Feature key={feature.title} {...feature} index={index} />
			))}
		</div>
	);
}

const Feature = ({
	title,
	description,
	icon,
	index,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	index: number;
}) => {
	return (
		<div
			className={cn(
				"group/feature relative flex flex-col py-10 lg:border-r border-white/6 transition-all duration-300",
				(index === 0 || index === 4) && "lg:border-l border-white/6",
				index < 4 && "lg:border-b border-white/6",
			)}
			style={{
				boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 0 0 0 rgba(255,255,255,0)",
			}}
		>
			{/* Bright top-glow overlay on hover — top row */}
			{index < 4 && (
				<div className="pointer-events-none absolute inset-0 h-full w-full bg-linear-to-t from-white/[0.07] via-white/[0.04] to-transparent opacity-0 transition-all duration-300 group-hover/feature:opacity-100" />
			)}
			{/* Bright bottom-glow overlay on hover — bottom row */}
			{index >= 4 && (
				<div className="pointer-events-none absolute inset-0 h-full w-full bg-linear-to-b from-white/[0.07] via-white/[0.04] to-transparent opacity-0 transition-all duration-300 group-hover/feature:opacity-100" />
			)}
			{/* Radial spotlight from icon position */}
			<div className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-all duration-300 group-hover/feature:opacity-100"
				style={{ background: "radial-gradient(circle at 48px 48px, rgba(255,255,255,0.08) 0%, transparent 55%)" }}
			/>
			<div className="relative z-10 mb-4 px-10 text-white/50 transition-all duration-300 group-hover/feature:text-white/90 group-hover/feature:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">{icon}</div>
			<div className="relative z-10 mb-2 px-10 text-lg font-bold">
				<div className="absolute left-0 inset-y-0 my-auto h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-white/15 shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300 group-hover/feature:h-10 group-hover/feature:bg-white group-hover/feature:shadow-[0_0_16px_rgba(255,255,255,0.9)]" />
				<span className="inline-block text-white/90 transition-all duration-300 group-hover/feature:translate-x-2 group-hover/feature:text-white">
					{title}
				</span>
			</div>
			<p className="relative z-10 max-w-xs px-10 text-sm text-white/45 leading-relaxed transition-colors duration-300 group-hover/feature:text-white/65">
				{description}
			</p>
		</div>
	);
};
