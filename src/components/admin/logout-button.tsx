"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ctaVariants } from "../site/button-link";

export function AdminLogoutButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={cn(ctaVariants({ variant: "outline", size: "sm" }))}
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
