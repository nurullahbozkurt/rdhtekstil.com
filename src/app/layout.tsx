import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  applicationName: "RDH Tekstil",
};

export const viewport: Viewport = {
  themeColor: "#f7f2e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={cn(manrope.variable, fraunces.variable)}>
      <body className="min-h-dvh bg-cream-100 font-sans text-navy-900 antialiased">{children}</body>
    </html>
  );
}
