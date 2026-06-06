import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DeepMail — Email Threat Intelligence Platform",
  description:
    "Upload any .eml or .msg. Get IOC extraction, geo-intel enrichment, hop-timeline analysis, and threat scores — in seconds.",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="marketing-scope bg-black text-[#e5e5e5]">
      {children}
    </div>
  );
}
