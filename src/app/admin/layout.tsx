import type { Metadata } from "next";
import { HtmlLang } from "@/components/site/html-lang";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin | RDH Tekstil",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="tr" />
      {children}
    </>
  );
}
