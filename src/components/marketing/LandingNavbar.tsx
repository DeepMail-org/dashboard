"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { LiquidButton } from "@/components/marketing/ui/liquid-glass-button";

const NAV_LINKS = [
	{ label: "Features", href: "#capabilities" },
	{ label: "How It Works", href: "#how-it-works" },
	{ label: "FAQ", href: "#faq" },
	{ label: "Contact", href: "/contact" },
];

export function LandingNavbar({
	onUploadClick,
}: {
	onUploadClick: () => void;
}) {
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleNavClick = (href: string) => {
		setMobileOpen(false);
		if (href.startsWith("#")) {
			const el = document.getElementById(href.slice(1));
			if (el) el.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<>
			<nav className="fixed top-0 inset-x-0 z-50 py-3 px-6 flex items-center justify-between bg-transparent">
				{/* Left: Logo */}
				<div
					className="flex items-center gap-3 cursor-pointer"
					onClick={() =>
						window.scrollTo({ top: 0, behavior: "smooth" })
					}
				>
					<img
						src="/logo.svg"
						alt="DeepMail"
						className="w-8 h-8 shrink-0"
					/>
					<span className="font-display font-semibold text-[18px]">
						DeepMail
					</span>
				</div>

				{/* Right: auth buttons */}
				<div className="hidden lg:flex items-center gap-2.5">
					<Link href="/login">
						<LiquidButton
							size="sm"
							className="rounded-full px-5 py-2.5 text-[14px] font-medium text-white"
						>
							Log In
						</LiquidButton>
					</Link>
					<Link href="/signup">
						<LiquidButton
							size="sm"
							className="rounded-full px-5 py-2.5 text-[14px] font-medium text-white"
						>
							Sign Up
						</LiquidButton>
					</Link>
				</div>

				{/* Mobile Toggle */}
				<button
					className="lg:hidden p-2 text-(--secondary)"
					onClick={() => setMobileOpen(!mobileOpen)}
				>
					{mobileOpen ? <X /> : <Menu />}
				</button>
			</nav>

			{/* Mobile Menu */}
			{mobileOpen && (
				<div className="fixed inset-0 top-19 z-40 glass-strong p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 lg:hidden">
					<div className="flex flex-col gap-3">
						{NAV_LINKS.map((link) =>
							link.href.startsWith("#") ? (
								<button
									key={link.label}
									onClick={() => handleNavClick(link.href)}
									className="text-left text-sm text-white/60 hover:text-white py-2 border-b border-white/5 transition-colors"
								>
									{link.label}
								</button>
							) : (
								<Link
									key={link.label}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className="text-sm text-white/60 hover:text-white py-2 border-b border-white/5 transition-colors"
								>
									{link.label}
								</Link>
							),
						)}
					</div>
					<div className="mt-4 flex flex-col gap-3">
						<Link
							href="/login"
							onClick={() => setMobileOpen(false)}
						>
							<LiquidButton
								size="default"
								className="w-full rounded-full text-center font-medium text-white"
							>
								Log In
							</LiquidButton>
						</Link>
						<Link
							href="/signup"
							onClick={() => setMobileOpen(false)}
						>
							<LiquidButton
								size="default"
								className="w-full rounded-full text-center font-medium text-white"
							>
								Sign Up
							</LiquidButton>
						</Link>
					</div>
				</div>
			)}
		</>
	);
}
