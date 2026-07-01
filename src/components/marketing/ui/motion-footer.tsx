"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  /* Dynamic Variables using standard shadcn/tailwind v4 tokens */
  --pill-bg-1: color-mix(in oklch, #ffffff 3%, transparent);
  --pill-bg-2: color-mix(in oklch, #ffffff 1%, transparent);
  --pill-shadow: color-mix(in oklch, #000000 50%, transparent);
  --pill-highlight: color-mix(in oklch, #ffffff 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, #000000 80%, transparent);
  --pill-border: color-mix(in oklch, #ffffff 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, #ffffff 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, #ffffff 2%, transparent);
  --pill-border-hover: color-mix(in oklch, #ffffff 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, #000000 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, #ffffff 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, #ef4444 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, #ef4444 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, #ffffff 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, #ffffff 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, #3f3f46 15%, transparent) 0%,
    color-mix(in oklch, #27272a 15%, transparent) 40%,
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
      0 10px 30px -10px var(--pill-shadow),
      inset 0 1px 1px var(--pill-highlight),
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
      0 20px 40px -10px var(--pill-shadow-hover),
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #ffffff;
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 16vw;
  line-height: 0.85;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, #ffffff 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, #ffffff 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #ffffff 0%, color-mix(in oklch, #ffffff 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, #ffffff 15%, transparent));
}
`;

// -------------------------------------------------------------------------
// 2. FOOTER COLUMN HELPER
// -------------------------------------------------------------------------
function FooterColumn({
	title,
	links,
}: {
	title: string;
	links: { label: string; href: string }[];
}) {
	return (
		<div className="flex flex-col gap-3">
			<p className="text-xs font-semibold tracking-widest uppercase text-foreground/40">
				{title}
			</p>
			<ul className="flex flex-col gap-2.5">
				{links.map(({ label, href }) => (
					<li key={label}>
						<a
							href={href}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
						>
							{label}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

// -------------------------------------------------------------------------
// 3. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps =
	React.ButtonHTMLAttributes<HTMLButtonElement> &
		React.AnchorHTMLAttributes<HTMLAnchorElement> & {
			as?: React.ElementType;
		};

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
	(
		{ className, children, as: Component = "button", ...props },
		forwardedRef,
	) => {
		const localRef = useRef<HTMLElement>(null);

		useEffect(() => {
			if (typeof window === "undefined") return;
			const element = localRef.current;
			if (!element) return;

			const ctx = gsap.context(() => {
				const handleMouseMove = (e: MouseEvent) => {
					const rect = element.getBoundingClientRect();
					const h = rect.width / 2;
					const w = rect.height / 2;
					const x = e.clientX - rect.left - h;
					const y = e.clientY - rect.top - w;

					gsap.to(element, {
						x: x * 0.4,
						y: y * 0.4,
						rotationX: -y * 0.15,
						rotationY: x * 0.15,
						scale: 1.05,
						ease: "power2.out",
						duration: 0.4,
					});
				};

				const handleMouseLeave = () => {
					gsap.to(element, {
						x: 0,
						y: 0,
						rotationX: 0,
						rotationY: 0,
						scale: 1,
						ease: "elastic.out(1, 0.3)",
						duration: 1.2,
					});
				};

				element.addEventListener("mousemove", handleMouseMove as any);
				element.addEventListener("mouseleave", handleMouseLeave);

				return () => {
					element.removeEventListener(
						"mousemove",
						handleMouseMove as any,
					);
					element.removeEventListener("mouseleave", handleMouseLeave);
				};
			}, element);

			return () => ctx.revert();
		}, []);

		return (
			<Component
				ref={(node: HTMLElement) => {
					(localRef as any).current = node;
					if (typeof forwardedRef === "function") forwardedRef(node);
					else if (forwardedRef) (forwardedRef as any).current = node;
				}}
				className={cn("cursor-pointer", className)}
				{...props}
			>
				{children}
			</Component>
		);
	},
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
	<div className="flex items-center space-x-12 px-6">
		<span>Advanced Threat Intel</span>{" "}
		<span className="text-primary/60">✦</span>
		<span>Real-Time Scanning</span>{" "}
		<span className="text-secondary/60">✦</span>
		<span>Deep Learning Models</span>{" "}
		<span className="text-primary/60">✦</span>
		<span>Sub-second Execution</span>{" "}
		<span className="text-secondary/60">✦</span>
		<span>Zero Trust Architecture</span>{" "}
		<span className="text-primary/60">✦</span>
	</div>
);

export function CinematicFooter() {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const giantTextRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const linksRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (!wrapperRef.current) return;

		// React strict mode compatible GSAP context cleanup
		const ctx = gsap.context(() => {
			// Background Parallax
			gsap.fromTo(
				giantTextRef.current,
				{ y: "10vh", scale: 0.8, opacity: 0 },
				{
					y: "0vh",
					scale: 1,
					opacity: 1,
					ease: "power1.out",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: "top 80%",
						end: "bottom bottom",
						scrub: 1,
					},
				},
			);

			// Staggered Content Reveal
			gsap.fromTo(
				[linksRef.current],
				{ y: 50, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					stagger: 0.15,
					ease: "power3.out",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: "top 40%",
						end: "bottom bottom",
						scrub: 1,
					},
				},
			);
		}, wrapperRef);

		return () => ctx.revert();
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: STYLES }} />

			{/*
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box.
      */}
			<div
				ref={wrapperRef}
				className="relative h-screen w-full"
				style={{
					clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
				}}
			>
				<footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-black text-white cinematic-footer-wrapper">
					{/* Ambient Light & Grid Background */}
					<div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
					<div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

					{/* Giant background text */}
					<div
						ref={giantTextRef}
						className="footer-giant-bg-text absolute bottom-12 md:bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
					>
						DEEPMAIL
					</div>

					{/* 1. Diagonal Sleek Marquee (Top of footer) */}
					<div className="absolute top-28 left-0 w-full overflow-hidden border-y border-border/50 bg-background/60 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl">
						<div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">
							<MarqueeItem />
							<MarqueeItem />
						</div>
					</div>

					{/* 2. Column Navigation Grid */}
					<div
						ref={linksRef}
						className="relative z-10 flex flex-1 flex-col justify-center px-8 md:px-16 mt-28 w-full max-w-6xl mx-auto"
					>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 pb-10 border-b border-foreground/6">
							<div className="col-span-2 md:col-span-1 flex flex-col gap-4">
								<a
									href="/"
									className="flex items-center gap-2.5 w-fit group"
								>
									<img
										src="/logo.svg"
										alt="DeepMail"
										className="h-9 w-9"
									/>
									<span className="font-display font-semibold text-[16px] text-foreground/90">
										DeepMail
									</span>
								</a>
								<p className="text-xs text-muted-foreground leading-relaxed max-w-40">
									Advance email threat intelligence.
									<br />© {new Date().getFullYear()} DeepMail.
								</p>
							</div>

							{/* Pages */}
							<FooterColumn
								title="Pages"
								links={[
									{ label: "Home", href: "/" },
									{ label: "Contact", href: "/contact" },
									{ label: "Pricing", href: "/payments" },
								]}
							/>

							{/* Socials */}
							<FooterColumn
								title="Socials"
								links={[
									{
										label: "Twitter / X",
										href: "https://x.com/deepmail",
									},
									{
										label: "LinkedIn",
										href: "https://linkedin.com/company/deepmail",
									},
									{
										label: "GitHub",
										href: "https://github.com/deepmail",
									},
								]}
							/>

							{/* Legal */}
							<FooterColumn
								title="Legal"
								links={[
									{
										label: "Privacy Policy",
										href: "/privacy",
									},
									{
										label: "Terms of Service",
										href: "/terms",
									},
									{
										label: "Cookie Policy",
										href: "/cookies",
									},
								]}
							/>
						</div>
					</div>

					{/* 3. Bottom Bar / Credits */}
					<div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-end gap-6">
						{/* Back to top */}
						<MagneticButton
							as="button"
							onClick={scrollToTop}
							className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group order-3"
						>
							<svg
								className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 10l7-7m0 0l7 7m-7-7v18"
								></path>
							</svg>
						</MagneticButton>
					</div>
				</footer>
			</div>
		</>
	);
}
