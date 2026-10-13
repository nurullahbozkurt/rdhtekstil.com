import { AdminShell } from "@/components/admin/shell";
import { HtmlLang } from "@/components/site/html-lang";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang lang="tr" />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
