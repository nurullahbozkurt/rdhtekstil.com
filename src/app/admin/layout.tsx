import type { Metadata } from "next";
import { HtmlLang } from "@/components/site/html-lang";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: "Admin | RDH Tekstil",
    template: "%s | RDH Admin",
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="tr" />
      {children}
    </>
  );
}
