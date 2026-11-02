import type { FairVisitorStatus } from "@/lib/admin/fair-visitors";
import type { FairProductGroup, FairVisitorSource } from "@/lib/validation/fair-visitor";

export const FAIR_VISITOR_STATUS_LABEL: Record<FairVisitorStatus, string> = {
  NEW: "Yeni",
  MET: "Görüşüldü",
  QUOTED: "Teklif gönderildi",
  FOLLOW_UP: "Takipte",
};

export const FAIR_VISITOR_SOURCE_LABEL: Record<FairVisitorSource, string> = {
  STAFF: "Stand",
  QR: "QR Form",
};

export const FAIR_PRODUCT_GROUP_LABEL: Record<FairProductGroup, string> = {
  BEANIE: "Bere",
  SCARF: "Atkı",
  SATIN_SHAWL: "Saten şal",
  SET: "Set",
  OTHER: "Diğer",
};

export function fairVisitorSourceClass(source: FairVisitorSource): string {
  switch (source) {
    case "QR":
      return "bg-gold-500/20 text-navy-900 ring-gold-500/40";
    case "STAFF":
      return "bg-navy-800/10 text-navy-900 ring-navy-800/20";
  }
}

export function fairVisitorStatusClass(status: FairVisitorStatus): string {
  switch (status) {
    case "NEW":
      return "bg-gold-500/20 text-navy-900 ring-gold-500/40";
    case "MET":
      return "bg-navy-800/10 text-navy-900 ring-navy-800/20";
    case "QUOTED":
      return "bg-cream-200 text-navy-700 ring-cream-400/60";
    case "FOLLOW_UP":
      return "bg-gold-200/50 text-navy-900 ring-gold-500/30";
  }
}

export function formatFairProductGroup(value: string | null | undefined): string {
  if (!value?.trim()) return "—";
  return FAIR_PRODUCT_GROUP_LABEL[value as FairProductGroup] ?? value;
}
