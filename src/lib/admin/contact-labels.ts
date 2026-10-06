import type { ContactStatus } from "@/lib/admin/contacts";

export const CONTACT_STATUS_LABEL: Record<ContactStatus, string> = {
  NEW: "Yeni",
  READ: "Okundu",
  ARCHIVED: "Arşiv",
};

const PRODUCT_INTEREST_LABEL: Record<string, string> = {
  beanie: "Bere",
  scarf: "Atkı",
  set: "Bere + Atkı Seti",
  other: "Henüz karar vermedim",
};

export function contactStatusClass(status: ContactStatus): string {
  switch (status) {
    case "NEW":
      return "bg-gold-500/20 text-navy-900 ring-gold-500/40";
    case "READ":
      return "bg-navy-800/10 text-navy-900 ring-navy-800/20";
    case "ARCHIVED":
      return "bg-cream-200 text-navy-700 ring-cream-400/60";
  }
}

export function formatProductInterest(value: string | null | undefined): string {
  if (!value?.trim()) return "—";
  return PRODUCT_INTEREST_LABEL[value] ?? value;
}

export function truncateMessage(value: string, max = 80): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}
